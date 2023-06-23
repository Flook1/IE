import { useToast } from "@/components/ui/use-toast";
import { objUrl } from "@/src/1/gen/types/urls";
import { api } from "@/src/utils/api";
import { useRouter } from "next/router";

export type NextPageLayoutProps = {
  children: React.ReactNode;
};

// This is for the auth pages

export const LayAuth = ({ children }: NextPageLayoutProps) => {
  const router = useRouter();
  const {toast} = useToast()

  const authSesValid = api.authCheck.sesCheck.useQuery({verify:true}, {
    enabled: true,
    onError: (error) => {
      // dont need to do anything
    },
    onSuccess: (data) => {
      // this means valid ses, so cant be on auth pages
      // console.log("redirecting to dashboard")
      // toast({title: "Redirecting to Dashboard"})

      void router.push(objUrl.v1.report.dash.url)
    }
  })


  return (
    <>
      <div className="flex h-screen bg-background">
        <div className="flex flex-auto items-center justify-center">
          <div className="container max-w-screen-sm  border border-red-200 py-2 ">
            {children}
          </div>
        </div>
        <div className="flex flex-initial grow items-center justify-center  bg-zinc-300">
          <div className="container max-w-screen-lg bg-zinc-100">Image Here</div>
        </div>
      </div>
    </>
  );
};

export default LayAuth;
