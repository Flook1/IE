/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { type ReactElement, useEffect, useState } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import type { NextPageWithLayout } from "@/src/pages/_app";
import { useToast } from "@/components/ui/use-toast";
import { redirectTest } from "@/src/components/test/test-redirect";
import { redirect } from "next/dist/server/api-utils";
import { type NextResponse } from "next/server";
import { type NextApiResponse } from "next";

// server side here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getServerSideProps({res}:{res:NextApiResponse}) {

  // Method one
  if (false) {
    const redirect = redirectTest(false);
    if (redirect?.redirect) {
      return redirect;
    } else {
      return { props: {} };
    }
  }

  // Method two
  if (false) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  // method 3
  if(false){
    redirect(res, 307, '/' )
  }
}

const V1RedirectTest: NextPageWithLayout = () => {
  const { toast } = useToast();

  return (
    <>
      <div className="m-32 flex flex-col gap-6 p-14"></div>
    </>
  );
};

// layout function
V1RedirectTest.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1RedirectTest;
