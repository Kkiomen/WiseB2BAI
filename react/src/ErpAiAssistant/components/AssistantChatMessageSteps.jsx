import ErpAssistantChatMessages from "./ErpAssistantChatMessages.jsx";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypePrism from "rehype-prism";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

export default function AssistantChatMessageSteps({messageConversation}) {
  const { steps } = messageConversation.message;

  if (steps) {
    return (
      <ul
        aria-label="Changelog feed"
        role="feed"
        className="relative flex mt-10 flex-col gap-12 py-3 pl-6 text-sm before:absolute before:top-0 before:left-6 before:h-full before:-translate-x-1/2 before:border before:border-dashed before:border-slate-200 after:absolute after:top-6 after:left-6 after:bottom-6 after:-translate-x-1/2 after:border after:border-slate-200"
      >
        { steps && steps.map((step, index) => (
          <li
            key={index}
            role="article"
            className="relative pl-6 before:absolute before:left-0 before:top-2 before:z-10 before:h-2 before:w-2 before:-translate-x-1/2 before:rounded-full before:bg-emerald-500 before:ring-2 before:ring-white"
          >
            <div className="flex flex-col flex-1 gap-2">

              {Object.entries(step).map(([key, value], keyIndex) =>
                  key === 'description' ? (
                    <h4 className="text-base font-medium text-emerald-500">
                      {value}
                    </h4>
                  ) : ''
              )}

              {Object.entries(step).map(([key, value], keyIndex) =>
                key !== 'description' ? (
                  <p className=" text-slate-500">
                    <b>{key}</b>: {value}
                  </p>
                ) : ''
              )}
            </div>
          </li>
        ))}
      </ul>
    );

  }
}
