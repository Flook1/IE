import { api } from "@/src/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  zResetPassForm,
  type tResetPassForm,
  type tErrAuth,
  objErrAuth,
} from "@/src/1/auth/login/types";
import { DevTool } from "@hookform/devtools";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/router";
import { objUrl } from "@/src/1/gen/types/urls";
import { type NextPage } from "next";
import { useEffect, type ReactElement } from "react";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type NextPageWithLayout } from "@/src/pages/_app";
import LayAuth from "@/src/components/layouts/LayAuth";

/* -------------------------------------------------------------------------- */
const EmailVerify: NextPageWithLayout = () => {
  const router = useRouter();
  const toast = useToast();
  const emailToken = router.query.id;

  const mutateResetPass = api.authMain.emailVerify.useMutation({
    onError: (error) => {
      let errRun = false;

      // error.message as tErrAuth;
      if (error.message == objErrAuth.EmailToken) {
        // this error is if the email token isnt valid
        errRun = true;
        if (true) {
          toast.toast({ variant: "destructive", title: error.message });
        }
      }

      if (error.message == objErrAuth.EmailVerified) {
        // already verified.
        // Okay no major issue
        errRun = true;
        if (true) {
          toast.toast({ variant: "default", title: error.message });
        }
      }

      if (errRun == false) {
        // Handle other errors
        console.log(error.message);
        console.log(error.data?.code);
        toast.toast({
          variant: "destructive",
          title: "Unhandled Error",
          description: "Contact Image Edits Team",
        });
      }
    },
    onSuccess: (data) => {
      console.log(data);
      toast.toast({
        title: "Thank you",
        description: "Email Has Been Verified. You can now leave this page. ",
      });
    },
  });

  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    // trigger on page load
    if (!emailToken) {
      toast.toast({
        variant: "destructive",
        title: "No Token In Url",
        description: "Contact Image Edits for help",
      });
    }

    console.log(emailToken);
    mutateResetPass.mutate({ verifyToken: emailToken as string });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            <div className="mb-2 flex">
              Verifying Email
              <Smile size={24} strokeWidth={2} className="ms-2" />
            </div>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
        <CardFooter className="mt-4 flex-col ">
          {/* go to dashboard if logged in */}
          <Button>
            <Link href={objUrl.v1.report.dash.url}>Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

EmailVerify.getLayout = function getLayout(page: ReactElement) {
  return <LayAuth>{page}</LayAuth>;
};

export default EmailVerify;
