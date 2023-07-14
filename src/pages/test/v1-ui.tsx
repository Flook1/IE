import React, { type ReactElement, useEffect, useState } from "react";
import LayTest from "@/src/1/gen/layouts/LayTest";
import type { NextPageWithLayout } from "@/src/pages/_app";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  SkeletonCard,
  SkeletonImg,
  SkeletonListRow,
  SkeletonParagraph,
  SkeletonTableFull,
  SkeletonTableRow,
  SkeletonVideo,
  SkeletonWidget,
} from "@/src/1/gen/components/skeleton";
import { IeCard } from "@/components/ie/ie-card";
import { DashListSmall } from "@/src/1/report/component/dashSec";
import { IconTest } from "@/src/1/gen/components/icons/icon-dynamic-test";
import { CopyIcon, CopyText } from "@/src/1/gen/components/copy-comps";

const V1Ui: NextPageWithLayout = () => {
  const { toast } = useToast();

  const handleToast = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("toast button run");

    // trigger toast
    toast({ title: "toast something", description: "this is the description" });
  };

  const iconObjTest = ["Smile", "SmilePlus"];

  return (
    <>
      <div className="m-32 flex flex-col gap-6 p-14">
        <div>
          <p>testing copy componenet</p>
          <CopyIcon copyValue="somethingcopied" throwToast={true}></CopyIcon>
          <CopyIcon copyValue="somethingcopied" throwToast={true}></CopyIcon>
          <CopyIcon copyValue="somethingcopied" throwToast={true}></CopyIcon>
          <CopyIcon copyValue="somethingcopied" throwToast={true}></CopyIcon>
          <CopyIcon copyValue="somethingcopied" throwToast={true}></CopyIcon>
          <CopyText copyValue="somethingcopied" throwToast={true}></CopyText>
          <CopyText copyValue="somethingcopied" throwToast={true}></CopyText>
          <CopyText copyValue="somethingcopied" throwToast={true}></CopyText>
        </div>
        <IeCard hidden className="p-6">
          <DashListSmall
            visible
            headLeft="Something"
            headRight="Something"
            content1="Something: Something"
            content2="Something: Something"
            content3="Something: Something"
            content4="Something: Something"
            isLoading={false}
          ></DashListSmall>
        </IeCard>
        <div hidden>
          <Button onClick={(e) => handleToast(e)}>
            Toast Handler Function
          </Button>
          <Button
            onClick={() =>
              toast({
                title: "direct function",
                description: "some information here",
              })
            }
          >
            Toast Direct Function
          </Button>
          <div hidden>
            <IconTest icon="Smile" />
            <IconTest icon="Smile" />
            <IconTest icon="SmilePlus" />
            <IconTest icon="Smile" />
          </div>
          <div className="grid grid-cols-1  gap-10">
            {/* skeletons */}
            {/* <SkeletonCard></SkeletonCard> */}
            {/* <SkeletonImg></SkeletonImg> */}
            {/* <SkeletonWidget></SkeletonWidget> */}
            {/* <SkeletonListRow></SkeletonListRow> */}
            {/* <SkeletonTableRow></SkeletonTableRow> */}
            <SkeletonTableFull></SkeletonTableFull>
            {/* <SkeletonVideo></SkeletonVideo> */}
            {/* <SkeletonParagraph></SkeletonParagraph> */}
          </div>
        </div>
      </div>
    </>
  );
};

// layout function
V1Ui.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1Ui;
