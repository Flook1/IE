import { objUrl } from "@/src/1/gen/types/urls";
import { api } from "@/src/utils/api";
import { useRouter } from "next/router";

export type NextPageLayoutProps = {
  children: React.ReactNode;
};

// This is for the auth pages

export const LayAuth = ({ children }: NextPageLayoutProps) => {
  const router = useRouter();

  const authSesDel = api.authCheck.sesDel.useMutation(undefined);


  const authSesValid = api.authCheck.sesCheck.useQuery(
    { verify: true },
    {
      enabled: false,
      onError: (error) => {
        // console.log("authSesValid: error");
        // console.log(error);

        // redirect to auth
        authSesDel.mutate(undefined, {
          onError: (error) => {
            // needs to show a toast.
            console.log("error with mutation to del ses");
          },
          onSuccess: (data) => {
            void router.push(objUrl.v1.auth.login.url);
          },
        });
      },
      onSuccess: (data) => {
        // console.log("authSesValid: success");
        // console.log(data);
        // dont really need to do anything
      },
    }
  );

  return (
    <>
      <div className="flex h-screen bg-background">
        <p>Thi is the main layout section</p>
        <br />
        {children}
      </div>
    </>
  );
};

export default LayAuth;
