import DebugView from "@/src/components/test/debug-view";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import { useRouter } from "next/router";

const V1TestUrl: NextPageWithLayout = (props) => {
  const router = useRouter()

  // get url properties
  const url = router.asPath
  const searchQueries = router.query
  const basePath = router.basePath


  return (
    <>
      <div className="m-32 p-14">
        <DebugView
          visible={true}
          header="All"
          content={router}
        ></DebugView>
                <DebugView
          visible={true}
          header="Url"
          content={url}
        ></DebugView>
                        <DebugView
          visible={true}
          header="Queries"
          content={searchQueries}
        ></DebugView>


      </div>
    </>
  );
};

// layout function
V1TestUrl.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1TestUrl;
