import Link from "next/link";



export type NextPageLayoutProps = {
  children: React.ReactNode;
};

export const LayTest = ({ children }: NextPageLayoutProps) => {
  return (
    <>
    <div>
      Test navigation
      <div className="flex gap-x-4 border-slate-200 ">

        <Link href="/test/v1-dates" className="d-btn">Dates</Link>
        <Link href="/test/v1-cookie" className="d-btn">Cookie</Link>
        <Link href="/test/v1-auth" className="d-btn">auth</Link>
        <Link href="/test/v1-testing" className="d-btn">testing</Link>

      </div>
    </div>
      <div className="container bg-base-200 ">{children}</div>
    </>
  );
};

export default LayTest;
