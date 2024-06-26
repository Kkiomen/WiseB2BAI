import {useNavigate, useParams} from "react-router-dom";
import Header from "./utils/Header.jsx";
import ChatMessages from "./utils/ChatMessages.jsx";
import {useEffect, useRef, useState} from "react";
import Snippets from "./utils/Snippets.jsx";
import axiosClient from "../axios-client.js";
import {generateUniqueId} from "../functions/Helpers.js";
import {useCookies} from "react-cookie";
import {toast} from 'react-toastify';

export default function AssistantChat({navigation}) {
  const {assistantId} = useParams();
  const chatRef = useRef();
  const [messages, setMessages] = useState([]);
  const LIMIT_MESSAGE = 8192;
  const [assistant, setAssistant] = useState([]);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [message, setMessage] = useState("");
  const [sessionHash, setSessionHash] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["sessionHash_" + assistantId]);

  useEffect(() => {
    getAssistant();
    generateNewHash();
    getMessagesConversation();
  }, [assistantId]);

  const generateNewHash = () => {
    if(cookies["sessionHash_" + assistantId] === undefined) {
      generateHash();
    }else{
      setSessionHash(cookies["sessionHash_" + assistantId]);
    }
  }

  const generateHash = () => {
    axiosClient.get(`/session`)
      .then(({data}) => {
        setSessionHash(data.session_hash);
        setCookie("sessionHash_" + assistantId, data.session_hash)
      })
  }

  const getAssistant = () => {
    axiosClient.get(`/assistant/` + assistantId)
      .then(({data}) => {
        if(data.name === null){
          toast('Not found this assistant', {
            position: "top-right",
            theme: "dark",
            draggable: true,
          });

        }
        setAssistant(data);
      })
  }

  const getSessionHash = () => {
    if(cookies["sessionHash_" + assistantId] === undefined) {
      generateNewHash();
    }
    return cookies["sessionHash_" + assistantId] ?? sessionHash;
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      document.getElementById('chatBox').scrollTo({
        top: document.getElementById('chatBox').scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  const getMessagesConversation = () => {
    axiosClient.post(`/messages`, {
      'session_hash': getSessionHash()
    })
      .then(({data}) => {
        setMessages([]);
        data.map((message) => {
          let currentSender = "me";
          if(message.sender === 'user'){
            currentSender = "me";
          }else if(message.sender === "assistant"){
            currentSender = "ai";
          }

          setMessages(prevMessages => prevMessages.concat([
            {
              sender: currentSender,
              message: {original: message.content},
              links: message.links,
              id: generateUniqueId(messages),
              translated: false,
              loaded: true,
            }
          ]));
        });

        if (data.length === 0 && assistant.start_message !== null) {
          setMessages(prevMessages => prevMessages.concat([
            {
              sender: "ai",
              message: {original: assistant.start_message},
              links: message.links,
              id: generateUniqueId(messages),
              translated: false,
              loaded: true,
            }
          ]));
        }

      })
  }

  const getLinkForMessage = (message, assistantId, messageAi) => {
    axiosClient.post(`/message/new/link`,{
      message: message,
      assistant: assistantId,
    })
      .then(({data}) => {
        console.log(messageAi);
        console.log(data);
        setMessages((messages) =>
          messages.map((m) =>
            m.id === messageAi.id
              ? {...m, links: data, loaded: true}
              : m
          )
        );
        console.log(messages);
      })

  }

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
  };

  const regenerateResponse = (aiMessage) => {
    aiMessage.loaded = false;
    aiMessage.message.original = '';
    generateResponse(aiMessage, aiMessage.id)
  }

  const generateResponse = async (aiMessage, id = null, payload = null) => {
    setCanSendMessage(false);

    if (payload == null) {
      payload = {
        message: message,
        assistant: assistantId,
        session: sessionHash
      };
    }


    // let id = generateUniqueId(messages);
    // ====  CHAT GPT  ====
    const token = localStorage.getItem('ACCESS_TOKEN');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/message/new`, {
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
        if (typeof data.id !== "undefined") {
          id = data.id;
        }
        if (typeof data.delta.content !== "undefined") {
          setMessages((messages) =>
            messages.map((m) =>
              m.id === aiMessage.id
                ? {...m, message: {original: m.message.original + data.delta.content}, loaded: true}
                : m
            )
          );
        }
      }
    };

    const readStream = async () => {
      try {
        const {done, value} = await reader.read();
        if (done) {
          return;
        }

        const textChunk = textDecoder.decode(value);
        const messages = (messageBuffer + textChunk).split("\n");

        // == Normal message is returned then display it (not chatgpt)
        try {
          if (Array.isArray(messages)) {
            const jsonString = messages[0];
            const response = JSON.parse(jsonString);
            if ('view' in response) {
              setMessages((messages) =>
                messages.map((m) =>
                  m.id === aiMessage.id
                    ? {...m, message: {original: response.view}, loaded: true}
                    : m
                )
              );

              // Jeśli zwracana many Response to je wykonuje
              handleManyResponse(response);
              // Jeśli zwracana many Response to je wykonuje
              setMessage("");
              setCanSendMessage(true);
              return true;
            }
          }
        } catch (error) {
        }
        // == Normal message is returned then display it (not chatgpt)

        messageBuffer = messages.pop();
        messages.forEach(processMessage);
        scrollToBottom();
        await readStream();
        scrollToBottom();
        messages.map((m) =>
          m.id === aiMessage.id
            ? {...m, message: {id: id}, loaded: true}
            : m
        )

      } catch (error) {
        console.error("Error reading stream:", error);
      }
    };

    await readStream();
    // ====  CHAT GPT  ====
    // getLinkForMessage(message, assistantId, aiMessage);
    getMessagesConversation();
    setMessage("");
    setCanSendMessage(true);
  }

  const getConversation = (id) => {
    axiosClient.get(`/chat/conversation/${id}`)
      .then(({data}) => {
        setMessages([]);
        data.map((message) => {
          setMessages(prevMessages => prevMessages.concat([
            {
              sender: "me",
              message: {original: message.message},
              date: new Date(message.created_at),
              id: generateUniqueId(messages),
              translated: false,
              loaded: true,
            },
            {
              sender: "ai",
              message: {original: message.result},
              date: new Date(message.created_at),
              id: message.id,
              translated: false,
              loaded: true,
            },
          ]));
        });
      });
  }

  const handlePaste = (event) => {
    if (event.clipboardData && event.clipboardData.items) {
      // Text
      const pastedText = event.clipboardData.getData("text");
      if (pastedText.length > LIMIT_MESSAGE) {
        const slicedText = pastedText.slice(0, LIMIT_MESSAGE);
        setMessage(slicedText);
        event.preventDefault();
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleMessageSend();
    }
  };

  const clearConversation = () => {
    axiosClient.post(`/messages/clear`, {
      "session_hash": cookies["sessionHash_" + assistantId]
    })
      .then(({data}) => {
        setCookie("sessionHash_" + assistantId, undefined);
        generateHash();
        setMessage([]);
        getMessagesConversation();
      })
    scrollToBottom();
  }

  const processMessage = (userMessage) => {
    return true;
  }

  const handleMessageSend = async () => {
    if (processMessage(message)) {
      const newMessage = {
        sender: "me",
        message: {original: message},
        date: new Date(),
        id: generateUniqueId(messages),
        translated: false,
        loaded: true,
      };

      const aiMessage = {
        sender: "ai",
        message: {original: ''},
        date: new Date(),
        id: generateUniqueId(messages),
        translated: false,
        loaded: false,
      };
      setMessages((messages) => [...messages, newMessage]);
      await generateResponseAi(aiMessage, message);
    }
  };

  const generateResponseAi = async (aiMessage, message, payload) => {
    // setMessage(message);
    setMessages((messages) => [...messages, aiMessage]);
    await generateResponse(aiMessage, null, payload);
  }

  return (
    <div className="mx-0 h-screen">
      <div className="w-full relative bg-ai-conversation-page flex flex-col justify-between h-screen">
        <Header assistant={assistant} session={sessionHash}/>
        <div className="overflow-y-auto" id="chatBox" ref={chatRef}>

          <ChatMessages messages={messages} regenerate={regenerateResponse} assistant={assistant}/>
        </div>
        <div className="px-6 pt-5 border-t border-ai-conversation-border">
          <textarea
            type="text"
            rows="4"
            className={`block w-full rounded-2xl text-white bg-transparent ring-3 focus:ring-0 ${!canSendMessage ? 'ring-ai-conversation-border' : 'ring-black'}  bg-ai-b text-sm align-middle `}
            placeholder=""
            value={message}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          ></textarea>
          <div className="flex justify-between py-1 mb-5 text-white">
            <div
              onClick={clearConversation}
              className="cursor-pointer hover:underline select-none">
              Restart Conversation
            </div>
            <div className="cursor-pointer hover:underline select-none" onClick={scrollToBottom}>
              Scroll to bottom
            </div>
            <div className="text-right">
              {message.length} / {LIMIT_MESSAGE}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
