import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import { titleCase, uniqueString } from "@/src/1/gen/utils/genBasics";

const V1TestUrl: NextPageWithLayout = (props) => {
  const string = "here Is somtHing";

  const titleString = titleCase(string);

  const randomChars = uniqueString(15);

  return (
    <>
      <div className="m-32 p-14">
        <div hidden>
          <p>{string}</p>
          <p>{titleString}</p>
        </div>
        <div>
          <p>Should be random string</p>
          <p>{randomChars}</p>
        </div>
      </div>
    </>
  );
};

// layout function
V1TestUrl.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1TestUrl;
