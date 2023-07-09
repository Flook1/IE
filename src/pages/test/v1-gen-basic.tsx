import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/1/gen/layouts/LayTest";
import { formatCurr, titleCase, uniqueString } from "@/src/1/gen/utils/genBasics";

const V1GenBasic: NextPageWithLayout = (props) => {
  const string = "here Is somtHing";

  const titleString = titleCase(string);

  const randomChars = uniqueString(15);

  const testNum = 2181.2181

  const currFormatTest = formatCurr(testNum, "en-US", "currency", "AUD","symbol", true)
  const currFormatTest2 = formatCurr(testNum, "en-AU", "currency", "AUD","symbol", true)

  return (
    <>
      <div className="m-32 p-14">
        <div hidden>
          <p>{string}</p>
          <p>{titleString}</p>
        </div>
        <div hidden>
          <p>Should be random string</p>
          <p>{randomChars}</p>
        </div>
        <div>
          <p>Number formating</p>
          <p>{testNum}</p>
          <p>{currFormatTest.formatted}</p>
          <p>{currFormatTest2.formatted}</p>
        </div>
      </div>
    </>
  );
};

// layout function
V1GenBasic.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1GenBasic;
