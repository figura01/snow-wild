import ProductCard from "@/admin/components/ProductCard";
import { GET_MATERIAL_BY_ID } from "@/requetes/queries/material.queries";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
const DetailProductAdmin = () => {
  const router = useRouter();
  const [getMaterial, { data, loading, error }] = useLazyQuery(
    GET_MATERIAL_BY_ID,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    if (router.query.id) {
      console.log(router.query.id, " ", typeof router.query.id);
      getMaterial({
        variables: {
          findMaterialByIdId: router.query.id,
        },
        onCompleted: (data) => {
          console.log("success");
          console.log(data);
        },
        onError: (error) => {
          console.log("error");
          console.log(error);
        },
      });
    }
  }, [getMaterial, router.query.id]);

  return (
    <div>
      <h1>Detail product</h1>
      {data && data.findMaterialById && (
        <ProductCard
          product={{ ...data.findMaterialById, id: router.query.id }}
        />
      )}
    </div>
  );
};

export default DetailProductAdmin;
