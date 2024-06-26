import React from 'react'
import ReactDOM from 'react-dom/client'
import Dashboard from './Dashboard.jsx'
import { register } from 'swiper/element/bundle';
import 'swiper/swiper.css'
import './index.css'
import './assets/css/atom-one-dark.css'
import 'react-toastify/dist/ReactToastify.css';
import {RouterProvider} from "react-router-dom";
import router from "./router.jsx";
import {ContextProvider} from './context/ContextProvider.jsx'
import {CookiesProvider} from "react-cookie";
register();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </CookiesProvider>
  </React.StrictMode>
);
