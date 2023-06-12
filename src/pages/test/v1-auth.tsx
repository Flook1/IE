import { api } from "@/src/utils/api";
import DebugView from "@/src/components/test/debug-view";
import LayTest from "@/src/components/layouts/LayTest";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { useRouter } from "next/router";

const V1Testing: NextPageWithLayout = () => {
  const router = useRouter();
  const testIsEnv = api.genMain.isEnv.useQuery(
    { envSel: "my", envType: "development" },
    {
      enabled: false,

      onSuccess: (data) => {
        console.log(`something here ${String(data)}`);
        console.log(`something here ${String(data)}`);
        console.log(`something here ${String(data)}`);
        console.log(`something here ${String(data)}`);
        if (!data.isAllowed) {
          // if (false) {
          // if (!data) {
          // will redirect here:
          void router.push("/404");
        }
      },
    }
  );

  return (
    <>
      <div className="m-32 p-14">
        <DebugView
          visible={true}
          header="testIsEnv"
          content={testIsEnv}
        ></DebugView>
      </div>
    </>
  );
};

// layout function
V1Testing.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};
export default V1Testing;
