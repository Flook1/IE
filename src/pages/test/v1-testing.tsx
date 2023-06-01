import { Separator } from "@/components/ui/separator";
import { api } from "@/src/utils/api";
import type { NextPage } from "next";
import DebugView from "@/src/components/test/debug-view";
import { Card } from "@/components/ui/card";


const V1Testing: NextPage = () => {
  const testBasicRuleCheck = api.testData.basicRuleCheck.useQuery(undefined, {enabled: false});
  const testEnvLog = api.testData.envLog.useQuery(undefined, {enabled: false});
  const testError = api.testData.basicDb.useQuery(undefined, {enabled: false});
  const testUserFullAuth = api.testData.getUserFullAuth.useQuery(undefined, {enabled: false});
  const testErrorStop = api.testData.errorStopTest.useQuery(undefined, {enabled: false});
  const testErrorStop2 = api.testData.errorStopTest2.useQuery(undefined, {enabled: true});

  return (
    <>
      <div className="m-32 p-14">
        <Separator />
        <DebugView
          visible={true}
          header="TestEnvLog"
          content={testEnvLog}
        ></DebugView>
        <DebugView
          visible={true}
          header="BasicRuleCheck"
          content={testBasicRuleCheck}
        ></DebugView>
        <DebugView
          visible={true}
          header="Basic Db"
          content={testError}
        ></DebugView>
        {/* testUserFullAuth */}
        <DebugView
          visible={true}
          header="ErrorFlowTest"
          content={testErrorStop}
        ></DebugView>
        <DebugView
          visible={true}
          header="2ErrorFlowTest2"
          content={testErrorStop2}
        ></DebugView>
        <DebugView
          visible={true}
          header="TestUserFullAuth"
          content={testUserFullAuth}
        ></DebugView>

        {/* Example sadhcn card */}
        <div className="hidden">
          <Card>
            soemthing
            <br />
            <br />
            <br />
            soemthing soemthing soemthing soemthing
          </Card>
        </div>
        {/* Exmaple daisy card */}
        <div className="hidden bg-slate-50 p-12">
          <div className="card bg-base-100 shadow-xl">
            <div>
              something
              <br />
              <br />
              <br />
              <br />
              <br />
              something
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default V1Testing;
