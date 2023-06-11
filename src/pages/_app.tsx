import type { AppProps, AppType } from "next/app";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "../components/general/toaster";




// types
// export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

/* -------------------------------- Main app -------------------------------- */

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {

  // Use the layout defined at the page level, if available
  // Basically if there is getLayout function on page, it will grab that layout and then render rest of component inside that grabbed layout
  // right side means no layout
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    // <div data-theme="bumblebee">
    <div className="flex-1 bg-background">
      <ReactQueryDevtools initialIsOpen={true} />
      {getLayout(<Component {...pageProps} />)}
      <Toaster/>
    </div>
  );
};

export default api.withTRPC(MyApp);
