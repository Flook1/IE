import { api } from "@/src/utils/api";
import DebugView from "@/src/components/test/debug-view";
import LayTest from "@/src/components/layouts/LayTest";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";

const V1Testing: NextPageWithLayout = () => {
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

// layout function
V1Testing.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};
export default V1Testing;
