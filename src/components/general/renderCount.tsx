import { env } from "@/src/env.mjs";
import type { NextPage } from "next";
import { useRef } from "react";

const SHOW_RENDER_COUNTERS = true;

interface Props {
  enabled: boolean
}

const useRenderCounter = (props: Props) => {
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;

  if (env.NEXT_PUBLIC_MY_ENV == "development" && SHOW_RENDER_COUNTERS || env.NEXT_PUBLIC_MY_ENV=='development' && props.enabled) {
    return (
      <>
        <p className="bg-red-300 text-red-500 rounded-xl m-5 px-20">RenderCount: {String(renderCount.current)}</p>
      </>
    );
  }

  return null;
};

export default useRenderCounter;
