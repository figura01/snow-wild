import { DataTable } from "@/admin/components/DataTable";
import { DELETE_MATERIAL_BY_ADMIN } from "@/admin/requetes/mutations/material.mutations";
import UseLocalStorage from "@/hooks/useLocalStorage";
import { LIST_CATEGORIES } from "@/requetes/queries/category.queries";
import { LIST_MATERIAL } from "@/requetes/queries/material.queries";
import { CategoryType } from "@/types";
import { Material } from "@/types/material";
import { Button } from "@/ui/Button";
import { useToast } from "@/ui/use-toast";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pen, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const ProductsAdminPage = () => {
  const { SetToLocalStorage } = UseLocalStorage();
  const { toast } = useToast();
  const [deleteProduct] = useMutation(DELETE_MATERIAL_BY_ADMIN);
  const { data, loading, error } = useQuery(LIST_MATERIAL, {
    fetchPolicy: "no-cache",
  });
  const [getCategories] = useLazyQuery(LIST_CATEGORIES);
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const handleDeleteProduct = (idProduct: string) => {
    deleteProduct({
      variables: {
        deleteMaterialId: idProduct,
      },
      onCompleted: (data) => {
        console.log("successfully delete");
        toast({
          title: "Delete",
          description: "Successfully deleted",
        });
        router.reload();
      },
      onError: (error) => {
        console.log("fail error");
        console.log(error);
      },
      fetchPolicy: "no-cache",
    });
  };

  const toLs = () => {
    localStorage.setItem("key", JSON.stringify(data));
  };

  useEffect(() => {
    getCategories({
      onCompleted(data) {
        console.log("data categories: ", data);
        setCategories(data.categories);
      },
    });
  }, [getCategories]);

  const columns: ColumnDef<Material>[] = [
    {
      accessorKey: "picture",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              console.log(column.getIsSorted() === "desc");
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            Picture
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">
          <img
            src={
              `${process.env.NEXT_PUBLIC_IMAGE_URL}` + row.getValue("picture")
            }
            alt="#"
            width={"auto"}
            height={"50px"}
            style={{ height: "50px" }}
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              console.log(column.getIsSorted() === "desc");
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              console.log(column.getIsSorted() === "desc");
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            Category
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        console.log("row:", row);
        return <div className="lowercase">{row.original.category.name}</div>;
      },
    },
    {
      accessorKey: "sizes",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              console.log(column.getIsSorted() === "desc");
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            Sizes / Quantity
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 lowercase">
            {row.original.sizes.map((s) => (
              <div key={s.size} className="flex flex-col items-center">
                <div className="flex rounded-md bg-black px-2 py-1 text-white">
                  {s.size}
                </div>
                {s.quantity}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 lowercase">
            <Link href={`/admin/products/${row.original.id}`}>
              <div className="flex rounded-full bg-gray-200 p-2 shadow-sm transition-all hover:bg-black hover:text-white">
                <Eye />
              </div>
            </Link>

            <Link
              href={`/admin/products/edit/${row.original.id}`}
              onClick={() => SetToLocalStorage("product_row", row)}
            >
              <div className="flex rounded-full bg-gray-200 p-2 shadow-sm transition-all hover:bg-black hover:text-white">
                <Pen />
              </div>
            </Link>

            <div
              onClick={() => {
                handleDeleteProduct(row.original.id);
              }}
            >
              <div className="flex rounded-full bg-gray-200 p-2 shadow-sm transition-all hover:bg-black hover:text-white">
                <Trash />
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="">
      <div className="items-cente flex bg-white py-4">
        {data && (
          <DataTable
            columns={columns}
            data={data.listMaterials}
            title="List of Products"
            createEntity="products"
          />
        )}
      </div>
    </div>
  );
};

export default ProductsAdminPage;
