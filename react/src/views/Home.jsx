import {Link, Navigate} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {createRef, useEffect, useRef} from "react";
import {useStateContext} from "../context/ContextProvider.jsx";
import { useState } from "react";
import {UilClipboard, UilCommentAltNotes, UilGoogleHangoutsAlt, UilMessage} from '@iconscout/react-unicons'
import Snippets from "../components/Snippets.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PerfectScrollbar from 'react-perfect-scrollbar'
import ChatMessage from "../components/ChatMessage.jsx";
import CommandInfo from "../components/CommandInfo.jsx";
import {toast} from "react-toastify";

export default function Home() {
  const {user, token, setUser, setToken, notification} = useStateContext();
  const bottomRef = useRef(null);
  const [activeMode, setActiveMode] = useState(null);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [message, setMessage] = useState("");
  const [showCommandInfo, setShowCommandInfo] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [messageHistoryIndex, setMessageHistoryIndex] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [messageHeight, setMessageHeight] = useState("auto");
  const messageRef = useRef(null);
  const LIMIT_MESSAGE = 1256;

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  if (!token) {
    return <Navigate to="/login"/>
  }

  useEffect(() => {
    getMessagesConversation();
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, []);



  const handleTextChange = (event) => {
    const value = event.target.value;
    const isBackspaceOrDelete =
      event.nativeEvent.inputType === "deleteContentBackward" ||
      event.nativeEvent.inputType === "deleteContentForward";
    if (value.length <= LIMIT_MESSAGE || isBackspaceOrDelete) {
      setMessage(value);
    } else {
      const slicedValue = value.slice(0, LIMIT_MESSAGE);
      setMessage(slicedValue);
    }

    if (value.charAt(0) === "!"){
      setShowCommandInfo(true);
    }else{
      setShowCommandInfo(false);
    }
  };

  const handlePaste = (event) => {
    const pastedText = event.clipboardData.getData("text");
    if (pastedText.length > LIMIT_MESSAGE) {
      const slicedText = pastedText.slice(0, LIMIT_MESSAGE);
      setMessage(slicedText);
      event.preventDefault();
    }
  };

  const handleMessageSend = async () => {
    setCanSendMessage(false);
    const newMessage = {
      sender: "me",
      message: {original: message},
      date: new Date(),
      id: generateUniqueId(),
      translated: false,
      loaded: true,
    };

    const aiMessage = {
      sender: "ai",
      message: {original: ''},
      date: new Date(),
      id: generateUniqueId(),
      translated: false,
      loaded: false,
    };
    setShowCommandInfo(false);
    setMessages((messages) => [...messages, newMessage, aiMessage]);
    setMessageHistory((messageHistory) => [...messageHistory, message]);
    const payload = {
      message: message,
      mode: activeMode
    };


    if (message.startsWith("!")) {
      // ====  COMMAND  ====

        axiosClient.post(`/chat/message`, payload)
          .then(({data}) => {
            console.log(data)
            setMessages((messages) =>
              messages.map((m) =>
                m.id === aiMessage.id
                  ? {...m, message: {original: data.view}, loaded: true}
                  : m
              )
            );
          })
          .catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              //setErrors(response.data.errors)
            }
          })

      // ====  COMMAND  ====
    }else{

      // ====  CHAT GPT  ====
        const token = localStorage.getItem('ACCESS_TOKEN');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const reader = response.body.getReader();
        const textDecoder = new TextDecoder("utf-8");

        let messageBuffer = "";

        const processMessage = (message) => {
          if (message.startsWith("data:")) {
            const data = JSON.parse(message.slice("data:".length).trim());
            if(typeof data.delta.content !== "undefined"){
              setMessages((messages) =>
                messages.map((m) =>
                  m.id === aiMessage.id
                    ? { ...m, message: { original: m.message.original + data.delta.content }, loaded: true }
                    : m
                )
              );
            }
            // console.log(data.delta.content);
          }
        };

        const readStream = async () => {
          try {
            const { done, value } = await reader.read();
            if (done) {
              return;
            }

            const textChunk = textDecoder.decode(value);
            const messages = (messageBuffer + textChunk).split("\n");

            // == Normal message is returned then display it (not chatgpt)
            try{
              if (Array.isArray(messages)) {
                const jsonString = messages[0];
                const jsonObject = JSON.parse(jsonString);
                if ('view' in jsonObject) {
                  setMessages((messages) =>
                    messages.map((m) =>
                      m.id === aiMessage.id
                        ? {...m, message: {original: jsonObject.view}, loaded: true}
                        : m
                    )
                  );
                  setMessage("");
                  setMessageHeight("auto");
                  setCanSendMessage(true);
                  return true;
                }
              }
            }catch (error){}
            // == Normal message is returned then display it (not chatgpt)

            messageBuffer = messages.pop();

            messages.forEach(processMessage);

            await readStream();
          } catch (error) {
            console.error("Error reading stream:", error);
          }
        };

        await readStream();
      // ====  CHAT GPT  ====
    }

    scrollToBottom();
    setMessage("");
    setMessageHeight("auto");
    setCanSendMessage(true);
  };

  /**
   * Method generate unique id for messages
   * @returns {number|*}
   */
  const generateUniqueId = () => {
    const randomId = Math.random();
    const idExists = messages.some((message) => message.id === randomId);
    if (idExists) {
      return generateUniqueId();
    } else {
      return randomId;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp" && messageHistoryIndex < messageHistory.length - 1) {
      setMessageHistoryIndex((prev) => prev + 1);
      setMessage(messageHistory[messageHistory.length - 1 - messageHistoryIndex - 1]);
    } else if (event.key === "ArrowDown" && messageHistoryIndex >= 0) {
      setMessageHistoryIndex((prev) => prev - 1);
      if (messageHistoryIndex === 0) {
        setMessage("");
      } else {
        setMessage(messageHistory[messageHistory.length - 1 - messageHistoryIndex + 1]);
      }
    }
  };

  const clearConversation = () => {
    axiosClient.get(`/chat/clear`)
      .then(({data}) => {
        setMessages([]);
      })
    scrollToBottom();
  }

  const getMessagesConversation = () => {
    axiosClient.get(`/chat/messages`)
      .then(({data}) => {
        setMessages([]);
        data.map((message) => {
          setMessages(prevMessages => prevMessages.concat([
            {
              sender: "me",
              message: { original: message.message },
              date: new Date(message.created_at),
              id: generateUniqueId(),
              translated: false,
              loaded: true,
            },
            {
              sender: "ai",
              message: { original: message.result },
              date: new Date(message.created_at),
              id: generateUniqueId(),
              translated: false,
              loaded: true,
            },
          ]));
          scrollToBottom();
        });
        scrollToBottom();
      })
  }

  return (
    <div className="w-full h-screen text-white flex flex-col justify-between mb-12">


      <CommandInfo showCommandInfo={showCommandInfo}
                   setShowCommandInfo={setShowCommandInfo}
                   message={message}/>

      {/*Snippets*/}
      <div className="mb-5">
        <Snippets
          activeMode={activeMode}
          setActiveMode={setActiveMode}
        />
      </div>


        <div className="mx-4 md:mx-12 h-full" ref={bottomRef}>
          <ChatMessage messages={messages} />
          <div className="bottomChat"></div>
        </div>



      <div className="px-6 pb-39 sticky bottom-0 bg-ai-b z-10" style={{width: '-webkit-fill-available', position: 'fixed'}}>
        <div className="relative mt-2 rounded-md shadow-sm ">
          <textarea type="text" name="price" id="price" rows={4}
                 className="block w-full rounded-2xl text-white bg-ai-b ring-1 ring-inset ring-ai-t bg-ai-b text-md align-middle focus:ring-0 p-4 focus:ring-ai-t"
                 // className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 placeholder="" style={{ height: "auto", minHeight: "50px", resize: "vertical" }} // ustawianie minimalnej wysokości

                    value={message}
                    onChange={handleTextChange}
                    ref={messageRef}
                    onPaste={handlePaste}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleMessageSend();
                      }
                    }}
                    onKeyDown={handleKeyDown}
          />
            <div className="absolute inset-y-0 right-0 flex items-end mr-2 mb-2">
              <button
                className={` ${canSendMessage ? 'bg-ai-button' : 'bg-ai-disabled'} text-white rounded-full p-2`}
                onClick={handleMessageSend}
                disabled={!canSendMessage}
              >
                <UilMessage color="#fff" className="pl-1" size="20"/>
              </button>
            </div>
        </div>

        <div className="flex justify-between py-1 mb-5">
          <div className="cursor-pointer hover:underline select-none" onClick={clearConversation}>
            Restart Conversation
          </div>
          <div className="cursor-pointer hover:underline select-none" onClick={scrollToBottom}>
            Scroll to bottom
          </div>
          <div className="text-right">
            { message.length } / {LIMIT_MESSAGE}
          </div>
        </div>
      </div>

    </div>
  )
}
