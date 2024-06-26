import {Navigate, Outlet} from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import {ToastContainer} from "react-toastify";

export default function GuestLayout() {
  const { user, token } = useStateContext();

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div id="guestLayout">
      <Outlet />
      <ToastContainer />
    </div>
  );
}
