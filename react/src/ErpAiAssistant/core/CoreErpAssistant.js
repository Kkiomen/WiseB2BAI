import axiosClient from "../../axios-client.js";
import {generateUniqueId} from "../../functions/Helpers.js";


export const getMessagesConversation = (sessionHash, setMessages, messages) => {
  axiosClient.post(`/messages`, {
    'session_hash': sessionHash
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

    })
}
