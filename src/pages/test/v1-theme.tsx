import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import DebugView from "@/src/components/test/debug-view";
import {
  IeCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ie/ie-card";

// this is just for theme page, of components and radix ui
const V1Theme: NextPageWithLayout = (props) => {
  return (
    <>
      <div className="m-32 p-14">
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3">
          <IeCard
            variant={"test"}
            shadow={"out"}
            className="hover:bg-red-200/30"
          ></IeCard>
          <IeCard
            variant={"large"}
            shadow={"none"}
            className="hover:bg-red-200/30"
          ></IeCard>
          <div className="h-32 w-full bg-red-200"></div>
          <div className="h-32 w-full bg-red-200"></div>
        </div>
        <IeCard>
          <CardHeader>Something here</CardHeader>
          <CardContent>
            Something
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </CardContent>
        </IeCard>
        <div className="container">
          <IeCard variant={"large"} shadow={"in"}>
            <CardHeader>Something here</CardHeader>
            <CardContent>
              Something
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </CardContent>
          </IeCard>
        </div>
      </div>
    </>
  );
};

// layout function
V1Theme.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1Theme;
