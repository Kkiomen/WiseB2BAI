import {useEffect, useState} from "react";
import ErpAssistantChatMessages from "../../components/ErpAssistantChatMessages.jsx";
import {useCookies} from "react-cookie";
import generateNewHash from "../../core/api/GenerateNewSessionHash.js";
import scrollToBottom from "../../core/utils/ScrollToBottom.js";
import {generateUniqueId} from "../../../functions/Helpers.js";

export default function ErpAiAssistantCore({type, additional}) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionHash, setSessionHash] = useState("");
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["sessionHash"]);

  useEffect(() => {
    generateNewHash(setSessionHash, setCookie);
  }, ['']);

  const sendMessage = async (event) => {
    // const value = event.target.value;
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
      step: [],
      table: [],
    };
    setMessages((messages) => [...messages, newMessage]);
    await generateResponseAi(aiMessage, message);

  }

  const generateResponseAi = async (aiMessage, message, payload) => {
    // setMessage(message);
    setMessages((messages) => [...messages, aiMessage]);
    await generateResponse(aiMessage, null, payload);
  }

  const generateResponse = async (aiMessage, id = null, payload = null) => {
    setCanSendMessage(false);

    if (payload == null) {
      payload = {
        message: message,
        session: sessionHash,
        type: type,
        additional: additional
      };
    }


    // let id = generateUniqueId(messages);
    // ====  CHAT GPT  ====
    const token = localStorage.getItem('ACCESS_TOKEN');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/assistant/message`, {
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
                ? {...m, message: {original: m.message.original + data.delta.content}, loaded: true, steps: data.steps, table: data.table, dataRequest: data.data, type: data.type}
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
        scrollToBottom('chatBox');
        await readStream();
        scrollToBottom('chatBox');
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
    // getMessagesConversation();
    setMessage("");
    setCanSendMessage(true);
  }


  return (
    <div className="full-no-margin bg-[#EFF3F6] text-black">
      <div className="relative">
        <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-72 z-[-1] opacity-20 pointer-events-none">
          <div className="fade-in">
            <canvas height="288" width="1601"></canvas>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#9867f0] to-[#ed4e50]"></div>
      </div>
      <div className="pt-10 pb-40">
        <div className="pt-10 pb-40">
          <div
            className="max-w-[min(60em,98vw)] bg-white border shadow-lg mx-auto md:py-8 py-[4em] grid lg:grid-cols-[2em,4em,1fr,4em,2em] md:grid-cols-[2em,2vw,1fr,2vw,2em] grid-cols-[3vw,3vw,1fr,3vw,3vw] text-sm md:text-base lg:text-lg">
            <div className="col-start-3">
              <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-500 dark:text-white">Message</label>

              <div className="mb-6 flex flex-row grow-[2]">
                <textarea
                  type="text" id="large-input"
                  className="mr-3 w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                ></textarea>
                <button
                  type="submit"
                  className="text-gray-700 bg-gray-100 focus:ring-4 border border-gray-300 hover:border-gray-400 font-medium rounded-lg text-sm px-4 py-2"
                  onClick={sendMessage}
                >Send</button>

              </div>

            </div>
          </div>


          <div className="overflow-y-auto mb-5" id="chatBox">

            {/*Messages*/}

            <ErpAssistantChatMessages messages={messages} response={generateResponse}/>

            {/*Messages*/}

          </div>



        </div>
      </div>
    </div>
  )
}
