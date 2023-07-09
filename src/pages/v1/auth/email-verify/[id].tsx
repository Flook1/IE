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
import { useEffect, type ReactElement, useState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type NextPageWithLayout } from "@/src/pages/_app";
import LayAuth from "@/src/1/gen/layouts/LayAuth";

/* -------------------------------------------------------------------------- */
const EmailVerify: NextPageWithLayout = () => {
  const router = useRouter();
  const toast = useToast();
  const emailToken = router.query.id;
  const [showRedirect, setShowRedirect] = useState(false);

  const mutateEmailVerify = api.authMain.emailVerify.useMutation({
    onError: (error) => {
      let errRun = false;
      setShowRedirect(true);

      if (!!error.data?.zodError){
        // means there is a zod error
        errRun = true
        toast.toast({variant:"destructive", title: "Input Error", description: "Please Contact Image Edits Team"})
      }

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
        // console.log(error.message);
        // console.log(error.data?.code);
        toast.toast({
          variant: "destructive",
          title: "Unhandled Error",
          description: "Contact Image Edits Team",
        });
      }

    },
    onSuccess: (data) => {
      setShowRedirect(true);
      console.log(`showRedirect boolean ${showRedirect.toString()}`)

      // console.log(data);
      toast.toast({
        title: "Thank you",
        description: "Email Has Been Verified. You can now leave this page. ",
      });

    },
  });

  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    // trigger on page load
    console.log(emailToken);

    if (!emailToken || emailToken == undefined) {
      toast.toast({
        variant: "destructive",
        title: "No Token In Url",
        description: "Contact Image Edits for help",
      });
    } else {
      mutateEmailVerify.mutate({ verifyToken: emailToken as string });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailToken]);

  return (
    <div>
      {false && (
        <div>
          <p>Test Section</p>
          <p>countOfUseAffect</p>
        </div>
      )}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            <div className="mb-2 flex">
              Verifying Your Email Address
              <MailCheck size={24} strokeWidth={2} className="ms-2" />
            </div>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="mt-4 flex-col ">
          {!!showRedirect && (
            // redirect to dashboard
            <Button>
              <Link href={objUrl.v1.report.dash.url}>Go to Dashboard</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

EmailVerify.getLayout = function getLayout(page: ReactElement) {
  return <LayAuth>{page}</LayAuth>;
};

export default EmailVerify;
