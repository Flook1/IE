import type { NextPageWithLayout } from "@/src/pages/_app";
import type { ReactElement } from "react";
import LayTest from "./LayTest";

const Page: NextPageWithLayout = () => {
  return <p>hello world</p>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayTest>
      <div>{page}</div>
    </LayTest>
  );
};

export default Page;
