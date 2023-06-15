import { Separator } from "@/components/ui/separator";
import { api } from "@/src/utils/api";
import DebugView from "@/src/components/test/debug-view";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/components/layouts/LayTest";

const V1TestSes: NextPageWithLayout = () => {
  const sesCheckExists = api.authCheck.sesCheck.useQuery(
    { verify: false },
    {
      enabled: false,
    }
  );
  const sesCheckVerify = api.authCheck.sesCheck.useQuery(
    { verify: true },
    {
      enabled: false,
    }
  );
  const sesGet = api.authCheck.sesGet.useQuery(undefined, { enabled: true });

  return (
    <>
      <div className="m-32 p-14">
        <DebugView
          visible={true}
          header="sesCheckExists"
          content={sesCheckExists}
        ></DebugView>
        <DebugView
          visible={true}
          header="sesCheckVerify"
          content={sesCheckVerify}
        ></DebugView>
        <DebugView
          visible={true}
          header="sesGet"
          // content={sesGet}
          content={sesGet.data}
        ></DebugView>
      </div>
    </>
  );
};

// layout function
V1TestSes.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1TestSes;
