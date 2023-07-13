import { TableCell, TableRow } from "@/components/ui/table";
import { Frown } from "lucide-react";
import { type NextPage } from "next";

type NoResultsProps = {
  colLength: number;
  header?: string;
};

const NoResults: NextPage<NoResultsProps> = ({ colLength, header }) => {
  return (
    <TableRow>
      <TableCell colSpan={colLength} className="h-24 text-center">
        <div className="flex place-items-center justify-center gap-10 my-4">
          <Frown className="h-20 w-20 text-zinc-300"/>
          <div>
            <h3 className="text-lg font-semibold text-zinc-500">No Results Found</h3>
            <p className="text-sm text-zinc-500 w-96">Sorry no data was returned with current filtering settings. </p>
            <p className="text-sm text-zinc-500 font-semibold w-96"> Refresh page or clear your filters.</p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default NoResults;
