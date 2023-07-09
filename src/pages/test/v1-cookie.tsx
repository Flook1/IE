import { Separator } from "@/components/ui/separator";
import { api } from "@/src/utils/api";
import DebugView from "@/src/1/test/debug-view";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/1/gen/layouts/LayTest";

const V1TestCookie: NextPageWithLayout = () => {
  const cookieConsoleLog = api.testCookie.cookieLog.useQuery(undefined, {
    enabled: false,
  });
  const setCsrf = api.testCookie.setCSRF.useQuery(undefined, {
    enabled: true,
  });
  const csrfVerify = api.testCookie.csrfVerify.useQuery(undefined, {
    enabled: false,
  });
  const testCookieGet = api.testCookie.cookieGet.useQuery(undefined, {
    enabled: true,
  });

  const limitTest = api.testLimit.limitTest.useQuery(undefined, {
    enabled: false,
  });

  const limitTestRefetch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    void limitTest.refetch();
  };

  return (
    <>
      <div className="m-32 p-14">
        <Separator />
        <DebugView
          visible={true}
          header="testGetCookie"
          content={testCookieGet}
        ></DebugView>
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
        <button
          className="d-btn"
          onClick={(e) => {
            limitTestRefetch(e);
          }}
        >
          Trigger Limit Call
        </button>
      </div>
    </>
  );
};

// layout function
V1TestCookie.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1TestCookie;
