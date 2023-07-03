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
          <IeCard variant={"large"} shadow={"inset"}>
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
