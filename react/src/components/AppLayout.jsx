import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import {useEffect, useState} from "react";
import {
  UilCalendarAlt,
  UilClapperBoard,
  UilCog,
  UilCommentAltQuestion,
  UilSetting,
  UilUsersAlt
} from "@iconscout/react-unicons";
import {ToastContainer} from "react-toastify";
import Settings from "../views/Settings.jsx";

export default function AppLayout() {
  const {user, token, setUser, setToken, notification} = useStateContext();
  const [showMobileNavbar, setShowMobileNavbar] = useState(false);

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

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
        setUser(data)
      })
  }, [])



  const messages = [
    {
      id: 1,
      sender: 'me',
      message: {
        original: 'Cześć, jak się masz?',
        translate: 'Hi, how are you?'
      },
      date: '2023-04-20T14:30:00.000Z',
      translated: true
    },
    {
      id: 2,
      sender: 'ai',
      message: {
        original: 'Dziękuję, mam się dobrze. A Ty?',
        translate: 'Thank you, I am doing well. How about you?'
      },
      date: '2023-04-20T14:35:00.000Z',
      translated: true
    },
    {
      id: 3,
      sender: 'me',
      message: {
        original: 'Też jestem w porządku, dzięki.',
        translate: 'I am doing well too, thanks.'
      },
      date: '2023-04-20T14:40:00.000Z',
      translated: true
    },
    {
      id: 4,
      sender: 'ai',
      message: {
        original: 'Czy mogę w czymś pomóc?',
        translate: 'Can I help you with anything?'
      },
      date: '2023-04-20T14:45:00.000Z',
      translated: true
    }
  ];

  return (
    <div className="bg-ai-b h-screen w-full sm:flex flex-row">

      {/*== SM ==*/}
      <div className="text-white block sm:hidden mx-4">
        <div className="flex justify-end mt-3" onClick={() => setShowMobileNavbar(!showMobileNavbar)}>
          <HiAdjustmentsHorizontal className="h-5 w-5" />
        </div>

        {
          showMobileNavbar && (
           <Settings/>
          )
        }


      </div>
      {/*== SM ==*/}

      {/*== MD ==*/}
      <div className="bg-ai-l hidden sm:block p-3 text-white w-full sm:w-2/12 lg:w-1/12 flex flex-col justify-between">
        <div className="text-center text-sm flex flex-row justify-between sm:flex-col">

          {/*Item menu*/}

          <Link to="/home" className="flex flex-col justify-center text-center items-center gap-2 hover:text-gray-200 hover:shadow hover:cursor-pointer mx-5 my-2 py-3 sm:mx-0 ">
            <div className="mr-[3px]">
              <img className="h-20 w-20 rounded-xl ring-2 ring-purple-300 hover:ring-bg-ai-b select-none"
                   src="https://i.imgur.com/EQtW3mv.png" />
            </div>
            <div className="text-[20px] font-thin mt-1 hover:font-semibold">
              Dely
            </div>
          </Link>

          {/*<Link to="/board" className="flex flex-col justify-center text-center items-center gap-2 font-semibold border-b border-1 border-gray-500/10 cursor-pointer hover:bg-ai-bt-hover/30 py-5">*/}
          {/*  <div className="mr-[3px] text-white shadow-lg">*/}
          {/*    <UilClapperBoard size="30" />*/}
          {/*  </div>*/}
          {/*  Board*/}
          {/*</Link>*/}

          {/*<div className="flex flex-col justify-center text-center items-center gap-2 border-b border-1 border-gray-500/10 cursor-pointer hover:bg-ai-bt-hover/30 py-5">*/}
          {/*  <div className="mr-[3px] text-white shadow-lg">*/}
          {/*    <UilCalendarAlt size="30"/>*/}
          {/*  </div>*/}
          {/*  Calendar*/}
          {/*</div>*/}

          {/*<div className="flex flex-col justify-center text-center items-center gap-2  border-b border-1 border-gray-500/10 cursor-pointer hover:bg-ai-bt-hover/30 py-5">*/}
          {/*  <div className="mr-[3px] text-white shadow-lg">*/}
          {/*    <UilCommentAltQuestion size="30"/>*/}
          {/*  </div>*/}
          {/*  Social*/}
          {/*</div>*/}

          {/*<Link to="/trader" className="flex flex-col justify-center text-center items-center gap-2  border-b border-1 border-gray-500/10 cursor-pointer hover:bg-ai-bt-hover/30 py-5">*/}
          {/*  <div className="mr-[3px] text-white shadow-lg">*/}
          {/*    <UilCommentAltQuestion size="30"/>*/}
          {/*  </div>*/}
          {/*  Trader*/}
          {/*</Link>*/}

          {/*<Link to="/product-description" className="flex flex-col justify-center text-center items-center gap-2  border-b border-1 border-gray-500/10 cursor-pointer hover:bg-ai-bt-hover/30 py-5">*/}
          {/*  <div className="mr-[3px] text-white shadow-lg">*/}
          {/*    <UilCommentAltQuestion size="30"/>*/}
          {/*  </div>*/}
          {/*  Product Description*/}
          {/*</Link>*/}

          <Link to="/group" className="flex flex-col justify-center text-center items-center gap-2  border-b border-1 border-gray-500/10 cursor-pointer hover:bg-ai-bt-hover/30 py-5">
            <div className="mr-[3px] text-white shadow-lg">
              <UilUsersAlt size="30"/>
            </div>
            Group
          </Link>


        </div>
        <div className="text-center text-sm my-4">
          <Link to="/settings">
            <div className="flex flex-row items-center text-center justify-center p-3 rounded-full bg-ai-b hover:bg-white hover:cursor-pointer">
              <UilCog size="30" color="#737aae"/>
            </div>
          </Link>
        </div>
      </div>
      {/*== MD ==*/}

      <div className="sm:w-11/12">
        <Outlet/>
      </div>
      <ToastContainer />
    </div>
  );

}
