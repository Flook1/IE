import { api } from "@/src/utils/api";
import { DevTool } from "@hookform/devtools";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/router";
import { objUrl } from "@/src/1/gen/types/urls";
import { type NextPage } from "next";
import { useEffect, type ReactElement, useState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type NextPageWithLayout } from "@/src/pages/_app";
import LayMain from "@/src/components/layouts/LayMain";
import { cache20Min } from "@/src/1/gen/utils/genQueryCache";
import DebugView from "@/src/components/test/debug-view";

/* -------------------------------------------------------------------------- */
const Dash: NextPageWithLayout = () => {
  const router = useRouter();
  const toast = useToast();

  const dashStats = api.genDash.dashContent.useQuery(undefined, {
    enabled: true,
    retry: false,
    ...cache20Min,
  });

  return (
    <>
      <p className="w-14">testing</p>
      <DebugView
        visible={true}
        header="DashStats Testing"
        content={dashStats}
      ></DebugView>
      {/* todo put in the dashboard section */}
    </>
  );
};

Dash.getLayout = function getLayout(page: ReactElement) {
  return <LayMain>{page}</LayMain>;
};

export default Dash;
