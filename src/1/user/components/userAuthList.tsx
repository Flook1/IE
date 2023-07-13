import { type NextPage } from "next";
import { SkeletonTableFull } from "../../gen/components/skeleton";
import { IeCard } from "@/components/ie/ie-card";
import { type RouterOutputs, api } from "@/src/utils/api";
import DebugView from "@/src/1/test/debug-view";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../gen/components/table/dataTable";
import { TableHeader } from "../../gen/components/table/tableHeader";
import { TableCellTwo } from "../../gen/components/table/tableCell";

type inferredOutputList = RouterOutputs["userBasic"]["userList"];
type inferredOutputItem = inferredOutputList["list"][0];

export const columns: ColumnDef<inferredOutputItem>[] = [
  {
    accessorKey: "name_first",
    id: "Name",
    header: ({ column }) => (
      <TableHeader column={column} title={column.id} sort={false}></TableHeader>
    ),
    cell: ({ row }) => {
      // get value
      const rowData = row.original;

      if (false) {
        return (
          <div className="">
            <h3>{`${rowData.name_first}  ${rowData.name_last!}`}</h3>
            <h3> userId: {rowData.user_id}</h3>
          </div>
        );
      }
      if (true) {
        return (
          <TableCellTwo main={<div className="border border-red-400">insdie jsx</div>}>
            <p>something here</p>
          </TableCellTwo>
        );
      }
    },
  },
  {
    accessorKey: "email_id",
    id: "email",
    header: ({ column }) => (
      <TableHeader column={column} title={column.id} sort={false}></TableHeader>
    ),
  },
  {
    accessorKey: "rel_bus.business_name",
    header: ({ column }) => (
      <TableHeader
        column={column}
        title={"Business Name"}
        sort={false}
      ></TableHeader>
    ),
  },
];

type UserAuthListProps = {
  data: inferredOutputList;
  isLoading: boolean;
};

export const UserAuthList: NextPage<UserAuthListProps> = ({
  data,
  isLoading,
}) => {
  return (
    <>
      <div>
        {!isLoading ? (
          <DataTable columns={columns} data={data?.list ?? []}></DataTable>
        ) : (
          <IeCard variant={"table"} className="">
            <SkeletonTableFull></SkeletonTableFull>
          </IeCard>
        )}
      </div>
      <div hidden>
        <p>Testing</p>
        <DebugView visible header="Query Data" content={data}></DebugView>
      </div>
    </>
  );
};
