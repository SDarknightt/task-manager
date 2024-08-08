import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import {ColumnDef, getCoreRowModel} from "@tanstack/table-core";
import {flexRender, useReactTable} from "@tanstack/react-table";
import type {Board, User} from "~/utils/types";
import * as React from "react";
import {Button} from "~/components/ui/button";
import {UserRoundX} from "lucide-react";
import {toast} from "~/components/ui/use-toast";
import {api} from "~/utils/api";

interface DataTableProps<TData> {
    data: TData[]
    board: Board
}

function UsersTable<TData extends User>({ data, board }: DataTableProps<TData>) {

    const userMutation = api.user.removeUserBoard.useMutation();

    async function removeUser(user: User) {
        const removeUser = await userMutation.mutateAsync({
            boardId: board.id,
            userId: user.id
        });
        if (removeUser) {
            toast({
                title: "Sucesso!",
                description: "Usuário removido com sucesso.",
            })
        } else {
            toast({
                title: "Erro!",
                description: "Erro ao remover usuário.",
            })
        }
    }

    const columns: ColumnDef<TData>[] = [
        {
            accessorKey: "name",
            header: "Nome",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "remover",
            header: "Remover",
            cell: ({ row }) => (
                <Button variant={"destructive"} onClick={() => removeUser(row.original)}>
                    <UserRoundX/>
                </Button>
            ),
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Sem resultados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default UsersTable;