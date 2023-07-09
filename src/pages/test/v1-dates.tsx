import { Separator } from "@/components/ui/separator";
import { api } from "@/src/utils/api";
import type { NextPage } from "next";
import DebugView from "@/src/1/test/debug-view";
import useRenderCounter from "@/src/1/gen/components/renderCount";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { type ReactElement, useEffect, useState } from "react";
import LayTest from "@/src/1/gen/layouts/LayTest";
import type { NextPageWithLayout } from "@/src/pages/_app";
import { dateGenUtc } from "@/src/1/gen/utils/genDates";

dayjs.extend(utc);
dayjs.extend(timezone);

const V1Testing: NextPageWithLayout = () => {
  const rerenderCount = useRenderCounter({ enabled: true });

  const testDates = api.testDate.dateBasic.useQuery(undefined, {
    enabled: true,
  });

  const isoDate = dayjs().toISOString();
  const isoDate2 = dateGenUtc.lastMonthEnd;

  const stringDate = "1688283922627";
  const stringDateNew = dayjs(stringDate);
  const stringToDate = {
    stringDate,
    stringDateNew
  }

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
            header="string date"
            content={stringToDate}
          ></DebugView>
          <DebugView
            visible={true}
            header="Iso String"
            content={isoDate}
          ></DebugView>
          <DebugView
            visible={true}
            header="Iso String2"
            content={isoDate2}
          ></DebugView>

          <DebugView
            visible={true}
            header="Date for Utc"
            content={dateGenUtc}
          ></DebugView>
          <DebugView
            visible={true}
            header="Iso Convert"
            content={dateGenUtc.dateNow}
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
