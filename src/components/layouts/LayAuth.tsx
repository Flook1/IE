import { api } from "@/src/utils/api";
import { useRouter } from "next/router";

export type NextPageLayoutProps = {
  children: React.ReactNode;
};

// This is for the auth pages

export const LayAuth = ({ children }: NextPageLayoutProps) => {
  const router = useRouter();

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
