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
import { roleCheck } from "@/src/1/auth/utils-server/access";
import { type ctxSes } from "@/src/server/api/trpc";

/* -------------------------------------------------------------------------- */
// server side props

export async function getServerSideProps(ctx:ctxSes) {
  if (true) {
    const roleVerified = await roleCheck(
      ctx,
      ctx.ses.sesJson,
      true,
      "ie_admin",
      "redirect"
    );

    if (roleVerified.redirect?.destination) {
      return roleVerified;
    } else if (!roleVerified.success) {
      return {
        redirect: {
          destination: "/",
          permanent: true,
        },
      };
    }
  }
}

/* -------------------------------------------------------------------------- */
const UserAuth: NextPageWithLayout = () => {
  // this is used to log into other accounts
  // todo

  const router = useRouter();
  const toast = useToast();

  const [diaOpen, diaOpenSet] = useState(false);

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
          visible={false}
          header="userDataTable"
          content={"something"}
        ></DebugView>
      </IeCard>
    </>
  );
};

UserAuth.getLayout = function getLayout(page: ReactElement) {
  return <LayMain>{page}</LayMain>;
};

export default UserAuth;
