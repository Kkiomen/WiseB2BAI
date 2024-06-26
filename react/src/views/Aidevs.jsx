import {useState} from "react";
import axios from 'axios';
export default function Aidevs(){
  const [task, setTask] = useState("");
  const [answer, setAnswer] = useState("");
  const [response, setResponse] = useState("");

  const APIKEY = "6982ce64-7d13-4d2e-a23a-ba07ba2c8f45";

  const payload = {
    apikey: APIKEY
  };

  const getTaskTOKEN = () => {
    axios.post(`https://zadania.aidevs.pl/token/${task}`, {
      apikey: APIKEY
    })
      .then(({ res }) => {
        console.log(res)

        console.log(res.token);
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  const sendAnswer = () => {
    getTaskTOKEN();

    // axios.post(`https://zadania.aidevs.pl/token/${task}`, payload)
    //   .then(res => res.data)
    //   .catch(error => {
    //     // handle errors here as before
    //     throw error;
    //   });
  }

  return (
    <div className="p-12">
      <div className="bg-white p-8">
        <div className="mb-6">
          <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Nazwa zadania
          </label>
          <input type="text" id="large-input"
                 value={task}
                 onChange={(event) => setTask(event.target.value)}
                 className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        </div>

        <div className="mb-6">
          <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Odpowiedź
          </label>
          <textarea type="text" id="large-input"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                 className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          </textarea>
        </div>
        <div className="mb-6">
          <button type="button"
                  onClick={sendAnswer}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Wyślij odpowiedź
          </button>
        </div>
      </div>
    </div>
  )
}
