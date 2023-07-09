import React, { type ReactElement, useEffect, useState } from "react";
import LayTest from "@/src/1/gen/layouts/LayTest";
import type { NextPageWithLayout } from "@/src/pages/_app";
import { useToast } from "@/components/ui/use-toast";
import {
  IeCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ie/ie-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const V1Ui: NextPageWithLayout = () => {
  const { toast } = useToast();

  /* -------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------- */
  // this is example of opening dialog manually with state
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="m-32 flex flex-col gap-6 p-14">
        <p>{open ? "true" : "false"}</p>
        <Button onClick={() => setOpen(true)}>Open Dialog Manual</Button>
        <IeCard>
          <CardHeader>
            <CardTitle>Functions for Web app</CardTitle>
            <CardDescription>
              CAREFUl, these are functions that are generally going to affect
              app wide data.{" "}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IeCard variant={"default"} shadow={"in"} className="p-2">
              <div className="flex flex-col gap-2">
                <p className="text-center">Updated url to object url values</p>
                <Dialog open={open} onOpenChange={setOpen}>
                  <Button asChild size={"sm"} className="mx-8">
                    <DialogTrigger>Update</DialogTrigger>
                  </Button>
                  <DialogContent>
                    <DialogHeader>Confirmation</DialogHeader>
                    <DialogDescription>
                      Are you sure you want to process this request?
                    </DialogDescription>
                    <DialogFooter>
                      <Button asChild className="mx-8">
                        <DialogTrigger>Close</DialogTrigger>
                      </Button>
                      <Button
                        variant={"destructive"}
                        type="button"
                        onClick={() => setOpen(false)}
                      >
                        CLOSE DIALOG
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </IeCard>
          </CardContent>
        </IeCard>
      </div>
    </>
  );
};

// layout function
V1Ui.getLayout = function getLayout(page: ReactElement) {
  return <LayTest>{page}</LayTest>;
};

export default V1Ui;
