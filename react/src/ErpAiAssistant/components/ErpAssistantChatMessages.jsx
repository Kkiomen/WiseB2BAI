import {useState} from "react";
import ErpAssistantChatMessage from "./ErpAssistantChatMessage.jsx";

export default function ErpAssistantChatMessages(messages , response) {

  // console.log(messages);
  return (
    <div className="messagesBox">
      {messages.messages.map(message => {
        const isAi = message.sender === "ai";
        return (
          <ErpAssistantChatMessage message={message} isAi={isAi}/>
        );
      })}
    </div>
  );
}
