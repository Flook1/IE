import DebugView from "@/src/components/test/debug-view";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import { useRouter } from "next/router";
import { api } from "@/src/utils/api";

const V1TestUrl: NextPageWithLayout = (props) => {
  const router = useRouter();

  const commonData = api.genMain.basicContent.useQuery(undefined, {
    enabled: true,
  });
  const menuData = api.genMain.menuContent.useQuery(undefined, {
    enabled: true,
  });

  return (
    <>
      <div className="m-32 p-14">
        <DebugView
          visible={true}
          header="common data"
          content={commonData}
        ></DebugView>

        <DebugView
          visible={true}
          header="menu data"
          content={menuData}
        ></DebugView>
                <DebugView
          visible={true}
          header="menu first item"
          content={menuData.data?.menuList[0]}
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
