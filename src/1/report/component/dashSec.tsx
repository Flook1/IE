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

export { DashSec };
