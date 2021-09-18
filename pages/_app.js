import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import { storeWrapper } from "../store";
import { checkLogin } from "./api";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default storeWrapper.withRedux(MyApp);
