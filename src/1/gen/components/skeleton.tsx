import { type NextPage } from "next";

type tSkeletonCardProps = {
  type?: string;
};

const SkeletonCard: NextPage<tSkeletonCardProps> = ({ type }) => {
  return (
    <>
      <div className="w-full animate-pulse">
        <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="w-6/6 mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-2  w-4/6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-2  w-5/6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-2  w-2/6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2  w-5/6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

type tSkeletonImgProps = {
  type?: string;
};

const SkeletonImg: NextPage<tSkeletonImgProps> = ({}) => {
  return (
    <>
      <div className="w-full animate-pulse">
        <div
          className={`flex h-48 w-full items-center justify-center rounded bg-gray-300 dark:bg-gray-700 sm:w-96`}
        >
          <svg
            className="h-12 w-12 text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 640 512"
          >
            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
          </svg>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

type tSkeletonVideoProps = {
  type?: string;
};

const SkeletonVideo: NextPage<tSkeletonVideoProps> = ({ type }) => {
  return (
    <>
      <div className="w-full animate-pulse">
        <svg
          className="h-12 w-12 text-gray-200 dark:text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 384 512"
        >
          <path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

type tSkeletonParagraphProps = {
  type?: string;
};

const SkeletonParagraph: NextPage<tSkeletonParagraphProps> = ({ type }) => {
  return (
    <>
      <div className="w-full animate-pulse">
        <div className="mb-4 flex h-48 items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
          <svg
            className="h-12 w-12 text-gray-200 dark:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 640 512"
          >
            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
          </svg>
        </div>
        <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-4 flex items-center space-x-3">
          <svg
            className="h-14 w-14 text-gray-200 dark:text-gray-700"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <div>
            <div className="mb-2 h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

type tSkeletonWidgetProps = {
  type?: string;
};

const SkeletonWidget: NextPage<tSkeletonWidgetProps> = ({ type }) => {
  return (
    <>
      <div
        role="status"
        className="max-w-sm animate-pulse rounded border border-gray-200 p-4 shadow dark:border-gray-700 md:p-6"
      >
        <div className="mb-2.5 h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-10 h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-4 flex items-baseline space-x-6">
          <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-56 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-64 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

type tSkeletonListRowProps = {
  type?: string;
};

const SkeletonListRow: NextPage<tSkeletonListRowProps> = ({ type }) => {
  return (
    <>
      <div
        role="status"
        className="w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
      >
        <div className="flex items-center justify-between">
          <div className="w-7/12">
            <div className="mb-2.5 h-2.5 w-5/6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-2 w-3/6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 w-3/12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

type tSkeletonTableRowProps = {
  type?: string;
};

const SkeletonTableRow: NextPage<tSkeletonTableRowProps> = ({ type }) => {
  return (
    <>
      <div
        role="status"
        className="w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
      >
        <div className="flex items-center justify-between">
          <div className="w-4/12">
            <div className="mb-2.5 h-2.5 w-5/6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-2 w-3/6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="w-3/12">
            <div className="mb-2.5 h-2.5 w-3/6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-2 w-2/6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="w-5/12">
            <div className="mb-2.5 h-2.5 w-2/6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-2 w-5/6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 w-2/12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};


export {
  SkeletonCard,
  SkeletonImg,
  SkeletonVideo,
  SkeletonParagraph,
  SkeletonWidget,
  SkeletonListRow,
  SkeletonTableRow,
};
