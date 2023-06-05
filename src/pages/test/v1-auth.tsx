import { Separator } from "@/components/ui/separator";
import { api } from "@/src/utils/api";
import type { NextPage } from "next";
import DebugView from "@/src/components/test/debug-view";
import { Card } from "@/components/ui/card";

const V1Testing: NextPage = () => {
  const testSesObj = api.testAuth.authSesObj.useQuery(undefined, {
    enabled: true,
  });

  return (
    <>
      <div className="m-32 p-14">
        <DebugView
          visible={true}
          header="testSesObj"
          content={testSesObj}
        ></DebugView>
      </div>
    </>
  );
};
export default V1Testing;
