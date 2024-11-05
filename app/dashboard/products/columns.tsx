"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Ghost, MoreHorizontal, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { deleteProduct } from "@/server/actions/delete-product";
import { toast } from "sonner";
import Link from "next/link";

type ProductColumn = {
  title: string;
  price: number;
  image: string;
  variants: any;
  id: number;
};

async function deleteProductWrapper(id: number) {
  const data = await deleteProduct({ id });
  if (!data) {
    return new Error("No data found");
  }
  if (data.data?.success) {
    toast.success(data.data?.success);
  }
  if (data.data?.error) {
    toast.success(data.data?.error);
  }
}

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
  const { execute, status } = useAction(deleteProduct, {
    onSuccess: (data) => {
      if (data.data?.success) {
        toast.success(data.data?.success);
      }
      if (data.data?.error) {
        toast.success(data.data?.error);
      }
    },
  });
  const product = row.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"ghost"} className="h-8 w-8 p-0">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel asChild>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
          <Link href={`/dashboard/add-product?id=${product.id}`}>
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => execute({ id: product.id })}
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "variants",
    header: "Variants",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      }).format(price);
      return <div className="font-medium text-xs">{formatted}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const cellImage = row.getValue("image") as string;
      const cellTitle = row.getValue("title") as string;
      return (
        <div className="">
          <Image
            src={cellImage}
            alt={cellTitle}
            width={50}
            height={50}
            className="rounded-md"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ActionCell,
  },
];
