import { type NextPage } from "next";

type tHeaderProps = {
  header: string;
  description: string;
  children?: React.ReactNode;
};

const IeHeader: NextPage<tHeaderProps> = ({
  header,
  description,
  children,
}) => {
  return (
    <>
      <div className="mb-6 grid min-h-fit w-full gap-4  sm:grid-cols-1 lg:grid-cols-5 lg:py-6">
        <div className="col-span-2 flex flex-col border-s-4 border-zinc-400 ps-2">
          {/* title and descriptions. */}
          <h3 className="font-semibold text-zinc-700 sm:text-xl lg:text-2xl">
            {header}
          </h3>
          <p className="text-zinc-500 sm:text-sm   lg:text-sm">{description}</p>
        </div>
        <div className="sm:w-12/12 col-span-3 flex items-center justify-end">
          {/* Children part */}
          {children}
        </div>
      </div>
    </>
  );
};

export { IeHeader };
