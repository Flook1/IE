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
import { DashListSmall, DashSec } from "@/src/1/report/component/dashSec";
import { diffCalc } from "@/src/1/gen/utils/genFinancialFunc";
import { IeHeader } from "@/src/1/gen/components/ieHeader";

/* -------------------------------------------------------------------------- */
const Dash: NextPageWithLayout = () => {
  const router = useRouter();
  const toast = useToast();

  const dashStats = api.genDash.dashContent.useQuery(undefined, {
    enabled: true,
    retry: false,
    ...cache20Min,
  });

  const { data, isLoading } = dashStats;

  return (
    <>
      <div>
        <IeHeader
          header="Admin Dashboard"
          description="Generally reporting information. This is for Admin of Image Edits."
        ></IeHeader>
      </div>
      {/* todo put in the dashboard section */}
      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3">
        <IeCard variant={"default"} shadow={"out"} className="p-6">
          {/* all time rev */}
          <DashSec
            isLoading={isLoading}
            visible={true}
            headLeft="Total Rev"
            headRight="All Time | USD"
            content={dashStats.data?.totalRevAllTime.gross.toLocaleString(
              "en-CA",
              {
                style: "currency",
                currency: "USD",
              }
            )}
            botLeft=""
            botLeft2=""
            botRight=""
          ></DashSec>
        </IeCard>

        <IeCard variant={"default"} shadow={"out"} className="p-6">
          <DashListSmall
          visible
          headLeft="Order Status"
          headRight="Current"
          content1={"something"}
          content2="Something"
          content3="Something"
          content4="Something"
          isLoading={false}
          >
          </DashListSmall>
        </IeCard>
        <IeCard variant={"default"} shadow={"out"} className="p-6">
          <p>will pit sub menu here</p>
        </IeCard>

        <IeCard variant={"default"} shadow={"out"} className="p-6">
          <DashSec
            isLoading={isLoading}
            visible={true}
            headLeft="Profit"
            headRight="This Month | USD"
            content={dashStats.data?.totalRevThisMonth.netProfitUsd.toLocaleString(
              "en-CA",
              {
                style: "currency",
                currency: "USD",
              }
            )}
            botLeft="Last Month: "
            botLeft2={dashStats.data?.totalRevLastMonth.netProfitUsd.toLocaleString(
              "en-CA",
              {
                style: "currency",
                currency: "USD",
              }
            )}
            botRight={
              diffCalc(
                true,
                dashStats.data?.totalRevThisMonth.netProfitUsd,
                dashStats.data?.totalRevLastMonth.netProfitUsd
              ) as string
            }
          ></DashSec>
        </IeCard>
        <IeCard variant={"default"} shadow={"out"} className="p-6">
          <DashSec
            isLoading={isLoading}
            visible={true}
            headLeft="Revenue"
            headRight="This Month | USD"
            content={dashStats.data?.totalRevThisMonth.grossUsd.toLocaleString(
              "en-CA",
              {
                style: "currency",
                currency: "USD",
              }
            )}
            botLeft="Last Month:"
            botLeft2={dashStats.data?.totalRevLastMonth.grossUsd.toLocaleString(
              "en-CA",
              {
                style: "currency",
                currency: "USD",
              }
            )}
            botRight={
              diffCalc(
                true,
                dashStats.data?.totalRevThisMonth.grossUsd,
                dashStats.data?.totalRevLastMonth.grossUsd
              ) as string
            }
          ></DashSec>
        </IeCard>
        <IeCard variant={"default"} shadow={"out"} className="p-6">
          <DashSec
            isLoading={isLoading}
            visible={true}
            headLeft="Expense"
            headRight="This Month | USD"
            content={dashStats.data?.totalRevThisMonth.editorBusTotalUsd.toLocaleString(
              "en-CA",
              {
                style: "currency",
                currency: "USD",
              }
            )}
            botLeft="Last Month: "
            botLeft2={dashStats.data?.totalRevLastMonth.editorBusTotalUsd.toLocaleString(
              "en-CA",
              {
                style: "currency",
                currency: "USD",
              }
            )}
            botRight={
              diffCalc(
                true,
                dashStats.data?.totalRevThisMonth.editorBusTotalUsd,
                dashStats.data?.totalRevLastMonth.editorBusTotalUsd
              ) as string
            }
          ></DashSec>
        </IeCard>
        <IeCard variant={"default"} shadow={"out"} className="p-6">
          <DashSec
            isLoading={isLoading}
            visible={true}
            headLeft="Margin"
            headRight="This Month"
            content={`${
              dashStats.data?.totalRevThisMonth.ieMargin.toFixed(2) as string
            } %`}
            botLeft="Last Month: "
            botLeft2={`${
              dashStats.data?.totalRevLastMonth.ieMargin.toFixed(2) as string
            } %`}
            botRight={
              diffCalc(
                true,
                dashStats.data?.totalRevThisMonth.ieMargin,
                dashStats.data?.totalRevLastMonth.ieMargin
              ) as string
            }
          ></DashSec>
        </IeCard>
      </div>
      <IeCard variant={"test"}>
        <p className="w-14">testing</p>
        <DebugView
          visible={true}
          header="DashStats Testing"
          content={dashStats}
        ></DebugView>
      </IeCard>
    </>
  );
};

Dash.getLayout = function getLayout(page: ReactElement) {
  return <LayMain>{page}</LayMain>;
};

export default Dash;
