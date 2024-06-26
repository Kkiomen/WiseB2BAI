import {useEffect, useState} from "react";
import TagsInput from 'react-tagsinput'
import KeyValue from "../components/form/KeyValue.jsx";
import axiosClient from "../axios-client.js";
import {toast} from "react-toastify";
import {Link, Navigate, useParams} from "react-router-dom";
import Navbar from "../components/utils/Navbar";

export default function AddSnippet(){
  const [name, setName] = useState("");
  const [type, setType] = useState("private");
  const [prompt, setPrompt] = useState("");
  const [webhook, setWebhook] = useState('');
  const [remoteAction, setRemoteAction] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    getSnippet();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      name,
      type,
      prompt,
      webhook,
      'id': (id) ? id : null
    };
    console.log(payload)
    axiosClient.post(`/snippet/add`, payload)
      .then(({ data }) => {
        if(data.status == 'success'){
          toast.success(data.message);
          setRedirect(true);
        }else{
          toast.error(data.message);
        }
      })
      .catch(err => {
        toast.error("An error has occurred, check that all data has been completed");
      })
  };

  const handleDelete = async () => {
    const payload = {
      'id': (id) ? id : null
    };
    axiosClient.delete(`/snippet/${id}`, payload)
      .then(({ data }) => {
        console.log(data)
        if(data.status == 'success'){
          toast.success("Success delete");
          setRedirect(true);
        }else{
          toast.error(data.message);
        }
      })
      .catch(err => {
        toast.error("An error has occurred, check that all data has been completed");
      })
  };



  const getSnippet = () => {
    if(id){
      axiosClient.get(`/snippet/${id}`)
        .then( ({ data })=> {
          if(data.status == 'success'){
            setName(data.response.name);
            setType(data.response.type);
            setPrompt(data.response.prompt);
            if(data.response.webhook !== ''){
              setRemoteAction(true);
            }
            setWebhook(data.response.webhook);
          }else{
            toast.error(data.message);
            setRedirect(true);
          }
        })
        .catch(err => {
          console.log(err)
          toast.error("An error has occurred");
        })
    }
  }


  return (
    <div className="h-screen text-white flex flex-col mx-6 mt-5">

      <Navbar />

      {
        redirect && (
          <Navigate to="/settings" replace={true} />
        )
      }

      <div className="bg-white text-black p-12 rounded-xl mt-8">

        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Snippet</h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">


              <div className="sm:col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      name="name"
                      onChange={(event) => setName(event.target.value)}
                      value={name}
                      className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Yes or no"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">Button label</p>
                </div>
              </div>

              <div className="sm:col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Type
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      name="type"
                      onChange={(event) => setType(event.target.value)}
                      value={type}
                      className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="private"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">Which users can use <br/>Allowed: <strong>private</strong>, <strong>group</strong></p>
                </div>
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Main prompt
                </label>
                <div className="mt-2">
                    <textarea
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(event) => setPrompt(event.target.value)}
                      placeholder="Return a respose to the provided: {message}. Only 'yes' or 'not'. Nothing more "
                      value={prompt}
                    />
                  <p className="mt-3 text-sm leading-6 text-gray-600">Hidden part <br/>{"{message}"} - user message<br/>Not using {"{message}"} , will place prompt in system field</p>
                </div>
              </div>

              <div className="col-span-full">
                <div className="flex h-6 items-center gap-x-3">
                  <input
                    type="checkbox"
                    checked={remoteAction}
                    onChange={(event) => setRemoteAction(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                  />
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    This is remote action
                  </label>
                </div>
              </div>

              <div className={` ${remoteAction ? 'block' : 'hidden'} sm:col-span-full`} >
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Webhook
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      name="webhook"
                      onChange={(event) => setWebhook(event.target.value)}
                      value={webhook}
                      className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Url to webhook"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">

          <Link to="/settings">
            <button
              className="rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Back to settings
            </button>
          </Link>

          {
            id && (
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Delete snippet
              </button>
            )
          }


          <button
            onClick={handleSubmit}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  )
}
