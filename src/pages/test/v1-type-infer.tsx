import DebugView from "@/src/1/test/debug-view";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/1/gen/layouts/LayTest";
import { testArrObj } from "@/src/z_test/testData";
import { objUrl } from "@/src/1/gen/types/urls";
import { type RouterOutputs, api, type RouterInputs, type ReactQueryOptions } from "@/src/utils/api";

const V1TypeInfer: NextPageWithLayout = (props) => {
  const exampleApi = api.userBasic.userList.useQuery(
    { search: null, take: 25, page: 0 },
    {
      enabled: true,
    }
  );

  // infer type testing
  type inferredInput = RouterInputs["userBasic"]["userList"];
  type inferredOutput = RouterOutputs["userBasic"]["userList"];
  type inferredOptions = ReactQueryOptions["userBasic"]["userList"];
  let inferredOutput: inferredOutput;
  let inferredInput: inferredInput;
  let inferredOptions: inferredOptions;

  const something1 = exampleApi.data?.list[0]?.email_id;
  // const something2 = inferredOutput.list[0]?.email_id;
  // const something3 = inferredOptions;


  return (
    <>
      <div className="m-32 p-14">
        <DebugView
          visible={true}
          header="data"
          content={"something"}
        ></DebugView>
      </div>
    </>
  );
};

// layout function
V1TypeInfer.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1TypeInfer;
