import { api } from "@/src/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, type ReactElement, useState } from "react";
import { type NextPageWithLayout } from "@/src/pages/_app";
import LayMain from "@/src/1/gen/layouts/LayMain";
import DebugView from "@/src/1/test/debug-view";
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
import { Loader2 } from "lucide-react";
import { IeHeader } from "@/src/1/gen/components/ieHeader";

/* -------------------------------------------------------------------------- */
const AdminFunc: NextPageWithLayout = () => {
  const router = useRouter();
  const toast = useToast();

  const [diaOpen, diaOpenSet] = useState(false)

  const updateUrls = api.adminFunc.updateUrl.useMutation({
    onSuccess: (date) => {
      // collapse the dialog
      diaOpenSet(!diaOpen)
    },
  });

  return (
    <>
      <div>
        <IeHeader
          header="Admin Function for WebApp"
          description="These are functions that will change a lot of data on backend for the webapp. these should be used carefully and only by admin generally."
        ></IeHeader>
      </div>
      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3">
        {/* run onetime functions */}
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
                <Dialog open={diaOpen} onOpenChange={diaOpenSet}>
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
                        disabled={updateUrls.isLoading}
                        onClick={() => updateUrls.mutate()}
                      >
                        {updateUrls.isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                        )}
                        Trigger Request
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </IeCard>
          </CardContent>
        </IeCard>
      </div>
      <IeCard variant={"test"}>
        <p className="w-14">testing</p>
        <DebugView
          visible={false}
          header="something"
          content={"something"}
        ></DebugView>
      </IeCard>
    </>
  );
};

AdminFunc.getLayout = function getLayout(page: ReactElement) {
  return <LayMain>{page}</LayMain>;
};

export default AdminFunc;
