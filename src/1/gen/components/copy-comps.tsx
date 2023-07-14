import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";
import { type NextPage } from "next";

interface CopyIconProps {
  throwToast: boolean;
  copyValue: string;
  children?: React.ReactNode;
}

export const CopyIcon: NextPage<CopyIconProps> = ({
  children,
  throwToast,
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
    <Button variant={"ghost"} size={"sm"} onClick={(e) => handleCopy(e)}>
      <Copy size={16} />
      {children}
    </Button>
  );
};

interface CopyTextProps {
  throwToast: boolean;
  copyValue: string;
}

export const CopyText: NextPage<CopyTextProps> = ({
  throwToast,
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
