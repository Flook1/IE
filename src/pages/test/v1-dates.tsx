import { Separator } from "@/components/ui/separator";
import { api } from "@/src/utils/api";
import type { NextPage } from "next";
import DebugView from "@/src/components/test/debug-view";
import useRenderCounter from "@/src/utils/general/renderCount";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

const V1Testing: NextPage = () => {
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
    </>
  );
};
export default V1Testing;
