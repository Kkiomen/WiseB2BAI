import {generateUniqueId} from "../functions/Helpers.js";


export default function TestOpenApi({data, generateResponse, showTestBox}){


  const generateTest = (endpoint, method, body) => {
    const endpointInformation = 'Endpoint: ' + endpoint +
                                ' %%% Method: ' + method +
                                ' ### Information OpenApi: ' + JSON.stringify(body);
    const aiMessage = {
      sender: "ai",
      message: {original: ''},
      date: new Date(),
      id: Math.random(),
      translated: false,
      loaded: false,
    };

    const payload = {
      message: endpointInformation,
      mode: 'automatic-test-openapi',
      id: null,
      avatar: 'buddy',
      useAi: false
    };
      showTestBox(false);
      generateResponse(aiMessage, endpointInformation, payload);
  }


  return (
    <div className="mx-2 sm:mx-8 my-6 text-md pb-12 message">
      <div className="bg-ai-conversation-ai rounded-xl p-4 sm:p-8 pb-10 sm:pb-10">
        <div>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-2xl mb-2">Generuj:</h2>

          <div className="flex flex-col">

            {Object.keys(data).map(endpoint => {
              const endpointBody = data[endpoint];
              return (
                <div key={endpoint} className="flex flex-col  mt-3 justify-between  border-b pb-5 border-white/5">
                  <div className="pr-6 text-sm">
                    {endpoint}
                  </div>
                  <div className="mt-4 flex flex-row gap-3 ">

                    {Object.keys(endpointBody).map(method => {
                      let color = 'bg-gray-100 text-gray-800';

                      switch(method) {
                        case 'get':
                          color = 'bg-blue-600 text-white';
                          break;
                        case 'delete':
                          color = 'bg-red-600 text-white';
                          break;
                        case 'put':
                          color = 'bg-lime-600 text-white';
                          break;
                        case 'patch':
                          color = 'bg-amber-600 text-white';
                          break;
                        default:

                      }

                      return (
                        <span
                          onClick={() => generateTest(endpoint, method, endpointBody[method])}
                          className={` ${color} flex h-fit items-center select-none cursor-pointer gap-1 font-semibold  dark:bg-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 rounded px-2 py-0.5 p-1 text-xs`}>
                              { method }
                            </span>
                      )
                    })}


                  </div>
                </div>);
            })}

          </div>
        </div>
      </div>
    </div>
  );
}
