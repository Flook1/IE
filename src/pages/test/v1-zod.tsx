import React, { type ReactElement, useEffect, useState } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import type { NextPageWithLayout } from "@/src/pages/_app";
import { zOrderStatus } from "@/src/utils/general/zEnums";

const V1Zod: NextPageWithLayout = () => {


  return (
    <>
      <div className="m-32 flex flex-col gap-6 p-14">
        <p>From zod enum checking thingy</p>
        <p>Should be processing: {zOrderStatus.Enum.processing}</p>
        <p>Should be quality control: {zOrderStatus.Enum["quality control"]}</p>
        <p>Should be completed: {zOrderStatus.Enum["completed"]}</p>
      </div>
    </>
  );
};

// layout function
V1Zod.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1Zod;
