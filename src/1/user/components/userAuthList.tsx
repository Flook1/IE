import { type NextPage } from "next";
import { SkeletonListRow } from "../../gen/components/skeleton";
import { IeCard } from "@/components/ie/ie-card";
import { type RouterOutputs, api } from "@/src/utils/api";
import DebugView from "@/src/1/test/debug-view";
import {type  ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type inferredOutputList = RouterOutputs["userBasic"]["userList"];
type inferredOutputItem = inferredOutputList["list"][0]


export const columns: ColumnDef<inferredOutputItem>[] = [
  {
    accessorKey: "name_first",
    header: "Name"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "business",
    header: "Business Name"
  },

]



export const UserAuthList: NextPage = () => {
  const userList = api.userBasic.userList.useQuery(
    { search: "haydn", take: 25, page: 0 },
    {
      enabled: true,
    }
  );


  return (
    <>
      <div>
        <div className="w-full border-2 border-pink-300">
          {/* table section */}
          <Table>
            <TableCaption>
              Table of something
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Soemthing1</TableHead>
                <TableHead>Somethign 2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableCell>asdhiasido</TableCell>
              <TableCell>asdjiiaojsd</TableCell>
              <TableCell>sadihaiosd</TableCell>
              <TableCell>asdaisdj</TableCell>
            </TableBody>
          </Table>
        </div>
        <p>Testing</p>
        <DebugView
          visible
          header="Query Data"
          content={userList.data}
        ></DebugView>
      </div>
    </>
  );
};
