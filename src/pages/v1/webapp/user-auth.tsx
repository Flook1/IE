import { api } from "@/src/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, type ReactElement, useState } from "react";
import { type NextPageWithLayout } from "@/src/pages/_app";
import LayMain from "@/src/components/layouts/LayMain";
import DebugView from "@/src/components/test/debug-view";
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
import { type NextApiResponse } from "next";
import { roleCheck, serPropsRoleCheck } from "@/src/1/auth/utils-server/access";
import { type ctxMain, type ctxSes } from "@/src/server/api/trpc";
import {
  sesGet,
  type tSesFull,
  type tSesJson,
} from "@/src/1/auth/utils-server/ses";
import { TRPCError } from "@trpc/server";

/* -------------------------------------------------------------------------- */
// server side props

export async function getServerSideProps(ctx: ctxMain) {
  if (true) {
    const func = await serPropsRoleCheck(ctx, "ie_admin");

    if (func?.redirect) {
      return func;
    }
  }

  return { props: {} };
}

/* -------------------------------------------------------------------------- */
const UserAuth: NextPageWithLayout =  () => {
  // this is used to log into other accounts
  // todo

  const router = useRouter();
  const toast = useToast();

  const [diaOpen, diaOpenSet] = useState(false);

  const userList = api.userBasic.userList.useQuery(undefined, {
    enabled: true,
  })


  return (
    <>
      <div>
        <IeHeader
          header="Admin Log Into Other Accounts"
          description="This section is to allow only Image Edits Admin to log into other accounts, make sure they are okay and help out in any way."
        ></IeHeader>
      </div>
      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3"></div>
      <IeCard variant={"test"}>
        <p className="w-14">Testing</p>
        <DebugView
          visible={true}
          header="userDataTable"
          content={userList.data}
        ></DebugView>
      </IeCard>
    </>
  );
};

UserAuth.getLayout = function getLayout(page: ReactElement) {
  return <LayMain>{page}</LayMain>;
};

export default UserAuth;
