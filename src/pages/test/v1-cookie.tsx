import { Separator } from "@/components/ui/separator";
import { api } from "@/src/utils/api";
import type { NextPage } from "next";
import DebugView from "@/src/components/test/debug-view";

const V1TestCookie: NextPage = () => {
  const cookieConsoleLog = api.testCookie.cookieLog.useQuery(undefined, {
    enabled: false,
  });
  const setCsrf = api.testCookie.setCSRF.useQuery(undefined, {
    enabled: true,
  });
  const csrfVerify = api.testCookie.csrfVerify.useQuery(undefined, {
    enabled: false,
  });
  const limitTest = api.testLimit.limitTest.useQuery(undefined, {
    enabled: true,
  });

  const limitTestRefetch =  (e:React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault()

    void limitTest.refetch()

  }

  return (
    <>
      <div className="m-32 p-14">
        <Separator />

        <DebugView
          visible={true}
          header="SeeCookieServerSide"
          content={cookieConsoleLog}
        ></DebugView>

        <DebugView
          visible={true}
          header="setCsrf"
          content={setCsrf}
        ></DebugView>

        <DebugView
          visible={true}
          header="csrfVerify"
          content={csrfVerify}
        ></DebugView>
        <DebugView
          visible={true}
          header="testLimit"
          content={limitTest}
        ></DebugView>
        <button className="d-btn" onClick={(e) => {limitTestRefetch(e)}}>Trigger Limit Call</button>
      </div>
    </>
  );
};
export default V1TestCookie;
