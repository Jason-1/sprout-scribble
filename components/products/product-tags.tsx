"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductTags() {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");

  const setFilter = (newTag: string) => {
    const searchParams = new URLSearchParams(params.toString());
    if (newTag) {
      searchParams.set("tag", newTag);
    } else {
      searchParams.delete("tag");
    }
    router.push(`?${searchParams.toString()}`);
  };

  const setOrder = (newOrder: string) => {
    const searchParams = new URLSearchParams(params.toString());
    if (newOrder) {
      searchParams.set("order", newOrder);
    } else {
      searchParams.delete("order");
    }
    router.push(`?${searchParams.toString()}`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="my-4 flex gap-4 items-center">
        <Badge
          onClick={() => setFilter("")}
          className={cn(
            "cursor-pointer bg-black hover:bg-black/75 hover:opacity-100",
            !tag ? "opacity-100" : "opacity-50"
          )}
        >
          All
        </Badge>
        <Badge
          onClick={() => setFilter("blue")}
          className={cn(
            "cursor-pointer bg-blue-500 hover:bg-blue-600 hover:opacity-100",
            tag === "blue" && tag ? "opacity-100" : "opacity-50"
          )}
        >
          Blue
        </Badge>
        <Badge
          onClick={() => setFilter("purple")}
          className={cn(
            "cursor-pointer bg-purple-500 hover:bg-purple-600 hover:opacity-100",
            tag === "purple" && tag ? "opacity-100" : "opacity-50"
          )}
        >
          Purple
        </Badge>
        <Badge
          onClick={() => setFilter("pink")}
          className={cn(
            "cursor-pointer bg-pink-500 hover:bg-pink-600 hover:opacity-100",
            tag === "pink" && tag ? "opacity-100" : "opacity-50"
          )}
        >
          Pink
        </Badge>
        <Badge
          onClick={() => setFilter("white")}
          className={cn(
            "cursor-pointer bg-white/75 hover:bg-white hover:opacity-100 text-black",
            tag === "white" && tag ? "opacity-100" : "opacity-50"
          )}
        >
          White
        </Badge>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>Filter Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Order By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOrder("")}>
            No Order
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOrder("asc")}>
            Lowest Price
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOrder("desc")}>
            Highest Price
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOrder("new")}>
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOrder("rating")}>
            Highest Rated
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
