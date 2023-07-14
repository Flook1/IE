import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";
import { type NextPage } from "next";

interface CopyIconProps {
  copyValue: string;
  size?: number;
  throwToast?: boolean;
  children?: React.ReactNode;
}

export const CopyIcon: NextPage<CopyIconProps> = ({
  children,
  throwToast = true,
  size = 16,
  copyValue,
}) => {
  const { toast } = useToast();

  // function to copy
  const copyFunc = (value: string) => {
    void navigator.clipboard.writeText(value);
  };

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    copyFunc(copyValue);

    if (throwToast) {
      toast({
        size: "sm",
        description: `Value Copied to Clipboard: ${copyValue}`,
      });
    }
  };

  return (
    <Button variant={"ghost"} size={"icon_sm"} onClick={(e) => handleCopy(e)}>
      <Copy size={size} />
      {children}
    </Button>
  );
};


interface CopyTextProps {
  throwToast?: boolean;
  copyValue: string;
}

export const CopyText: NextPage<CopyTextProps> = ({
  throwToast = true,
  copyValue,
}) => {
  const { toast } = useToast();

  // function to copy
  const copyFunc = (value: string) => {
    void navigator.clipboard.writeText(value);
  };

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    copyFunc(copyValue);

    if (throwToast) {
      toast({
        variant: "default",
        size: "sm",
        description: `Value Copied to Clipboard: ${copyValue}`,
      });
    }
  };

  return (
    <Button variant={"link"} size={"sm"} onClick={(e) => handleCopy(e)}>
      <div className="text-xs text-zinc-500">{copyValue}</div>
    </Button>
  );
};
