import DebugView from "@/src/components/test/debug-view";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import { testArrObj } from "@/src/z_test/testData";
import { objUrl } from "@/src/1/gen/types/urls";

const V1TestUrl: NextPageWithLayout = (props) => {
  // main
  const map2 = testArrObj.map((item) => item.rel_auth_rule.rule_name);

  // below dont really do anything
  const flat = testArrObj.flat();
  const values = testArrObj.values();
  const keys = testArrObj.keys();
  const map = testArrObj.map((item) => {
    return item;
  });

  /* ------------------------------------------------------------------------ */
  // list of obj nested obj to array of obj
  const urlObj = objUrl.v1;
  const urlArrObj = [urlObj];
  // const urlArrObj2 = [urlObj.orderCreate, urlObj.orderDetail, urlObj.orderList, urlObj.qc];

  if(false){
    for (const key in urlObj){
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`${key}:${urlObj}`)
    }
  }

  return (
    <>
      <div className="m-32 p-14">
        <div>
          <DebugView
            visible={true}
            header="source"
            content={urlObj}
          ></DebugView>
          <DebugView
            visible={true}
            header="array1"
            content={urlArrObj}
          ></DebugView>
          <DebugView
            visible={true}
            header="array2"
            // content={urlArrObj2}
            content={"something"}
          ></DebugView>
        </div>
        <div hidden>
          <DebugView
            visible={true}
            header="source"
            content={testArrObj}
          ></DebugView>
          <DebugView visible={true} header="map2" content={map2}></DebugView>
        </div>
        <div hidden>
          <DebugView visible={true} header="flat" content={flat}></DebugView>
          <DebugView
            visible={true}
            header="values"
            content={values}
          ></DebugView>
          <DebugView visible={true} header="keys" content={keys}></DebugView>
          <DebugView visible={true} header="map" content={map}></DebugView>
        </div>
      </div>
    </>
  );
};

// layout function
V1TestUrl.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1TestUrl;
