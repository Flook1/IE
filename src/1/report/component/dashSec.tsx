import { type NextPage } from "next";
import { SkeletonCard } from "../../gen/components/skeleton";
import { IeCard } from "@/components/ie/ie-card";

type DashSecProp = {
  visible: boolean;
  isLoading: boolean;
  headLeft: string;
  headRight: string;
  content?: string;
  botLeft?: string;
  botLeft2?: string;
  botRight?: string;
  children?: React.ReactNode;
};

const DashSec: NextPage<DashSecProp> = ({
  visible,
  isLoading,
  headLeft,
  headRight,
  content,
  botLeft,
  botLeft2,
  botRight,
  children,
}) => {
  const botShow = botLeft || botRight || botLeft2;

  const mainBody = (
    <>
      <div className={!visible ? "hidden" : ""}>
        <div className="flex min-h-fit justify-between  border-b-2 border-zinc-200 align-baseline">
          <p className="ie-line-height-1 text-base font-medium">{headLeft}</p>
          <p className="ie-line-height-1 text-xs font-medium">{headRight}</p>
        </div>
        <div className="m-6 flex justify-center">
          {content && (
            <p className="ie-line-height-1 text-2xl font-bold">{content}</p>
          )}
          {children}
        </div>
        <div className="flex h-4 justify-between border-zinc-200 align-baseline">
          {botShow && (
            <>
              <p className="ie-line-height-1 text-xs font-medium">
                {botLeft}
                <span className="ie-line-height-1 text-sm font-semibold">
                  {` `}
                  {botLeft2}
                </span>
              </p>
              <p className="ie-line-height-1 text-xs font-medium">{botRight}</p>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <div>
        {isLoading ? <SkeletonCard></SkeletonCard> : mainBody}

        <IeCard hidden variant={"test"}>
          <p>Test data</p>
        </IeCard>
      </div>
    </>
  );
};

type DashListSmallProp = {
  visible: boolean;
  isLoading: boolean;
  headLeft: string;
  headRight: string;
  content1?: string;
  content2?: string;
  content3?: string;
  content4?: string;
  children?: React.ReactNode;
};

const DashListSmall: NextPage<DashListSmallProp> = ({
  visible,
  isLoading,
  headLeft,
  headRight,
  content1,
  content2,
  content3,
  content4,
  children,
}) => {
  const mainBody = (
    <>
      <div className={!visible ? "hidden" : ""}>
        <div className="flex min-h-fit justify-between  border-b-2 border-zinc-200 align-baseline">
          <p className="ie-line-height-1 text-base font-medium">{headLeft}</p>
          <p className="ie-line-height-1 text-xs font-medium">{headRight}</p>
        </div>
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 my-6 gap-4">
          {content1 && (
            <div>
              <p className="ie-line-height-1 text- text-sm">{content1}</p>
            </div>
          )}
          {content2 && (
            <div>
              <p className="ie-line-height-1 text- text-sm">{content2}</p>
            </div>
          )}

          {content3 && (
            <p className="ie-line-height-1 text- text-sm">{content3}</p>
          )}

          {content4 && (
            <p className="ie-line-height-1 text- text-sm">{content4}</p>
          )}
        </div>
        <div>{children}</div>
      </div>
    </>
  );

  return (
    <>
      <div>
        {isLoading ? <SkeletonCard></SkeletonCard> : mainBody}

        <IeCard hidden variant={"test"}>
          <p>Test data</p>
        </IeCard>
      </div>
    </>
  );
};

export { DashSec, DashListSmall };
