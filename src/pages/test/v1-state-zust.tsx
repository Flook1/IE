import { type ReactElement, useEffect, useState } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import type { NextPageWithLayout } from "@/src/pages/_app";
import { TestStateZust } from "@/src/components/test/state-test-comp-zust";

const V1StateQuery: NextPageWithLayout = () => {
  return (
    <>
      <div className="m-32 p-14">
        <p>State Query Testing</p>
        <div>
        <TestStateZust id="1"></TestStateZust>
        <TestStateZust id="2"></TestStateZust>
        <TestStateZust id="3"></TestStateZust>
        <TestStateZust id="4"></TestStateZust>
        <TestStateZust id="5"></TestStateZust>
        <TestStateZust id="6"></TestStateZust>
        </div>
      </div>
    </>
  );
};

// layout function
V1StateQuery.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1StateQuery;
