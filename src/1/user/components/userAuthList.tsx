import { type NextPage } from "next";
import { SkeletonTableFull } from "../../gen/components/skeleton";
import { IeCard } from "@/components/ie/ie-card";
import { type RouterOutputs, api } from "@/src/utils/api";
import DebugView from "@/src/1/test/debug-view";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../gen/components/table/dataTable";
import { TableHeader } from "../../gen/components/table/tableHeader";
import { TableCellTwo } from "../../gen/components/table/tableCell";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "../../gen/components/copy-comps";

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
      const rowData = row.original;

      return (
        <TableCellTwo
          main={
            <div className="">
              {`${rowData.name_first} ${rowData.name_last!}`}
            </div>
          }
        >
          <div>
            <CopyIcon copyValue={rowData.user_id} size={10}></CopyIcon> userId:{" "}
            {rowData.user_id}
          </div>
        </TableCellTwo>
      );
    },
  },
  {
    accessorKey: "email_id",
    id: "email",
    header: ({ column }) => (
      <TableHeader column={column} title={column.id} sort={false}></TableHeader>
    ),
    cell: ({ row }) => {
      return (
        <div>
          <CopyIcon copyValue={row.original.email_id} size={10}></CopyIcon>{" "}
          {row.original.email_id}
        </div>
      );
    },
  },
  {
    accessorKey: "rel_bus.business_name",
    id: "Business Name",
    header: ({ column }) => {
      return (
        <TableHeader
          column={column}
          title={column.id}
          sort={false}
        ></TableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <CopyIcon
            copyValue={row.original.rel_bus?.business_name ?? ""}
            size={10}
          ></CopyIcon>{" "}
          {row.original.rel_bus?.business_name}
        </div>
      );
    },
  },
  {
    id: "action",
    header: ({ column }) => {
      return (
        <TableHeader
          column={column}
          title={column.id}
          sort={false}
        ></TableHeader>
      );
    },
    cell: ({ row }) => {
      return <Button size={"sm"}>Login As</Button>;
    },
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
