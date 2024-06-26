import axiosClient from "../../axios-client.js";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import SnippetComponent from "../SnippetComponent.jsx";

export default function Snippets({activeMode, setActiveMode, avatar}){
  const [activeSnippet, setActiveSnippet] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    getSnippet();
  }, []);

  const getSnippet = () => {
    axiosClient.get(`/snippets/${avatar}`)
      .then(({data}) => {
        setSnippets(data);
      })
      .catch(err => {
        toast.error("An error has occurred, check that all data has been completed");
      })
  }

  const handleActivateSnippet = (mode) => {
    if(mode !== activeMode){
      setActiveMode(mode);
      setActiveSnippet(snippets.find(snippet => snippet.mode === mode));
    }else{
      setActiveMode(null);
      setActiveSnippet(null);
    }
  };

  const filteredSnippets = snippets.filter((snippet) =>
    snippet.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex gap-3 mb-5">
      {filteredSnippets.map((snippet, index) => (
        <div className="" key={index}>
          <div
            onClick={() => handleActivateSnippet(snippet.mode)}
            className={` ${activeMode === snippet.mode ? 'bg-gray-500' : 'bg-gray-100'} flex h-fit cursor-pointer items-center select-none cursor-pointer gap-1 font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 rounded px-2 py-0.5 p-1 text-xs`}>
            {snippet.text}
          </div>
          {/*<SnippetComponent*/}
          {/*  icon={snippet.icon}*/}
          {/*  text={snippet.text}*/}
          {/*  mode={snippet.mode}*/}
          {/*  isActive={activeMode === snippet.mode}*/}
          {/*  onActivate={handleActivateSnippet}*/}
          {/*/>*/}
        </div>
      ))}
    </div>
  )
}
