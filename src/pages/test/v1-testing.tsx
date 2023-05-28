import { Separator } from "@/components/ui/separator";
import { api } from "@/src/utils/api";
import type { NextPage } from "next";
import DebugView from "@/src/components/test/debug-view";

const V1Testing: NextPage = () => {

  const testError = api.testData.basicDb.useQuery();

  return (
    <>
      <div className="m-32 p-14">
        <DebugView visible={true} header="test Header"  content={testError}></DebugView>
        <Separator />
        <DebugView visible={true} header="test Header"  content={testError}></DebugView>
      </div>
    </>
  );
};
export default V1Testing;
