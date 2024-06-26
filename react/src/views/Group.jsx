import {useStateContext} from "../context/ContextProvider.jsx";
import React, {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {toast} from "react-toastify";
import Navbar from "../components/utils/Navbar";

export default function Group() {
  const {user} = useStateContext();
  const [showFormCreateGroup, setShowFormCreateGroup] = useState(false);
  const [showFormAddUser, setShowFormAddUser] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiPineconeKey, setApiPineconeKey] = useState("");
  const [apiPineconeUrl, setApiPineconeUrl] = useState("");
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUsedApi, setSelectedUsedApi] = useState('private');
  const [selectedUsedLongTerm, setSelectedUsedLongTerm] = useState('private');
  const [selectedRole, setSelectedRole] = useState('USER');
  const [mode, setMode] = useState('create');


  useEffect(() => {
    getGroups();
  }, [])

  const getGroups = () => {
    axiosClient.get(`/groups`)
      .then(({data}) => {
        setGroups(data);
      })
      .catch(err => {
        const response = err.response;
        if (response) {
          toast.error('There was a problem - get groups');
        }
      })
  }

  const addGroup = () => {
    const payload = {
      'name': groupName,
      'apiKey': apiKey,
      'groupId': activeGroup,
      'pineconeKey': apiPineconeKey,
      'pineconeUrl': apiPineconeUrl
    };
    axiosClient.post(`/add/group`, payload)
      .then(({data}) => {
        if (data.status === 'success') {
          toast.success(data.message);
          setGroupName('');
          setApiKey('');
          setApiPineconeKey('');
          setApiPineconeUrl('');
          getGroups();
          setShowFormCreateGroup(!showFormCreateGroup)
        } else {
          toast.error(data.message);
        }

      })
      .catch(err => {
        const response = err.response;
        if (response) {
          toast.error('There was a problem when adding a group');
        }
      })
  }

  const modifyUser = () => {
    const payload = {
      'name': name,
      'password': password,
      'email': email,
      'groupId': activeGroup,
      'userId': activeUser,
      'usedAPI': selectedUsedApi,
      'usedPinecone': selectedUsedLongTerm,
      'mode': mode,
      'role': selectedRole
    };
    axiosClient.put(`/modify/group/user`, payload)
      .then(({data}) => {
        if (data.status === 'success') {
          toast.success(data.message);
          setName('');
          setPassword('');
          setEmail('');
          getGroups();
          setShowFormAddUser(!showFormAddUser);
        } else {
          toast.error(data.message);
        }
      })
      .catch(err => {
        const response = err.response;
        if (response) {
          toast.error('There was a problem when adding a group');
        }
      })
  }

  const showFormToAddUser = (groupId) => {
    setName('');
    setPassword('');
    setEmail('');
    setSelectedRole('USER');
    setShowFormAddUser(!showFormAddUser);
    setActiveGroup(groupId);
    setMode('create');
    setActiveUser(null);
  }

  const deleteUser = () => {
    const payload = {
      'groupId': activeGroup,
      'userId': activeUser,
      'mode': mode
    };
    axiosClient.post(`/delete/group/user`, payload)
      .then(({data}) => {
        if (data.status === 'success') {
          toast.success(data.message);
          setName('');
          setPassword('');
          setEmail('');
          getGroups();
          setShowFormAddUser(!showFormAddUser);
        } else {
          toast.error(data.message);
        }
      })
      .catch(err => {
        const response = err.response;
        if (response) {
          toast.error('There was a problem when delete user');
        }
      })
  }

  const showFormToEditUser = (groupId, userId) => {
    setShowFormAddUser(!showFormAddUser);
    setActiveGroup(groupId);
    setActiveUser(userId);
    setMode('edit')
    axiosClient.get(`/add/group/user/${groupId}/${userId}`)
      .then(({data}) => {
        if (data.status === 'success') {
          setName(data.response.name);
          setEmail(data.response.email)
          setPassword('')
          setSelectedUsedApi(data.response.used_api)
          setSelectedUsedLongTerm(data.response.used_long_term)
          setSelectedRole(data.response.role)
        } else {
          toast.error(data.message);
        }
      })
      .catch(err => {
        const response = err.response;
        if (response) {
          toast.error('There was a problem when adding a group');
        }
      })
  }

  const addGroupForm = () => {
    setMode('create');
    setGroupName('');
    setActiveGroup(null);
    setShowFormCreateGroup(!showFormCreateGroup);
  }

  const editGroupForm = (groupId, groupName) => {
    setMode('edit');
    setGroupName(groupName);
    setActiveGroup(groupId);
    setShowFormCreateGroup(!showFormCreateGroup);
  }


  return (
    <div className="h-screen text-white flex flex-col mx-6 mt-5">

      <Navbar />

      <div className="flex justify-end my-6">
        {
          user.role === "ADMINISTRATOR" && (
            <div
              onClick={() => addGroupForm()}
              className="bg-ai-t hover:bg-ai-in-t cursor-pointer rounded px-3 py-1 text-center text-white">
              Add group
            </div>
          )
        }

      </div>
      <div>

        {
          showFormCreateGroup && user.role === "ADMINISTRATOR" && (
            <div className="bg-white rounded-xl p-8 mb-7 text-black">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Group name
                  </label>
                  <div className="mt-2">
                    <div
                      className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        onChange={(event) => setGroupName(event.target.value)}
                        value={groupName}
                        className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="WWW2"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Open AI - API Key
                  </label>
                  <div className="mt-2">
                    <div
                      className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        onChange={(event) => setApiKey(event.target.value)}
                        value={apiKey}
                        className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="sk-...."
                      />
                    </div>
                    {
                      mode == 'edit' && (
                        <span className="text-gray-500 text-sm">If you do not want to update the api key, leave blank</span>
                      )
                    }
                  </div>

                  <div className="sm:col-span-full mt-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Pinecone - API Key
                    </label>
                    <div className="mt-2">
                      <div
                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                        <input
                          type="text"
                          onChange={(event) => setApiPineconeKey(event.target.value)}
                          value={apiPineconeKey}
                          className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="cd3a..."
                        />
                      </div>
                      {
                        mode == 'edit' && (
                          <span className="text-gray-500 text-sm">If you do not want to update the api key, leave blank</span>
                        )
                      }
                    </div>
                  </div>

                    <div className="sm:col-span-full mt-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Pinecone - API Url
                      </label>
                      <div className="mt-2">
                        <div
                          className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                          <input
                            type="text"
                            onChange={(event) => setApiPineconeUrl(event.target.value)}
                            value={apiPineconeUrl}
                            className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="index_name-project_id.svc.environment.pinecone.io"
                          />
                        </div>
                        {
                          mode == 'edit' && (
                            <span className="text-gray-500 text-sm">If you do not want to update the api url, leave blank</span>
                          )
                        }
                      </div>
                    </div>


                </div>
              </div>

              <div className="flex justify-end my-6">
                {
                  mode == 'create' && (
                    <div
                      onClick={() => addGroup()}
                      className="bg-ai-t hover:bg-ai-in-t cursor-pointer rounded px-3 py-1 text-center text-white">
                      Create new group
                    </div>
                  )
                }
                {
                  mode == 'edit' && (
                    <div
                      onClick={() => addGroup()}
                      className="bg-ai-t hover:bg-ai-in-t cursor-pointer rounded px-3 py-1 text-center text-white">
                      Edit group
                    </div>
                  )
                }

              </div>

            </div>
          )
        }

        {
          showFormAddUser && (
            <div className="bg-white rounded-xl p-8 mb-7 text-black">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    User name
                  </label>
                  <div className="mt-2">
                    <div
                      className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        onChange={(event) => setName(event.target.value)}
                        value={name}
                        className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Jan Kowalski"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    E-mail
                  </label>
                  <div className="mt-2">
                    <div
                      className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="email"
                        onChange={(event) => setEmail(event.target.value)}
                        value={email}
                        className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="kowalski@email.com"
                      />
                    </div>
                  </div>
                </div>


                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <div
                      className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="password"
                        autoComplete="new-password"
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                        className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder=""
                      />
                    </div>
                    {
                      mode == 'edit' && (
                        <span className="text-gray-500 text-sm">Leave blank if you don't want to change your password</span>
                      )
                    }
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Role
                  </label>
                  <div className="mt-2">
                    <div
                      className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <select id="role"
                              value={selectedRole}
                              onChange={(event) => setSelectedRole(event.target.value)}
                              defaultValue="private"
                              disabled={activeUser === user.id}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="USER">User</option>
                        <option value="MODERATOR">Moderator</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Which api should this user use?
                  </label>
                  <div className="mt-2">
                    <div
                      className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <select id="api"
                              value={selectedUsedApi}
                              onChange={(event) => setSelectedUsedApi(event.target.value)}
                              defaultValue="private"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="private">Private (can add it in the settings)</option>
                        <option
                          disabled={user.role !== "ADMINISTRATOR"}
                          value="system">System</option>
                        <option value="group">Group</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Which long term memory should this user use?
                  </label>
                  <div className="mt-2">
                    <div
                      className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <select id="api"
                              value={selectedUsedLongTerm}
                              onChange={(event) => setSelectedUsedLongTerm(event.target.value)}
                              defaultValue="private"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="private">Private (can add it in the settings)</option>
                        <option
                          disabled={user.role !== "ADMINISTRATOR"}
                          value="system">System</option>
                        <option value="group">Group</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-end my-6">
                {
                  mode == 'create' && (
                    <div
                      onClick={() => modifyUser()}
                      className="bg-ai-t hover:bg-ai-in-t cursor-pointer rounded px-3 py-1 text-center text-white">
                      Create new user
                    </div>
                  )
                }

                {
                  mode == 'edit' && (
                    <div className="flex gap-4">
                      {
                        activeUser !== user.id && (
                          <div
                            onClick={() => deleteUser()}
                            className="bg-red-500 hover:bg-red-400 cursor-pointer rounded px-3 py-1 text-center text-white">
                            Delete user
                          </div>
                        )
                      }
                      <div
                        onClick={() => modifyUser()}
                        className="bg-ai-t hover:bg-ai-in-t cursor-pointer rounded px-3 py-1 text-center text-white">
                        Edit user
                      </div>
                    </div>
                  )
                }
              </div>

            </div>
          )
        }

        {groups.map((group, index) => (

          <div className="bg-white py-24 sm:py-32 my-10" key={index}>
            <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{group.name}</h2>
                <div className="text-gray-700">
                  {
                    group.can_modify && (
                      <div className="flex gap-2">
                        <div className="cursor-pointer hover:underline select-none"
                             onClick={() => showFormToAddUser(group.id)}>Add user
                        </div>
                        <div> |</div>
                        <div className="cursor-pointer hover:underline select-none"
                             onClick={() => editGroupForm(group.id, group.name)}>Edit group
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
              <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">

                {group.users.map((user, indexUser) => (
                  <li key={indexUser}>
                    <div className="flex items-center gap-x-6">
                      <div>
                        <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{user.name}</h3>
                        <p className="text-sm font-semibold leading-6 text-indigo-600 capitalize">{user.role}
                          {
                            group.can_modify && (
                              <span className="ml-1">
                                 | <span className="cursor-pointer hover:underline"
                                         onClick={() => showFormToEditUser(group.id, user.user_id)}> edit</span>
                              </span>
                            )
                          }
                        </p>
                      </div>
                    </div>
                  </li>
                ))}

              </ul>
            </div>
          </div>

        ))}


      </div>
    </div>
  )
}
