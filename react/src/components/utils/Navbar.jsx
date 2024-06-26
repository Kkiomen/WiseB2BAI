import {Bars2Icon} from "@heroicons/react/24/solid/index.js";
import {Link, Navigate} from "react-router-dom";
import {useStateContext} from "../../context/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import {useState} from "react";

export default function Navbar(){
  const {token, setUser, setToken} = useStateContext();
  const [showNavbar, setShowNavbar] = useState(false);

  if (!token) {
    return <Navigate to="/login"/>
  }
  const onLogout = ev => {
    ev.preventDefault()

    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null)
      })
  }

  return (
    <div>
      <div className="flex mt-8">
        <div className={`bg-ai-m-g rounded-full w-8 h-8 flex select-none items-center text-center ${ showNavbar ? 'border border-white/5' : '' } `} onClick={() => setShowNavbar(!showNavbar)}>
          <Bars2Icon className="text-white w-4 h-4 mx-auto cursor-pointer"/>
        </div>
      </div>

      {
        showNavbar && (
          <div className="mt-4 px-6 border border-white/5">

            <Link to="/">
              <div className="bg-ai-m-g rounded-2xl p-2 px-6 my-6">
                Home
              </div>
            </Link>

            <Link to="/settings">
              <div className="bg-ai-m-g rounded-2xl p-2 px-6 my-6">
                Settings
              </div>
            </Link>

            <Link to="/group">
              <div className="bg-ai-m-g rounded-2xl p-2 px-6 my-6">
                Group
              </div>
            </Link>

            <div className="bg-ai-m-g rounded-2xl p-2 px-6 my-6" onClick={onLogout}>
              Logout
            </div>

          </div>
        )
      }


    </div>
  );
}
