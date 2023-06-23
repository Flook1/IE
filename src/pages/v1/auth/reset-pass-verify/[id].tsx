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
  zResetPassUpdate,
  type tResetPassUpdate,
  objErrAuth,
} from "@/src/1/auth/login/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DevTool } from "@hookform/devtools";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/router";
import { objUrl } from "@/src/1/gen/types/urls";
import { type NextPage } from "next";
import { useEffect, type ReactElement, useState } from "react";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type NextPageWithLayout } from "@/src/pages/_app";
import LayAuth from "@/src/components/layouts/LayAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

/* -------------------------------------------------------------------------- */
const ResetPassVerify: NextPageWithLayout = () => {
  const router = useRouter();
  const toast = useToast();
  const resetToken = router.query.id as string;
  const [showRedirect, setShowRedirect] = useState(false);



  const mutateResetPass = api.authReset.resetPassUpdate.useMutation({
    onError: (error) => {
      let errRun = false;
      setShowRedirect(true);

      if (!!error.data?.zodError) {
        // means there is a zod error
        errRun = true;
        toast.toast({
          variant: "destructive",
          title: "Input Error",
          description: "Please Contact Image Edits Team",
        });
      }

      if (error.message == objErrAuth.PassDontMatch) {
        errRun = true;
        if (true) {
          toast.toast({ variant: "destructive", title: error.message });
        }
      }

      if (error.message == objErrAuth.ResetToken) {
        // this error is if the token isn't valid
        errRun = true;
        if (true) {
          toast.toast({ variant: "destructive", title: error.message });
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

      // console.log(data);
      toast.toast({
        title: "Password Reset",
        description: "Will Redirect to Login Page for you to login.",
      });

        resetPassUpdate.reset()

      // redirect
      void router.push(objUrl.v1.auth.login.url);
    },
  });

  const resetPassUpdate = useForm<tResetPassUpdate>({
    resolver: zodResolver(zResetPassUpdate),
    defaultValues: {
      password: "",
      passwordConfirm: "",
      // passwordToken: "7f38e942-11bb-11ee-be56-0242ac120002",
      // passwordToken: "1dd55476-00f2-4779-881d-07a38c3d31c0",
      passwordToken: resetToken,
    },
  });

  /* -------------------------------------------------------------------------- */

  const onSubmit = (values: tResetPassUpdate) => {
    // console.log(values);

    values.passwordToken = resetToken;
    // trigger password reset api
    mutateResetPass.mutate(values)
  };

  return (
    <div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            <div className="mb-2 flex">
              Lets Reset Your Password
              <Key size={24} strokeWidth={2} className="ms-2" />
            </div>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <hr />
        <Form {...resetPassUpdate}>
          {/* <form onSubmit={(e) => void resetPassForm.handleSubmit(onSubmit)(e)}> */}
          <form onSubmit={(e) => void resetPassUpdate.handleSubmit(onSubmit)(e)}>
            <CardContent>
              <FormField
                // password
                control={resetPassUpdate.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // Confirm
                control={resetPassUpdate.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field}  />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // token
                control={resetPassUpdate.control}
                name="passwordToken"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormLabel>Reset Token</FormLabel>
                    <FormControl>
                      <Input type="text" value={resetToken}  name={field.name} onBlur={field.onBlur} onChange={field.onChange} ref={field.ref} />
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
                <Button variant="default" type="submit">
                  Reset Password
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

ResetPassVerify.getLayout = function getLayout(page: ReactElement) {
  return <LayAuth>{page}</LayAuth>;
};

export default ResetPassVerify;
