import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { type ReactElement, useEffect, useState } from "react";
import LayTest from "@/src/1/gen/layouts/LayTest";
import type { NextPageWithLayout } from "@/src/pages/_app";
import { TestStateComp } from "@/src/1/test/state-test-comp";

dayjs.extend(utc);
dayjs.extend(timezone);

const V1StateHook: NextPageWithLayout = () => {
  // this is to just check how use state works in hook shared with multiple components.

  return (
    <>
      <div className="m-32 p-14">
        <TestStateComp id="1"></TestStateComp>
        <TestStateComp id="2"></TestStateComp>
        <TestStateComp id="3"></TestStateComp>
        <TestStateComp id="4"></TestStateComp>
        <TestStateComp id="5"></TestStateComp>
        <TestStateComp id="6"></TestStateComp>
      </div>
    </>
  );
};

// layout function
V1StateHook.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1StateHook;
