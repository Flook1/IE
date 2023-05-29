import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div data-theme="cyberpunk">
      <ReactQueryDevtools initialIsOpen={true} />
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
