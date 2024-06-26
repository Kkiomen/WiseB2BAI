import axiosClient from "../axios-client.js";
import {useEffect, useState} from "react";
export default function CommandInfo({showCommandInfo, setShowCommandInfo, message}){
  const [commands, setCommands] = useState([]);

  const scrollToBottom = () => {
    setTimeout(() => {
      document.getElementById('chatBox').scrollTo({
        top: document.getElementById('chatBox').scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  useEffect(() => {
    if (showCommandInfo) {
      axiosClient.get(`/chat/command-list`)
        .then(({ data }) => {
          setCommands(data);
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
          }
        });
      scrollToBottom();
    }
  }, [showCommandInfo]);

  const filteredCommands = Object.entries(commands).filter(([command, _]) => command.startsWith(message.split(' ')[0]));

  return (
    <div className={ showCommandInfo ? 'relative z-10' : 'hidden'} >


      <div>
        <div className="mx-2 sm:mx-8 my-6 text-md pb-12">
          <div className="bg-ai-conversation-me rounded-xl border border-ai-conversation-border p-4 sm:p-8">
            {filteredCommands.length === 0 ? (
              <div className="text-sm font-medium mt-3">Brak komend pasujących do wpisanego polecenia.</div>
            ) : (
              filteredCommands.map(([command, { description, params, example }], index) => (
                <div className={`border-b border-black ${index === 0 ? 'pb-7' : 'py-7'}`} key={command}>
                  <kbd
                    className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                  >
                    {command}
                  </kbd>
                  <div className="text-sm mt-3 border-b border-bg-ai pb-3">{description}</div>
                  <div className="text-sm font-semibold mt-3">Parametry:</div>
                  <ul className="list-disc list-inside text-gray-400">
                    {params.map((param) => (
                      <li key={param} className="text-sm">
                        {param}
                      </li>
                    ))}
                  </ul>
                  <div className="text-sm font-semibold mt-3">Przykłady użycia:</div>
                  <div className="text-gray-500">
                    {example.map((ex) => (
                      <div key={ex} className="text-sm">
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/*<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity opacity-100"></div>*/}

      {/*<div className="fixed inset-0 overflow-hidden">*/}
      {/*  <div className="absolute inset-0 overflow-hidden">*/}
      {/*    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">*/}

      {/*      <div className="pointer-events-auto relative w-screen max-w-md">*/}

              {/*<div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">*/}
              {/*  <button type="button" onClick={() => closeCommandInfo()}*/}
              {/*          className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">*/}
              {/*    <span className="sr-only">Close panel</span>*/}
              {/*    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"*/}
              {/*         aria-hidden="true">*/}
              {/*      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>*/}
              {/*    </svg>*/}
              {/*  </button>*/}
              {/*</div>*/}

      {/*        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">*/}
      {/*          <div className="px-4 sm:px-6">*/}
      {/*            <h2 className="text-base font-semibold leading-6 text-gray-900" id="slide-over-title">Podpowiedź komend:</h2>*/}
      {/*          </div>*/}
      {/*          <div className="relative mt-6 flex-1 px-4 sm:px-6 text-black pb-[15rem]">*/}

      {/*            {filteredCommands.length === 0 ? (*/}
      {/*              <div className="text-sm font-medium mt-3">Brak komend pasujących do wpisanego polecenia.</div>*/}
      {/*            ) : (*/}
      {/*              filteredCommands.map(([command, { description, params, example }], index) => (*/}
      {/*                <div className={`border-b border-black ${index === 0 ? 'pb-7' : 'py-7'}`} key={command}>*/}
      {/*                  <kbd*/}
      {/*                    className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"*/}
      {/*                  >*/}
      {/*                    {command}*/}
      {/*                  </kbd>*/}
      {/*                  <div className="text-sm mt-3 border-b border-bg-ai pb-3">{description}</div>*/}
      {/*                  <div className="text-sm font-semibold mt-3">Parametry:</div>*/}
      {/*                  <ul className="list-disc list-inside text-gray-700">*/}
      {/*                    {params.map((param) => (*/}
      {/*                      <li key={param} className="text-sm">*/}
      {/*                        {param}*/}
      {/*                      </li>*/}
      {/*                    ))}*/}
      {/*                  </ul>*/}
      {/*                  <div className="text-sm font-semibold mt-3">Przykłady użycia:</div>*/}
      {/*                  <div className="text-gray-700">*/}
      {/*                    {example.map((ex) => (*/}
      {/*                      <div key={ex} className="text-sm">*/}
      {/*                        {ex}*/}
      {/*                      </div>*/}
      {/*                    ))}*/}
      {/*                  </div>*/}
      {/*                </div>*/}
      {/*              ))*/}
      {/*            )}*/}

      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>

  );
}
