import ErpAssistantChatMessages from "./ErpAssistantChatMessages.jsx";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypePrism from "rehype-prism";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import ErpAssistantChatMessageTableRow from "./ErpAssistantChatMessageTableRow.jsx";

export default function ErpAssistantChatMessageTable({messageConversation}) {

  const {table} = messageConversation.message;

  // Sprawdzenie czy 'table' jest zdefiniowane i czy jest tablicą
  if (!table || !Array.isArray(table)) {
    return null;
  }

  // Pobieranie kluczy z pierwszego obiektu w tablicy
  const headers = table[0] ? Object.keys(table[0]) : [];

  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="w-full overflow-x-auto mt-8">
      <table className="w-full text-left border border-collapse rounded sm:border-separate border-slate-200" cellspacing="0">
        <tbody>
        {table && table.map((row, index) => (
          index === 0 ? (
            <tr>
              {Object.entries(row).map(([key, value], keyIndex) =>
                (
                  <th key={keyIndex} scope="col"
                      className="h-12 px-6 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100">
                    {renderValue(value)}
                  </th>
                )
              )}
            </tr>
          ) : (
            <tr>
              {Object.entries(row).map(([key, value], keyIndex) =>
                (
                  <td
                    className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">{renderValue(value)}</td>
                )
              )}
            </tr>
          )
        ))}
        </tbody>
      </table>
    </div>
  );

  // }
}
