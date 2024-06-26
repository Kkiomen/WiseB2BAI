import PerfectScrollbar from "react-perfect-scrollbar";
import {UilClipboard, UilCommentAltNotes} from "@iconscout/react-unicons";
import {useEffect, useRef, useState} from "react";
import * as deepl from 'deepl-node';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypePrism from "rehype-prism";
import rehypeRaw from "rehype-raw";


export default function ChatMessage({messages}) {
  const [showButtons, setShowButtons] = useState(null);
  const translate = (messageId, message) => {
    setShowButtons(message.id);
    const authKey = '';
    console.log({
      messageId, message
    })
  }

  return (
    <div className="pb-[13rem] messagesBox">
      {messages.map(message => {
        const isAi = message.sender === "ai";

        return (
          <div
            key={message.id}
            onMouseEnter={() => setShowButtons(message.id)}
            onMouseLeave={() => setShowButtons(null)}
            onClick={() => setShowButtons(showButtons === message.id ? null : message.id)}
            className={isAi ? 'mb-3 relative' : 'mb-3'}
          >
            <div>
              <div className={isAi ? 'mb-1 mt-3' : 'mb-1 pr-2 text-right'}>
                {isAi ? 'Dely' : 'Me'}
              </div>

              <div className={isAi ? 'bg-ai-t p-3 pr-6 rounded-xl mr-10 rounded-bl-none' : 'bg-ai-chat-me p-3 rounded-xl text-right ml-10'}>

                {
                  message && message.message && message.message.original !== null && isAi ? (

                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypePrism, rehypeRaw]}
                      children={message.loaded ? message.message.original : '<div className="ml-8 dot-flashing text-white"/>'}
                    />
                  ) : (
                    message.loaded ? message.message.original : <div className="ml-8 dot-flashing text-white"/>
                  )
                }

              </div>


              {/*<div className="bg-ai-t p-3 pr-6 rounded-xl">*/}
              {/*  <h2 className="text-2xl font-bold tracking-tight text-white sm:text-2xl mb-2">Pytania daily:</h2>*/}
              {/*  <ol className="list-decimal ml-10">*/}
              {/*    <li>Co robiłem poprzedniego dnia?</li>*/}
              {/*    <li>Czy jest zadowolony z czegoś co robiłem?</li>*/}
              {/*    <li>Co będę robił dzisiaj?</li>*/}
              {/*    <li>Czy natrafiłem na jakieś przeszkody?</li>*/}
              {/*  </ol>*/}
              {/*  <h2 className="text-2xl font-bold tracking-tight text-white sm:text-2xl mt-5 mb-2">Co robiłem poprzedniego dnia?:</h2>*/}
              {/*  <ol className="list-disc ml-10">*/}
              {/*    <li><strong>*/}
              {/*      Co robiłem poprzedniego dnia?<br/>*/}
              {/*      <small>LOB-304 - 12.10.2023    |   <span> 30m</span></small>*/}
              {/*    </strong>*/}
              {/*    </li>*/}
              {/*    <li>Czy jest zadowolony z czegoś co robiłem?</li>*/}
              {/*    <li>Co będę robił dzisiaj?</li>*/}
              {/*    <li>Czy natrafiłem na jakieś przeszkody?</li>*/}
              {/*  </ol>*/}
              {/*</div>*/}

            </div>
            {showButtons === message.id && isAi && message.loaded &&
              <div className="absolute top-0 right-0 flex gap-2 mt-11 mr-3">
                <button className="bg-transparent hover:text-gray-300"
                        onClick={() => navigator.clipboard.writeText(message.message.original)}>
                  <UilClipboard size={18}/>
                </button>
                {message.translated &&
                  <button className="bg-transparent hover:text-gray-300"
                          onClick={() => translate(message.id, message.message.original)}>
                    <UilCommentAltNotes size={18}/>
                  </button>
                }
              </div>
            }
          </div>
        );
      })}
    </div>
  );
}
