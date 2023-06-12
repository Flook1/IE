import { Button } from "@/components/ui/button";
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
          // will redirect here:
          void router.push("/404");
        }
      },
    }
  );

  return (
    <>
      <div>
        Test navigation
        <div className="flex gap-x-4 border-slate-200 ">
          <Button asChild>
            <Link href="/test/v1-dates">Dates</Link>
          </Button>
          <Button asChild>
            <Link href="/test/v1-cookie">Cookie</Link>
          </Button>
          <Button asChild>
            <Link href="/test/v1-auth">auth</Link>
          </Button>
          <Button asChild>
            <Link href="/test/v1-testing">testing</Link>
          </Button>
          <Button asChild>
            <Link href="/test/v1-ses">ses</Link>
          </Button>
          <Button asChild>
            <Link href="/test/v1-ui">Ui Stuff</Link>
          </Button>
        </div>
      </div>
      <div className="container bg-base-200 ">{children}</div>
    </>
  );
};

export default LayTest;
