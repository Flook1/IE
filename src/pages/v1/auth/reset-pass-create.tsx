import { api } from "@/src/utils/api";
import { LayAuth } from "@/src/components/layouts/LayAuth";
import type { ReactElement, ReactHTMLElement } from "react";
import { type NextPageWithLayout } from "../../_app";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-context-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Smile } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

/* -------------------------------------------------------------------------- */
const ResetPass: NextPageWithLayout = () => {
  const router = useRouter();
  const toast = useToast();

  const mutateResetPass = api.authReset.resetPassCreate.useMutation({
    onError: (error) => {
      let errRun = false;

      error.message as tErrAuth;
      if (error.message == objErrAuth.PassDontMatch) {
        errRun = true;
        if (true) {
          toast.toast({ variant: "destructive", title: error.message });
        }
      }

      // cant find email error
      if (error.message == objErrAuth.Creds) {
        console.log("cant find user in database, contact ie");
        errRun = true;
        if (true) {
          toast.toast({ variant: "destructive", title: error.message });
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
      if (true) {
        console.log(data);
        toast.toast({ title: "Password Reset Email Sent" });
      }

      // reset form
      resetPassForm.reset();
    },
  });

  const resetPassForm = useForm<tResetPassForm>({
    resolver: zodResolver(zResetPassForm),
    defaultValues: {
      email: "",
    },
  });

  /* -------------------------------------------------------------------------- */
  const onSubmit = (values: tResetPassForm) => {
    // do something
    console.log("on submit handler run, for pass reset create form");
    console.log(values);
    // trigger mutation
    mutateResetPass.mutate(values);
  };

  return (
    <div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            <div className="flex mb-2">
              Request Password Reset Link
              {/* <Smile size={24} strokeWidth={2} className="ms-2" /> */}
            </div>
          </CardTitle>
          <CardDescription>
            This password reset link will be sent to your email. <br />
            <span className="font-bold">Please Check SPAM</span>
          </CardDescription>
        </CardHeader>
        <hr />
        <Form {...resetPassForm}>
          <form onSubmit={(e) => void resetPassForm.handleSubmit(onSubmit)(e)}>
            <CardContent>
              {/* form section */}
              <FormField
                // EMAIL
                control={resetPassForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <hr />
            <CardFooter className="mt-4 flex-col ">
              <div className="flex w-full items-center justify-center gap-10">
                {/* footer buttons */}
                <Button variant="default" type="submit">
                  Reset Password
                </Button>
              </div>
              <hr />
              <div className="mt-2">

                {/* sec nav */}
                <Button variant="link">
                  <Link href={objUrl.v1.auth.signUp.url}>Sign Up</Link>
                </Button>
                <Button variant="link">
                  <Link href={objUrl.v1.auth.login.url}>Login</Link>
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {true && (
        <div>
          <p>mutation info</p>
          <br />
          <p>{JSON.stringify(mutateResetPass.data)}</p>
          <br />
          {/* error */}
          <p>{mutateResetPass.error?.message}</p>
        </div>
      )}

      {true && (
        <div>
          <Separator></Separator>
          <DevTool control={resetPassForm.control} />
        </div>
      )}
    </div>
  );
};

// layout
ResetPass.getLayout = function getLayout(page: ReactElement) {
  return <LayAuth>{page}</LayAuth>;
};

export default ResetPass;
