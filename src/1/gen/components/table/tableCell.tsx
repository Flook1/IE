import { cn } from "@/lib/utils";

interface TableCellTwoProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  main: React.ReactNode;
  children?: React.ReactNode;
}

export function TableCellTwo<TData>({
  main,
  children,
  className,
}: TableCellTwoProps<TData>) {
  return (
    <div className={cn("flex flex-col items-start space-x-2", className)}>
      <div className="text-base text-zinc-600">{main}</div>
      {children && <div className="text-xs  text-zinc-500">{children}</div>}
    </div>
  );
}

interface TableCellOneProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TableCellOne<TData>({
  children,
  className,
}: TableCellOneProps<TData>) {
  return (
    <div className={cn("flex flex-col items-start space-x-2", className)}>
      <div className="text-base text-zinc-600">{children}</div>
    </div>
  );
}
