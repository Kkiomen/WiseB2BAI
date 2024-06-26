import {useStateContext} from "../context/ContextProvider.jsx";
import {generateUniqueId} from "../functions/Helpers.js";
import {useEffect, useRef, useState} from "react";
import ChatMessages from "./utils/ChatMessages.jsx";
import axiosClient from "../axios-client.js";
import CommandInfo from "./CommandInfo.jsx";
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import {UilArrowToRight, UilBars, UilLayerGroup, UilLeftArrowToLeft} from "@iconscout/react-unicons";
import NavbarChat from "./utils/NavbarChat.jsx";
import Snippets from "./utils/Snippets.jsx";
import TestOpenApi from "./TestOpenApi.jsx";


export default function MainLayout() {
  const {user, token, setUser, setToken, notification} = useStateContext();
  const {avatarName} = useParams();
  const chatRef = useRef();
  const [activeMode, setActiveMode] = useState(null);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [message, setMessage] = useState("");
  const [showCommandInfo, setShowCommandInfo] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showNavBar, setShowNavbar] = useState(false);
  const [showTestOpenApi, setShowTestOpenApi] = useState(false);
  const [dataTestOpenApi, setDataTestOpenApi] = useState([]);
  const [useLongTerm, setUseLongTerm] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [convesationHistory, setConvesationHistory] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [messageHistoryIndex, setMessageHistoryIndex] = useState(-1);
  const [messages, setMessages] = useState([]);
  const LIMIT_MESSAGE = 8192;
  const navigate = useNavigate();


  useEffect(() => {
    getAvatar();
    getMessagesConversation();
    getHistoryConversation();
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const getAvatar = () => {
    axiosClient.get(`/avatar/${avatarName}`)
      .then(({data}) => {
        if (data && Object.keys(data).length > 0) {
          setAvatar(data);
        } else {
          navigate('/');
        }
      })
  }

  const getMessagesConversation = () => {
    axiosClient.get(`/chat/messages`)
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
      })
  }

  const getHistoryConversation = () => {
    axiosClient.get(`/chat/history`)
      .then(({data}) => {
        setConvesationHistory(data);
      })
  }

  const handleKeyDown = (event) => {

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleMessageSend();
    }

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

  const handlePaste = (event) => {
    if (event.clipboardData && event.clipboardData.items) {
      let items = event.clipboardData.items;
      let isImagePasted = false;

      // Image
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          console.log('image');
          isImagePasted = true;
          let blob = items[i].getAsFile();

          let formData = new FormData();
          formData.append('avatar', avatarName);
          formData.append('image', blob);

          axiosClient.post('/cloud/image/add', formData)
            .then(({data}) => {
              setMessages(prevMessages => prevMessages.concat([
                {
                  sender: "me",
                  message: {original: 'Send file...'},
                  id: generateUniqueId(messages),
                  translated: false,
                  loaded: true,
                },
                {
                  sender: "ai",
                  message: {original: 'Added file: <br/>' + data.url + '<br/><br/>' + '<img src="' + data.url + '" />'},
                  date: new Date(message.created_at),
                  id: generateUniqueId(messages),
                  translated: false,
                  loaded: true,
                },
              ]));
              scrollToBottom();
            })
            .catch(error => {
              console.error(error);
            });
          break;
        }
      }

      // Text
      if (!isImagePasted) {
        console.log('text');
        // Jeżeli nie jest obrazem, wtedy obsługujemy jako tekst
        const pastedText = event.clipboardData.getData("text");
        if (pastedText.length > LIMIT_MESSAGE) {
          const slicedText = pastedText.slice(0, LIMIT_MESSAGE);
          setMessage(slicedText);
          event.preventDefault();
        }
      }

      // event.preventDefault();
    }
  };

  const clearConversation = () => {
    axiosClient.get(`/chat/clear`)
      .then(({data}) => {
        setMessages([]);
      })
    scrollToBottom();
  }


  const scrollToBottom = () => {
    setTimeout(() => {
      document.getElementById('chatBox').scrollTo({
        top: document.getElementById('chatBox').scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

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

    if (value.charAt(0) === "!") {
      setShowCommandInfo(true);
    } else {
      setShowCommandInfo(false);
    }
  };

  const handleMessageSend = async () => {
    if(processMessage(message)){
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
      setMessageHistory((messageHistory) => [...messageHistory, message]);
      await generateResponseAi(aiMessage, message);
    }
  };

  const generateResponseAi = async (aiMessage, message, payload) => {
    // setMessage(message);
    setMessages((messages) => [...messages, aiMessage]);
    await generateResponse(aiMessage, null, payload);
  }

  const processMessage = (userMessage) => {
    //
    // if (userMessage.startsWith("!wiseb2bTest")) {
    //   setShowTestOpenApi(true);
    //   return false;
    // }

    //Jesli true do wysyla do api
    return true;
  }

  const generateResponse = async (aiMessage, id = null, payload = null) => {
    setCanSendMessage(false);
    setShowCommandInfo(false);

    if(payload == null){
      payload = {
        message: message,
        mode: activeMode,
        id: id,
        avatar: avatarName,
        useAi: useLongTerm
      };
    }



    if (message.startsWith("!")) {
      // ====  COMMAND  ====

      axiosClient.post(`/chat/message`, payload)
        .then(({data}) => {
          if(processCommand(message, data)){
            getMessagesConversation();
            setMessages((messages) =>
              messages.map((m) =>
                m.id === aiMessage.id
                  ? {...m, message: {original: data.view}, loaded: true}
                  : m
              )
            );
          }
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            //setErrors(response.data.errors)
          }
        })

      // ====  COMMAND  ====
    } else {

      let id = generateUniqueId(messages);
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
          await readStream();

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
    }
    getMessagesConversation();
    setMessage("");
    setCanSendMessage(true);
    getHistoryConversation();
  }

  const processCommand = (message, data) => {
    if (message.startsWith("!wiseb2bTest") && data.data) {
      setDataTestOpenApi(data.data);
      setShowTestOpenApi(true);
      return false;
    }

    return true;
  }

  const handleManyResponse = (response) => {

    if (response.manyResponse && response.data.many) {
      setDataTestOpenApi([]);
      setShowTestOpenApi(false);
      response.data.many.forEach(item => {

        console.log(item.description)
        if(response.data.snippet && response.data.snippet == 'generate-unit-test'){
          const aiMessage = {
            sender: "ai",
            message: {original: ''},
            date: new Date(),
            id: generateUniqueId(messages),
            translated: false,
            loaded: false,
          };
          const payload = {
            message: 'Test case: ' + item.description + ' ### ' + response.data.endpoint,
            mode: 'generate-unit-test',
            id: null,
            avatar: 'buddy',
            useAi: false
          };

          generateResponseAi(aiMessage, response.data.endpoint, payload);
        }
      });
    }

  }

  const regenerateResponse = (aiMessage) => {
    aiMessage.loaded = false;
    aiMessage.message.original = '';
    generateResponse(aiMessage, aiMessage.id)
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

  return (
    <div className={`${showHistory ? 'flex' : ''} text-white bg-ai-background mx-0  h-screen`}>


      <div
        className={`w-full ${showHistory ? 'sm:w-9/12' : 'w-full'} relative bg-ai-conversation-page flex flex-col justify-between h-screen`}>
        <div className="flex gap-3 justify-between py-4 px-8 bg-ai-background border-b border-r border-white/5">
          <div className="flex gap-3 items-center">
            <Link to="/">
              <img src={avatar.img !== "null" ? avatar.img : `/img/${avatar.short_name}.jpg`}
                   className="rounded-xl w-20 bg-ai-conversation-page"/>
            </Link>
            <div>
              {avatar.name}
            </div>
          </div>
          <div className="pt-3 flex gap-4">
            {
              avatar.canUseMemoryTerm && (
                <div className={`border ${ useLongTerm ? 'border-white/6' : 'border-white/5' } p-2 rounded-xl cursor-pointer`}
                     onClick={() => setUseLongTerm(!useLongTerm)}>
                  <UilLayerGroup/>
                </div>
              )
            }

            <div className="border border-white/5 p-2 rounded-xl cursor-pointer"
                 onClick={() => setShowNavbar(!showNavBar)}>
              <UilBars/>
            </div>
            <div className="border border-white/5 p-2 rounded-xl cursor-pointer"
                 onClick={() => setShowHistory(!showHistory)}>
              {
                showHistory ? (
                  <UilArrowToRight/>
                ) : (
                  <UilLeftArrowToLeft/>
                )
              }

            </div>
          </div>
        </div>

        <NavbarChat showNavBar={showNavBar}/>

        <div className="overflow-y-auto" id="chatBox" ref={chatRef}>
          <ChatMessages messages={messages} regenerate={regenerateResponse} avatar={avatar}/>

          {
            showTestOpenApi && (
              <TestOpenApi data={dataTestOpenApi} generateResponse={generateResponseAi} showTestBox={setShowTestOpenApi} />
            )
          }

          <CommandInfo showCommandInfo={showCommandInfo}
                       setShowCommandInfo={setShowCommandInfo}
                       message={message}/>
        </div>


        {/*</div>*/}
        <div className="px-6 pt-5 border-t border-ai-conversation-border">

          <Snippets
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            avatar={avatarName}
          />

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
          <div className="flex justify-between py-1 mb-5">
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


      {
        showHistory && (
          <div
            className={` ${showHistory ? 'opacity-100 translate-y-0 w-6/12 sm:w-3/12 ' : 'opacity-0 translate-y-1 flex-none '}  sm:block p-5 transition duration-150 ease-in-out`}>
            <div className="border-b border-white/5 pb-1 mb-4">Chat History</div>

            {convesationHistory.map(conversation => (
              <div
                key={conversation.title}
                className="mb-4">
                <div className="cursor-pointer" onClick={() => getConversation(conversation.id)}>{conversation.title}</div>
                <div className="text-gray-400 text-sm">{conversation.date}</div>
              </div>
            ))}

          </div>
        )
      }




    </div>
  );

}
