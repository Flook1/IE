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
import { IeCard } from "@/components/ie/ie-card";

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
        {/* todo put in the dashboard section */}
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3">
          <IeCard variant={"default"} shadow={"out"} className="p-4">
              <div className="flex min-h-fit justify-between  align-baseline border-b-2 border-zinc-200">
                <p className="text-base font-medium ie-line-height-1">Main Header</p>
                <p className="text-sm font-medium ie-line-height-1">Sub Header</p>
              </div>
          </IeCard>

        </div>
      <div>
        <p className="w-14">testing</p>
        <DebugView
          visible={true}
          header="DashStats Testing"
          content={dashStats}
        ></DebugView>
      </div>
    </>
  );
};

Dash.getLayout = function getLayout(page: ReactElement) {
  return <LayMain>{page}</LayMain>;
};

export default Dash;
