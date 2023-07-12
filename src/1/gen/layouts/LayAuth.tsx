import { useToast } from "@/components/ui/use-toast";
import { objUrl } from "@/src/1/gen/types/urls";
import { urlRemoveEnd } from "@/src/1/gen/utils/urlFormat";
import { api } from "@/src/utils/api";
import { useRouter } from "next/router";

export type NextPageLayoutProps = {
  children: React.ReactNode;
};

// This is for the auth pages

export const LayAuth = ({ children }: NextPageLayoutProps) => {
  const router = useRouter();
  const {toast} = useToast()

  const authSesValid = api.authCheck.sesCheck.useQuery({verify:true, throwErr: false}, {
    enabled: true,
    onError: (error) => {
      // dont need to do anything
    },
    onSuccess: (data) => {
      if (data.sesSuccess) {
        // this means valid ses, so cant be on auth pages
        const isPassCreate = objUrl.v1.auth.resetPassCreate.url !=  urlRemoveEnd(router.route)
        const isPassVerify = objUrl.v1.auth.resetPassVerify.url !=  urlRemoveEnd(router.route)
        const isEmailVerify = objUrl.v1.auth.emailVerify.url != urlRemoveEnd(router.route)

        if (isPassCreate && isPassVerify && isEmailVerify ){
          // console.log("running redirect")
          void router.push(objUrl.v1.report.dash.url)
        }
      } else {
        // means no ses token, dont need to do anything
      }


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