import { type Row, type Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface DataTableCellProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
    main: string,
    children: React.ReactNode,
  }

export function TableCellTwo<TData>({
  main,
  children,
  className,
}: DataTableCellProps<TData>) {

  return (
    <div className={cn("flex items-center space-x-2", className)}>

    </div>
  );
}
