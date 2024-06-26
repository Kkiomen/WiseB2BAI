import {Bars2Icon} from "@heroicons/react/24/solid/index.js";
import AvatarView from "../components/AvatarView.jsx";
import PreviousConversation from "../components/PreviousConversation.jsx";
import axiosClient from "../axios-client.js";
import {generateUniqueId} from "../functions/Helpers.js";
import {useEffect, useState} from "react";
import {useStateContext} from "../context/ContextProvider.jsx";
import {Link, Navigate} from "react-router-dom";
import Navbar from "../components/utils/Navbar";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypePrism from "rehype-prism";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";


export default function QuizDesignPattern() {

  const questionEmpty = {
    text: "Masz za zadanie zaprojektować system logowania dla aplikacji internetowej, który umożliwia różnym metodom autentykacji (np. hasło, odcisk palca, rozpoznawanie twarzy) być łatwo dodawanymi lub modyfikowanymi bez zmiany istniejącego kodu systemu. Który wzorzec projektowy najlepiej pasuje do tego scenariusza?",
    options: ["Wzorzec Singleton", "Wzorzec Fabryka Abstrakcyjna", "Wzorzec Strategia", "Wzorzec Dekorator"],
    correctAnswer: "Wzorzec Strategia",
    explanation: "<p>Wzorzec Strategia jest idealny do tego scenariusza, ponieważ pozwala definiować rodzinę algorytmów, umieszczać je w osobnych klasach i sprawiać, że są one wymienne. W tym przypadku każda metoda autentykacji (hasło, odcisk palca, rozpoznawanie twarzy) może być zaimplementowana jako oddzielna strategia i łatwo podmieniana lub modyfikowana bez wpływu na pozostałe części systemu. Pozostałe wzorce nie pasują tak dobrze: Singleton jest używany do zapewnienia, że klasa ma tylko jedną instancję; Fabryka Abstrakcyjna jest stosowana do tworzenia rodzin powiązanych lub zależnych obiektów bez określania ich konkretnych klas; Dekorator pozwala dodawać nowe funkcjonalności do obiektu dynamicznie.</p> " +
      "<h2>Definicja Interfejsu Strategii</h2> <p> Najpierw zdefiniujmy interfejs LoginStrategy, który będzie wymagał implementacji metody authenticate()</p>"
  };

  const [selectedOption, setSelectedOption] = useState(null);
  const [question, setQuestion] = useState(questionEmpty);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    getNewQuestion();
  }, []);

  const getNewQuestion = () => {
    setIsSubmitted(false);
    axiosClient.get(`/quiz/design-pattern/question`)
      .then(({data}) => {
        setQuestion(data);
        console.log(data);
      })
  }


  // Example question structure


  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsSubmitted(true); // Assuming the answer is checked immediately upon selection
  };


  return (
    <div>
      <div className=" rounded-lg dark:border-gray-700 bg-gray-600 p-5 mx-8 mt-10">
        <div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypePrism, rehypeRaw]}
            children={question.question}
          />
        </div>
      </div>

      <div className="p-4 mt-3">
        <div className="text-sm">Wybierz:</div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">

            {question.options.map((option) => (
              <div
                key={option}
                className={`flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800 cursor-pointer select-none ${
                  isSubmitted
                    ? option === question.correctAnswer
                      ? 'border-solid border-2 border-green-500' // Correct answer
                      : selectedOption === option
                        ? 'blur-[2px] border-solid border-2 border-red-500' // Selected but incorrect
                        : 'blur-[2px] border-solid border-2 border-red-500' // Not selected
                    : ''
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <p
                  className={`text-2xl ${
                    isSubmitted
                      ? option === question.correctAnswer
                        ? 'text-green-500'
                        : 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-400 dark:text-gray-500'
                  } text-center`}
                >
                  {option}
                </p>
              </div>
            ))}


            {/*<div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800 cursor-pointer select-none">*/}
            {/*  <p className="text-2xl text-gray-400 dark:text-gray-500 text-center">*/}
            {/*    Wzorzec Singleton*/}
            {/*  </p>*/}
            {/*</div>*/}
            {/*<div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800 cursor-pointer select-none">*/}
            {/*  <p className="text-2xl text-gray-400 dark:text-gray-500 text-center">*/}
            {/*    Wzorzec Fabryka Abstrakcyjna*/}
            {/*  </p>*/}
            {/*</div>*/}
            {/*<div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800 border-solid border-2 border-green-500 cursor-pointer select-none">*/}
            {/*  <p className="text-2xl text-green-500 text-center">*/}
            {/*    Wzorzec Strategia*/}
            {/*  </p>*/}
            {/*</div>*/}
            {/*<div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800 cursor-pointer select-none blur-[2px]">*/}
            {/*  <p className="text-2xl text-red-500 text-center">*/}
            {/*    Wzorzec Dekorator*/}
            {/*  </p>*/}
            {/*</div>*/}

          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm mb-3">Opcje:</div>
        <div className="text-sm mx-8 bg-white border-solid text-gray-800 font-medium px-4 py-2 cursor-pointer" onClick={() => getNewQuestion()}>
          <i className="fa-solid fa-repeat mr-3"></i> Losuje nowe pytanie
        </div>
      </div>


      { isSubmitted && (
        <div className="bg-white text-black p-4 mt-20">
          <div className="text-sm explanation">

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypePrism, rehypeRaw]}
              children={question.explanation}
            />

          </div>
        </div>
      )}

    </div>
  );

}
