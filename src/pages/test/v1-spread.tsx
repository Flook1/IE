import DebugView from "@/src/components/test/debug-view";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import { testArrObj } from "@/src/z_test/testData";
import { objUrl } from "@/src/1/gen/types/urls";

const V1Spread: NextPageWithLayout = (props) => {


  const bool = true

  return (
    <>
      <div className="m-32 p-14">
        <DebugView visible={true} header="source" content={...(bool ? [{something: "something"}]:[])}></DebugView>
        {/* <DebugView visible={true} header="source" content={...(bool ? {something: "something"}:{})}></DebugView> */}
      </div>
    </>
  );
};

// layout function
V1Spread.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1Spread;
