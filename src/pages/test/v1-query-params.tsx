import { type ReactElement, useEffect, useState } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import type { NextPageWithLayout } from "@/src/pages/_app";
import { TestStateCompQuery } from "@/src/components/test/state-test-comp-query";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

const V1QueryParams: NextPageWithLayout = () => {
  const router = useRouter();
  const {query} = router

  const updateQueryParams = () => {
    const routerChange = router.replace({
      pathname: router.pathname,
      query: { param1: 'new_value1', param2: 'new_value2' },
    });
  };

  return (
    <div className="my-8">
      <div>
        <p>Query Params: </p>
        <p>{JSON.stringify(query, null, ' ')}</p>
      </div>

      <Button onClick={(e) => updateQueryParams()}>Update Query Params</Button>
    </div>
  );
};

// layout function
V1QueryParams.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1QueryParams;
