import { z } from "zod";
import { Smile, SmilePlus } from "lucide-react";

const zIconTest = z.enum(["Smile", "SmilePlus"]);
type tIconTest = z.infer<typeof zIconTest>;

interface tProps {
  icon: tIconTest;
}

export const IconTest = (props: tProps) => {
  const Icon = props.icon;

  if (Icon == "Smile") {
    return (
      <>
        <Smile />
      </>
    );
  }else if (Icon == "SmilePlus") {
    return (
      <>
        <SmilePlus />
      </>
    );
  } else {
    return null
  }
};
