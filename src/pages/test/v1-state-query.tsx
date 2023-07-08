import { type ReactElement, useEffect, useState } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import type { NextPageWithLayout } from "@/src/pages/_app";
import { TestStateCompQuery } from "@/src/components/test/state-test-comp-query";

const V1StateQuery: NextPageWithLayout = () => {
  return (
    <>
      <div className="m-32 p-14">
        <p>State Query Testing</p>
        <div>
        <TestStateCompQuery id="1"></TestStateCompQuery>
        <TestStateCompQuery id="2"></TestStateCompQuery>
        <TestStateCompQuery id="3"></TestStateCompQuery>
        <TestStateCompQuery id="4"></TestStateCompQuery>
        <TestStateCompQuery id="5"></TestStateCompQuery>
        <TestStateCompQuery id="6"></TestStateCompQuery>
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
