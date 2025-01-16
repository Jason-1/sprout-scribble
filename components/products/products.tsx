"use client";

import { VariantswithProduct } from "@/lib/infer-types";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import formatPrice from "@/lib/format-price";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

type ProductTypes = {
  variants: VariantswithProduct[];
};

export default async function Products({ variants }: ProductTypes) {
  const params = useSearchParams();
  const paramTag = params.get("tag");
  const paramOrder = params.get("order");

  const filtered = useMemo(() => {
    let output = variants;
    console.log(variants);

    if (paramTag && variants) {
      output = variants.filter((variant) =>
        variant.variantTags.some((tag) => tag.tag === paramTag)
      );
    }
    if (paramOrder && variants) {
      if (paramOrder === "asc") {
        output = [...output].sort((a, b) => a.product.price - b.product.price);
      }
      if (paramOrder === "desc") {
        output = [...output].sort((a, b) => b.product.price - a.product.price);
      }
      if (paramOrder === "new") {
        output = [...output].sort((a, b) => b.product.id - a.product.id);
      }
    }
    //if selected asc or desc price order, order the products in here by price and return them
    return output;
  }, [paramTag, paramOrder]);

  return (
    <main className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
      {filtered.map((variant) => (
        <Link
          className="py-2"
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
        >
          <Image
            className="rounded-md"
            src={variant.variantImages[0].url}
            width={360}
            height={480}
            alt={variant.product.title}
            loading="lazy"
          />
          <div className="flex justify-between">
            <div className="font-medium">
              <h2>{variant.product.title}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>
            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}
