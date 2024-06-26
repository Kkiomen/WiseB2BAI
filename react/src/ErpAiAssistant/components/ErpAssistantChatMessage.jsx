import ErpAssistantChatMessages from "./ErpAssistantChatMessages.jsx";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypePrism from "rehype-prism";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import AssistantChatMessageSteps from "./AssistantChatMessageSteps.jsx";
import ErpAssistantChatMessageTable from "./ErpAssistantChatMessageTable.jsx";
import AssistantChatMessageProducts from "./AssistantChatMessageProducts.jsx";

export default function ErpAssistantChatMessage(messageConversation) {
  const isAi = messageConversation.isAi;

  const { steps } = messageConversation.message;


  if (messageConversation && messageConversation.message && messageConversation.message.original !== null) {

    // console.log(steps);
    return (
      <div
        className="max-w-[min(60em,98vw)] bg-white border shadow-lg mx-auto md:py-10 py-[4em] grid lg:grid-cols-[2em,4em,1fr,4em,2em] md:grid-cols-[2em,2vw,1fr,2vw,2em] grid-cols-[3vw,3vw,1fr,3vw,3vw] text-sm md:text-base lg:text-lg mt-5">
        <div className="col-start-3">
          <div className={` ${isAi ? 'flex flex-row' : ''}  items-center align-items-center border-b border-gray-200`}>
            <div>
              { isAi && (
                  <img src={`https://i.imgur.com/ucLm6ji.jpg`} className="rounded-full w-12 bg-ai-conversation-page p-0.5"/>
                )
              }

            </div>
            <div className={`${isAi ? 'ml-3' : ''}`}>

              { isAi ? (
                <div>
                  <div className="mb-1 mt-3">
                    Dely
                  </div>
                  <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-500 dark:text-white">Ai Assistant</label>
                </div>
              ) : (
                <div>
                  <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-500 dark:text-white">Your Question</label>
                </div>
                )}

            </div>
          </div>

          <div className="mt-5">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypePrism, rehypeRaw]}
              children={messageConversation.message.loaded ? messageConversation.message.message.original : '<div className="ml-8 dot-flashing text-white"/>'}
            />
          </div>

          {/*<ErpAssistantChatMessageTable messageConversation={messageConversation} />*/}

          <AssistantChatMessageProducts messageConversation={messageConversation} />
          <AssistantChatMessageSteps messageConversation={messageConversation} />

        </div>
      </div>
    );

  } else {
    return (
      messageConversation.loaded ? messageConversation.message.original : <div className="ml-8 dot-flashing text-white"/>
    );
  }
}
