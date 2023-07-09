import { type NextPage } from "next";
import { SkeletonCard } from "../../gen/components/skeleton";
import { IeCard } from "@/components/ie/ie-card";
import { api } from "@/src/utils/api";
import DebugView from "@/src/1/test/debug-view";

export const UserAuthList: NextPage = () => {
  const userList = api.userBasic.userList.useQuery(
    { search: "haydn", take: 25, page: 0 },
    {
      enabled: true,
    }
  );

  return (
    <>
      <div>
        <p>Testing</p>
        <DebugView
          visible
          header="Query Data"
          content={userList.data}
        ></DebugView>
      </div>
    </>
  );
};
