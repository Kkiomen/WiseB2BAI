import SnippetComponent from "../components/SnippetComponent.jsx";
import {UilCommentAltEdit, UilEdit} from "@iconscout/react-unicons";
import React, {useEffect, useState} from "react";
import {ToggleSwitch} from "flowbite-react";
import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {toast} from "react-toastify";
import {useStateContext} from "../context/ContextProvider.jsx";
import Navbar from "../components/utils/Navbar";

export default function Settings() {
  const {user} = useStateContext();
  const [snippets, setSnippets] = useState([]);
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiPineconeKey, setApiPineconeKey] = useState('');
  const [apiPineconeUrl, setApiPineconeUrl] = useState('');

  useEffect(() => {
    getSnippet();
  }, []);

  const getSnippet = () => {
    axiosClient.get(`/snippets/to/modify`)
      .then(({data}) => {
        setSnippets(data);
      })
      .catch(err => {
        toast.error("An error has occurred, check that all data has been completed");
      })
  }

  const updatePassword = () => {
    const payload = {
      'password': password,
      'passwordRepeat': passwordRepeat
    };
    axiosClient.post(`/user/update-password`, payload)
      .then(({data}) => {
        console.log(data)
        if (data.status === 'success') {
          toast.success(data.message);
          setPassword('');
          setPasswordRepeat('');
        } else {
          toast.error(data.message);
        }
      })
      .catch(err => {
        const response = err.response;
        if (response) {
          toast.error('There was a problem when chanhin password');
        }
      })
  }

  const updateApiKey = () => {
    const payload = {
      'apiKey': apiKey,
      'pineconeKey': apiPineconeKey,
      'pineconeUrl': apiPineconeUrl
    };
    axiosClient.post(`/user/update-api-key`, payload)
      .then(({data}) => {
        console.log(data)
        if (data.status === 'success') {
          toast.success(data.message);
          setApiKey('')
        } else {
          toast.error(data.message);
        }
      })
      .catch(err => {
        const response = err.response;
        if (response) {
          toast.error('There was a problem when chanhin password');
        }
      })
  }


  return (
    <div className="h-screen text-white flex flex-col mx-6 mt-5">

      <Navbar/>

      <div className="border border-white p-4 text-center text-white rounded mt-8">
        Settings
      </div>

      <div className="text-white mt-5">
        -- Snippets --
      </div>

      <div className="mx-5 mt-10 grid grid-cols-1 gap-4 ">

        {snippets.map((snippet, index) => (

          <div className="flex" key={index}>
            <div className={`grow select-none border border-ai-b bg-ai-l px-4 py-5 rounded-xl flex items-center`}>
              <div>{snippet.text}</div>
            </div>
            <Link to={`/edit/snippet/${snippet.id}`}
                  className="cursor-pointer bg-ai-orange rounded-xl flex text-center items-center mx-3 px-3">
              <UilEdit size="30"/>
            </Link>
          </div>

        ))}
      </div>
      <Link to="/add/snippet">
        <div className="cursor-pointer bg-ai-in-t rounded-xl text-center items-center mx-4 px-3 py-2 my-3">
          Add Snippet
        </div>
      </Link>



      <div className="bg-white text-black p-12 rounded-xl mx-4 mt-10">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Change Password</h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

              <div className="sm:col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="password"
                      autoComplete="new-password"
                      onChange={(event) => setPassword(event.target.value)}
                      value={password}
                      className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Repeat Password
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="password"
                      autoComplete="new-password"
                      onChange={(event) => setPasswordRepeat(event.target.value)}
                      value={passwordRepeat}
                      className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            onClick={updatePassword}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Update password
          </button>
        </div>
      </div>

      <div className="bg-white text-black p-12 rounded-xl mx-4 mt-10">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Api Key</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Only the entered elements will be actualized
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

              <div className="sm:col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Open AI - Api Key
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      autoComplete="off"
                      onChange={(event) => setApiKey(event.target.value)}
                      value={apiKey}
                      placeholder={user.placeholder_api}
                      className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="text-gray-500 text-sm mt-3">
                    <a href="https://platform.openai.com/account/api-keys" target="_blank">https://platform.openai.com/account/api-keys</a>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-full">
              <hr/>
              </div>

              <div className="sm:col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Pinecone - Api Key
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      autoComplete="off"
                      onChange={(event) => setApiPineconeKey(event.target.value)}
                      value={apiPineconeKey}
                      placeholder={user.placeholder_pinecone_api}
                      className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="text-gray-500 text-sm mt-3">
                    <a href="https://i.imgur.com/cB7QzC2.jpg" target="_blank">Where to look for it?</a>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Pinecone - Api Url
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      autoComplete="off"
                      onChange={(event) => setApiPineconeUrl(event.target.value)}
                      value={apiPineconeUrl}
                      placeholder={user.placeholder_pinecone_url}
                      className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="text-gray-500 text-sm mt-3">
                    <a href="https://i.imgur.com/5MVJs6c.jpg" target="_blank">Where to look for it?</a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            onClick={updateApiKey}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Update Api Key
          </button>
        </div>
      </div>

    </div>
  )
}
