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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Loader2, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  zSignUpForm,
  type tErrAuth,
  objErrAuth,
  type tSignUpForm,
} from "@/src/1/auth/login/types";
import { DevTool } from "@hookform/devtools";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/router";
import { objUrl } from "@/src/1/gen/types/urls";

const Login: NextPageWithLayout = () => {
  const router = useRouter();
  const toast = useToast();

  const basicContent = api.genMain.basicContent.useQuery(undefined, {
    enabled: true,
    cacheTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const mutationSignUp = api.authSignUp.signUp.useMutation({
    onError: (error) => {
      let errRun = false;

      if (error.message == objErrAuth.EmailUsed) {
        errRun = true;
        toast.toast({
          variant: "destructive",
          title: error.message,
          description: "Try again with a different email",
        });
      }

      if (error.message == objErrAuth.PassDontMatch) {
        errRun = true;
        toast.toast({ variant: "destructive", title: error.message });
      }

      if (error.message == objErrAuth.RoleIdMismatch) {
        errRun = true;
        toast.toast({
          variant: "destructive",
          title: error.message,
          description: "Contact Image Edits",
        });
      }

      if (error.message == objErrAuth.CurrMissing) {
        errRun = true;
        toast.toast({
          variant: "destructive",
          title: error.message,
          description: "Contact Image Edits",
        });
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
        toast.toast({
          title: "Signed Up",
          description: "Will redirect in 2 seconds.",
        });
      }
      signUpForm.reset();

      // go to dashboard
      // setTimeout(() => {
      // void router.push(objUrl.v1.report.dash.url);
      // }, 2000);
    },
  });

  const signUpForm = useForm<tSignUpForm>({
    resolver: zodResolver(zSignUpForm),
    defaultValues: {
      email: "",
      nameFirst: "",
      nameLast: "",
      password: "",
      passwordConfirm: "",
      busName: "",
      busType: "client",
      clientType: undefined,
      curr: "USD",
      payType: "advance",
    },
  });

  /* -------------------------------------------------------------------------- */
  const onSubmit = (values: tSignUpForm) => {
    console.log(values);

    if (signUpForm.getValues("busType") == "editor") {
      // if this is true, we will set defaults for editor team
      values.curr = "USD";
      values.payType = "monthly";
      values.clientType = undefined;
    }

    // console.log(values)

    // trigger mutation
    mutationSignUp.mutate(values);
  };

  return (
    <div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            <div className="flex">
              Sign Up
              <User size={24} strokeWidth={2} className="ms-2" />
            </div>
          </CardTitle>
          <CardDescription>
            Welcome to Image Edits! Any issues, we are here to help.
          </CardDescription>
        </CardHeader>
        <hr />
        <Form {...signUpForm}>
          <form onSubmit={(e) => void signUpForm.handleSubmit(onSubmit)(e)}>
            <CardContent>
              <div className="flex flex-row justify-between">
                <FormField
                  control={signUpForm.control}
                  name="nameFirst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  // Last Name
                  control={signUpForm.control}
                  name="nameLast"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                // EMAIL
                control={signUpForm.control}
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
              <div className="flex flex-row justify-between">
                <FormField
                  // PASSSWORD
                  control={signUpForm.control}
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
                <FormField
                  control={signUpForm.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      {/* <FormDescription>Place your email above</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {mutationSignUp.error?.message == objErrAuth.PassDontMatch && (
                <div className="mt-4">
                  <Alert variant={"destructive"}>
                    <AlertTitle>
                      <h2>Passwords Dont Match</h2>
                    </AlertTitle>
                    <AlertDescription>
                      <p>Make Passwords Match and Try Again.</p>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <div className="flex flex-row justify-between">
                {/* business type */}
                <FormField
                  control={signUpForm.control}
                  name="busType"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Business Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Business Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="client">
                            Photographer | Agent
                          </SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* <FormDescription>Place your email above</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="curr"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Currency Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {signUpForm.getValues("busType") == "client" &&
                            basicContent.data?.currAll.map((item, index) => (
                              <SelectItem
                                key={item.id}
                                value={item.currency_code}
                              >
                                {item.currency_symbol} | {item.currency_name}
                              </SelectItem>
                            ))}
                          {signUpForm.getValues("busType") == "editor" &&
                            basicContent.data?.currAll
                              .filter((curr) => curr.currency_code == "USD")
                              .map((item, index) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.currency_code}
                                >
                                  {item.currency_symbol} | {item.currency_name}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                      {/* <FormDescription>Place your email above</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={signUpForm.control}
                name="busName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {signUpForm.getValues("busType") == "client" && (
                <div className="flex flex-row justify-between">
                  <FormField
                    control={signUpForm.control}
                    name="clientType"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Client Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="photographer">
                              Photographer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {/* <FormDescription>Place your email above</FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="payType"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Payment Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="advance">
                              Advance | Per Order
                            </SelectItem>
                            <SelectItem value="monthly">
                              Monthly Invoicing
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {/* <FormDescription>Place your email above</FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
            <hr />
            <CardFooter className="mt-4 flex-col ">
              <div className="flex w-full items-center justify-center gap-10">
                {/* footer buttons */}
                <Button variant="outline" disabled={mutationSignUp.isLoading}>
                  <Link href={objUrl.v1.auth.login.url}>Login</Link>
                </Button>
                <Button variant="default" type="submit" disabled={mutationSignUp.isLoading}>
                  {mutationSignUp.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                  )}
                  Sign Up
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
          <p>{JSON.stringify(mutationSignUp.data)}</p>
          <br />
          {/* error */}
          <p>{mutationSignUp.error?.message}</p>
        </div>
      )}

      {true && (
        <div>
          <Separator></Separator>
          <DevTool control={signUpForm.control} />
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
