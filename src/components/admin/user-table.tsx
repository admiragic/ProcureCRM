
"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import type { User } from "@/lib/users"
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context"


export function UserTable({ data }: { data: User[] }) {
    const { t } = useLanguage();

    const columns: ColumnDef<User>[] = [
      {
        accessorKey: "name",
        header: t('admin_page.table_name'),
      },
      {
        accessorKey: "email",
        header: t('admin_page.table_email'),
      },
      {
        accessorKey: "username",
        header: t('admin_page.table_username'),
      },
      {
        accessorKey: "role",
        header: t('admin_page.table_role'),
        cell: ({ row }) => {
            const role: User["role"] = row.getValue("role");
            return <Badge variant={role === 'admin' ? 'destructive' : 'secondary'} className="capitalize">{role}</Badge>
        },
      },
    ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Card>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('client_table.no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
