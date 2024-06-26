import {Link} from "react-router-dom";

export default function NavbarChat({showNavBar}){

  return (
    <div className={` ${showNavBar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'} absolute right-0 z-10 mt-24 flex px-4 transition duration-150 ease-in-out`}>
      <div
        className="mr-8 w-[9rem] max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
        <div className="">
          <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
            <Link to="/group">
              <p className="mt-1 text-gray-600">Groups</p>
            </Link>
          </div>
          <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
            <Link to="/settings">
              <p className="mt-1 text-gray-600">Settings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
