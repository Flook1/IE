import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import { titleCase} from "@/src/1/gen/utils-client/genBasics";

const V1TestUrl: NextPageWithLayout = (props) => {
  const string = "here Is somtHing";

  const titleString  = titleCase(string);

  return (
    <>
      <div className="m-32 p-14">
        <p>{string}</p>
        <p>{titleString}</p>
      </div>
    </>
  );
};

// layout function
V1TestUrl.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1TestUrl;
