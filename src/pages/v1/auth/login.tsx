import { api } from "@/src/utils/api";
import DebugView from "@/src/components/test/debug-view";
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
  zLoginForm,
  type tLoginForm,
  type tErrAuth,
  objErrAuth,
} from "@/src/1/auth/login/types";
import { DevTool } from "@hookform/devtools";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login: NextPageWithLayout = () => {
  const toast = useToast();

  const mutationLogin = api.authMain.login.useMutation({
    onError: (error) => {
      let errRun = false;

      error.message as tErrAuth;
      // if (error.message == errType) {
      if (error.message == objErrAuth.NoPass) {
        errRun = true;
        if (true) {
          toast.toast({ variant: "destructive", title: error.message });
        }
      }

      if (error.message == objErrAuth.Creds) {
        // incorrect creds
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
        toast.toast({ title: "Logged In" });
      }
      // go to dashboard

    },
  });

  const loginForm = useForm<tLoginForm>({
    resolver: zodResolver(zLoginForm),
    defaultValues: {
      email: "haydnhinks@outlook.com",
      password: "",
    },
  });

  /* -------------------------------------------------------------------------- */
  const onSubmit = (values: tLoginForm) => {
    // do something
    console.log("on submit handler run, for login form");
    console.log(values);
    // trigger mutation
    mutationLogin.mutate(values);
  };

  return (
    <div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            <div className="flex">
              Login
              <Smile size={24} strokeWidth={2} className="ms-2" />
            </div>
          </CardTitle>
          <CardDescription>Welcome Back!</CardDescription>
        </CardHeader>
        <hr />
        <Form {...loginForm}>
          <form onSubmit={(e) => void loginForm.handleSubmit(onSubmit)(e)}>
            <CardContent>
              {/* form section */}
              <FormField
                // EMAIL
                control={loginForm.control}
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
              <FormField
                // PASSSWORD
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    {/* <FormDescription>Place your email above</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mutationLogin.error?.message == objErrAuth.Creds && (
                <div className="mt-4">
                  <Alert variant={"destructive"}>
                    <AlertTitle>
                      <h2>Incorrect Credentials</h2>
                    </AlertTitle>
                    {/* <AlertDescription><p>Try again.</p></AlertDescription> */}
                  </Alert>
                </div>
              )}
            </CardContent>
            <hr />
            <CardFooter className="mt-4 flex-col ">
              <div className="flex w-full items-center justify-center gap-10">
                {/* footer buttons */}
                <Button variant="outline"> Sign Up </Button>
                <Button variant="default" type="submit">
                  Login
                </Button>
              </div>
              <hr />
              <div>
                {/* Forgot password */}
                <Button variant="link">
                  <Link href="/something">Forgot Password</Link>
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
          <p>{JSON.stringify(mutationLogin.data)}</p>
          <br />
          {/* error */}
          <p>{mutationLogin.error?.message}</p>
        </div>
      )}

      {true && (
        <div>
          <Separator></Separator>
          <DevTool control={loginForm.control} />
        </div>
      )}
    </div>
  );
};

// layout
Login.getLayout = function getLayout(page: ReactElement) {
  return <LayAuth>{page}</LayAuth>;
};

export default Login;
