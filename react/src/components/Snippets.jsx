import SnippetComponent from "./SnippetComponent.jsx";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {toast} from "react-toastify";


export default function Snippets({activeMode, setActiveMode}){
  const [activeSnippet, setActiveSnippet] = useState(null);
  const [showSnippets, setShowSnippets] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    getSnippet();
  }, []);

  const getSnippet = () => {
    axiosClient.get(`/snippets/`)
      .then(({data}) => {
        setSnippets(data);
      })
      .catch(err => {
        toast.error("An error has occurred, check that all data has been completed");
      })
  }

  // const snippets = [
  //   {
  //     text: "Translate to Polish",
  //     icon: <i className="far fa-language"></i>,
  //     onClickEvent: () => console.log('Translate to Polish'),
  //     mode: 'translate'
  //   },
  //   {
  //     text: "Code Review",
  //     icon: <i className="far fa-code"></i>,
  //     onClickEvent: () => console.log('Code Review'),
  //     mode: 'review'
  //   },
  //   {
  //     text: "QuickTask",
  //     icon: <i className="far fa-check-square"></i>,
  //     onClickEvent: () => console.log('QuickTask'),
  //     mode: 'quicktask'
  //   },
  //   {
  //     text: "True/False",
  //     icon: <i className="far fa-question-circle"></i>,
  //     onClickEvent: () => console.log('True/False'),
  //     mode: 'truefalse'
  //   },
  //   {
  //     text: "Get weather forecast",
  //     icon: <i className="far fa-sun"></i>,
  //     onClickEvent: () => console.log('Get weather forecast'),
  //     mode: 'weather'
  //   },
  //   {
  //     text: "Generate random password",
  //     icon: <i className="far fa-lock"></i>,
  //     onClickEvent: () => console.log('Generate random password'),
  //     mode: 'password'
  //   },
  //   {
  //     text: "Search for movie recommendations",
  //     icon: <i className="far fa-film"></i>,
  //     onClickEvent: () => console.log('Search for movie recommendations'),
  //     mode: 'movies'
  //   },
  //   {
  //     text: "Convert units",
  //     icon: <i className="far fa-ruler"></i>,
  //     onClickEvent: () => console.log('Convert units'),
  //     mode: 'convert'
  //   },
  //   {
  //     text: "Schedule calendar events",
  //     icon: <i className="far fa-calendar"></i>,
  //     onClickEvent: () => console.log('Schedule calendar events'),
  //     mode: 'calendar'
  //   },
  //   {
  //     text: "Calculate tip",
  //     icon: <i className="far fa-money-bill-alt"></i>,
  //     onClickEvent: () => console.log('Calculate tip'),
  //     mode: 'tip'
  //   },
  //   {
  //     text: "Create shopping list",
  //     icon: <i className="far fa-shopping-cart"></i>,
  //     onClickEvent: () => console.log('Create shopping list'),
  //     mode: 'shopping'
  //   }
  // ];


  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

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
    <div>
      <div className="inline-flex items-center justify-center w-full sm:mt-8">
        <hr className="w-80 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
        <button type="button"  onClick={() => setShowSnippets(!showSnippets)} className="absolute px-3 font-medium text-gray-900 bg-ai-b text-white dark:text-white dark:bg-ai-b">Snippets</button>
      </div>

      <div className={`${showSnippets ? 'block' : 'hidden'} `}>
        <div className="mx-12">
          <input type="text" id="large-input"
                 value={searchText}
                 onChange={handleSearchTextChange}
                 className="block w-full p-4 text-gray-900 border border-ai-t rounded-lg text-white bg-transparent sm:text-md focus:ring-blue-500 focus:border-blue-500 "/>
        </div>
        <div className="mx-12 mt-10 grid grid-cols-2 gap-4 max-h-[10rem] sm:max-h-[20rem] overflow-y-auto">
          {filteredSnippets.map((snippet, index) => (
            <div className="" key={index}>
              <SnippetComponent
                icon={snippet.icon}
                text={snippet.text}
                mode={snippet.mode}
                isActive={activeMode === snippet.mode}
                onActivate={handleActivateSnippet}
              />
            </div>
          ))}
        </div>
      </div>
      {activeSnippet && (
        <div className={`mx-14 mt-3 flex flex-row gap-5 items-center  `}>
          Active snippet: <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{activeSnippet.text}</kbd>
        </div>
      )}
    </div>
  );
}
