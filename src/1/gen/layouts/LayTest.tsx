import { Button } from "@/components/ui/button";
import { objUrl } from "@/src/1/gen/types/urls";
import { api } from "@/src/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";

export type NextPageLayoutProps = {
  children: React.ReactNode;
};

export const LayTest = ({ children }: NextPageLayoutProps) => {
  const router = useRouter();

  const testIsEnv = api.genMain.isEnv.useQuery(
    { envSel: "my", envType: "development" },
    {
      enabled: true,
      onSuccess: (data) => {
        if (!data.isAllowed) {
          // if (false) {
          // if (!data) {
          void router.push(objUrl.gen.notFound.url);
        }
      },
    }
  );

  return (
    <>
      <div>
        Test navigation
        <div className="grid grid-cols-8  gap-4 border-slate-200 ">
          <Button asChild>
            <Link href={objUrl.testing.dates.url}>Dates</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.cookie.url}>Cookie</Link>
          </Button>
          {/* <Button asChild> */}
          {/* <Link href={objUrl.testing.auth.url}>auth</Link> */}
          {/* </Button> */}
          <Button asChild>
            <Link href={objUrl.testing.testing.url}>testing</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.ses.url}>ses</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.ui.url}>Ui Basic</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.uiDialog.url}>Ui Dialog</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.url.url}>Url Params</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.queries.url}>Queries</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.genBasics.url}>Gen Basic Func</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.arrObj.url}>Arr Obj</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.zod.url}>zod</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.theme.url}>theme</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.redirect.url}>redirect test</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.spread.url}>spread</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.typeInfer.url}>Type Infer</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.stateBasic.url}>State Basic</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.stateQuery.url}>State Query</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.queryParams.url}>Query Params</Link>
          </Button>
          <Button asChild>
            <Link href={objUrl.testing.stateZust.url}>State Zust</Link>
          </Button>

        </div>
      </div>
      <div className="bg-base-200 container ">{children}</div>
    </>
  );
};

export default LayTest;
