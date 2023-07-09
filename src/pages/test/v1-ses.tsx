import { Separator } from "@/components/ui/separator";
import { api } from "@/src/utils/api";
import DebugView from "@/src/1/test/debug-view";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/1/gen/layouts/LayTest";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Loader2 } from "lucide-react";

const V1TestSes: NextPageWithLayout = () => {
  const sesCheckExists = api.authCheck.sesCheck.useQuery(
    { verify: false, throwErr: false },
    {
      enabled: true,
    }
  );
  const sesCheckVerify = api.authCheck.sesCheck.useQuery(
    { verify: true, throwErr: false },
    {
      enabled: true,
    }
  );
  const sesGet = api.authCheck.sesGet.useQuery(undefined, {
    enabled: true,
    onError: (error) => {
      console.log("authSesValid: error");
      console.log(error);
    },
    onSuccess: (data) => {
      console.log("authSesValid: success");
      console.log(data);
    },
  });

  const sesDel = api.authCheck.sesDel.useMutation({
    onSuccess: (data) => {
      // refretch other query for session data see if its gone
      void sesGet.refetch();
      console.log(sesGet.data);
    },
  });

  return (
    <>
      <div className="m-32 p-14">
        <div>
          <Button onClick={() => sesDel.mutate()}>
            {sesDel.isLoading && <Loader2 className="animate-spin" />}
            Del session test
          </Button>
        </div>
        <DebugView
          visible={true}
          header="sesCheckExists"
          // content={"disabled"}
          content={sesCheckExists}
        ></DebugView>
        <DebugView
          visible={true}
          header="sesCheckVerify"
          // content={"disabled"}
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
