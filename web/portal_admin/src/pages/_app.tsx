import "@/styles/globals.css";
import type { AppProps } from "next/app";
import  "bootstrap/dist/css/bootstrap.min.css"
import '@/styles/admin.css'; 
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
