import {type  ReactElement, useEffect, useState } from "react";
import LayTest from "@/src/components/layouts/LayTest";
import type { NextPageWithLayout } from "@/src/pages/_app";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";


const V1Ui: NextPageWithLayout = () => {
  const {toast} = useToast()

 const handleToast = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  e.stopPropagation()
  console.log('toast button run')

  // trigger toast
  toast({title: "toast something", description: "this is the description"})
 }


  return (
    <>
      <div className="flex m-32 p-14 gap-6">
          <Button onClick={(e) => handleToast(e)}>
            Toast Handler Function
          </Button>
          <Button onClick={() => toast({title: "direct function", description:"some information here"})}>
            Toast Direct Function
          </Button>
      </div>
    </>
  );
};

// layout function
V1Ui.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1Ui;
