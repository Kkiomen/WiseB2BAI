import ErpAssistantChatMessages from "./ErpAssistantChatMessages.jsx";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypePrism from "rehype-prism";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

export default function ErpAssistantChatMessageTableRow({row}) {

  console.log(row);

  const renderValue = (value) => {
    // Check if the value is an object
    if (typeof value === 'object' && value !== null) {
      // Convert object to string or render its properties
      // For example, you can JSON.stringify the object
      // or render each key-value pair
      return JSON.stringify(value);
    }
    // If value is not an object, just return it
    return value;
  };

    return (
      <tr>
        {Object.entries(row).map(([key, value], keyIndex) =>
          (
            <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">{renderValue(value)}</td>
          )
        )}
      </tr>
    );

  // }
}
