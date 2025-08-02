
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Client } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"

/**
 * A component that renders the actions for a client row in the table.
 * It includes a dropdown menu with options like copy ID, view, edit, and delete.
 * @param {object} props - The component props.
 * @param {any} props.row - The row object from @tanstack/react-table.
 * @returns {React.ReactElement} The rendered actions cell.
 */
const ActionCell = ({ row }: { row: any }) => {
    const { t } = useLanguage();
    const client = row.original;

    /**
     * Handles the delete action.
     * Note: This is a placeholder and should be implemented with a proper API call and confirmation dialog.
     */
    const handleDelete = () => {
        alert(t('client_table.delete_alert', { companyName: client.companyName }));
        // Here you would typically call an API to delete the client
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">{t('client_table.open_menu')}</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('client_table.actions')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(client.id)}>
                    {t('client_table.copy_id')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    {/* Note: This should link to a specific client's detail page, e.g., /clients/${client.id} */}
                    <Link href={`/clients/new`}>{t('client_table.view_client')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    {/* Note: This should link to a specific client's edit page, e.g., /clients/edit/${client.id} */}
                    <Link href={`/clients/new`}>{t('client_table.edit_client')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                    {t('client_table.delete_client')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

/**
 * Column definitions for the client table.
 */
export const columns: ColumnDef<Client>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => {
        const client = row.original;
        return (
             <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${client.email}.png`} alt={client.contactPerson} />
                    <AvatarFallback>{client.companyName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">{client.companyName}</div>
                    <div className="text-xs text-muted-foreground">{client.contactPerson}</div>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
        const type: Client["type"] = row.getValue("type");
        const variant = {
            lead: "default",
            prospect: "secondary",
            customer: "outline",
        }[type] as "default" | "secondary" | "outline";
      return <Badge variant={variant} className="capitalize">{type}</Badge>
    },
     filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
   {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status: Client["status"] = row.getValue("status");
        const color = {
            active: "text-green-500",
            inactive: "text-yellow-500",
            archived: "text-red-500",
        }[status]
      return <div className={`capitalize flex items-center gap-2`}><span className={`h-2 w-2 rounded-full ${color.replace('text-','bg-')}`}></span> {status}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Added On</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("createdAt")}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionCell,
  },
]

/**
 * The main component for the client data table.
 * It uses @tanstack/react-table to provide sorting, filtering, pagination, and column visibility.
 * @param {object} props - The component props.
 * @param {Client[]} props.data - The array of client data to display.
 * @returns {React.ReactElement} The rendered data table.
 */
export function ClientTable({ data }: { data: Client[] }) {
  const { t } = useLanguage();
  // State for table sorting, filtering, visibility, and row selection
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Initialize the table instance
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t('client_table.filter_placeholder')}
          value={(table.getColumn("companyName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("companyName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t('client_table.columns_button')} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {t('client_table.selected_rows', { 
            selected: table.getFilteredSelectedRowModel().rows.length, 
            total: table.getFilteredRowModel().rows.length 
          })}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('client_table.previous_button')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('client_table.next_button')}
          </Button>
        </div>
      </div>
    </div>
  )
}
