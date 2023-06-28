import { Separator } from "@/components/ui/separator";
import { api } from "@/src/utils/api";
import type { NextPage } from "next";
import DebugView from "@/src/components/test/debug-view";
import useRenderCounter from "@/src/components/general/renderCount";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { type ReactElement, useEffect, useState } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import type { NextPageWithLayout } from "@/src/pages/_app";
import { dateGenUtc } from "@/src/1/gen/utils/genDates";

dayjs.extend(utc);
dayjs.extend(timezone);

const V1Testing: NextPageWithLayout = () => {
  const rerenderCount = useRenderCounter({ enabled: true });

  const testDates = api.testDate.dateBasic.useQuery(undefined, {
    enabled: true,
  });

  // const tzguess = dayjs.tz.guess();
  const [dateNowTz, setDateNowTz] = useState<string>();

  useEffect(() => {
    setDateNowTz(dayjs(testDates.data?.dateNowIso).format());
  }, [testDates.data?.dateNowIso]);

  return (
    <>
      <div className="m-32 p-14">
        <div>
          <DebugView
            visible={true}
            header="Date for Utc"
            content={dateGenUtc}
          ></DebugView>
        </div>
        <div hidden>
          {rerenderCount}
          <div>
            <p>Date information formated with day.js</p>
            <p>FROM SERVER | STRING | UTC</p>
            <p>iso: {testDates.data?.dateNowIso}</p>
            <p>ddmmyyyy: {testDates.data?.dateNowDD}</p>
            <Separator />
            <p>String to Day.js</p>
            {/* <p>TZ Guess: {tzguess}</p> */}
            <p>iso day.js: {dateNowTz}</p>
          </div>
          <Separator />
          <DebugView
            visible={true}
            header="test - dates"
            content={testDates}
          ></DebugView>
        </div>
      </div>
    </>
  );
};

// layout function
V1Testing.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1Testing;
