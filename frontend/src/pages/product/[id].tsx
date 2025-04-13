/* eslint-disable @next/next/no-img-element */
import { useCart } from "@/contexts/CartContext";
import { GET_MATERIAL_BY_ID } from "@/requetes/queries/material.queries";
import { Material } from "@/types/material";
import { Button } from "@/ui/Button";
import { toast } from "@/ui/use-toast";
import { useLazyQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { Key, useEffect, useState } from "react";

function MaterialDetail() {
  const router = useRouter();

  const [getAd, { data, loading, error }] = useLazyQuery(GET_MATERIAL_BY_ID);
  console.log(data);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>();

  useEffect(() => {
    if (router.query.id) {
      getAd({
        variables: {
          findMaterialByIdId: router.query.id,
        },
      });
    }
  }, [getAd, router.query.id]);

  if (loading) {
    return <div>Chargement en cours</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  const material: Material = data?.findMaterialById;
  console.log(material);

  const handleAddToCart = () => {
    if (material && selectedSize) {
      const materialWithSize = { ...material, selectedSize };
      addToCart(materialWithSize, selectedSize);
      toast({ description: "Ajouté au panier" });
    }
  };

  return (
    <main className="container mx-auto font-poppins">
      <div className="mx-auto mt-10 overflow-hidden rounded-lg border-4 border-blue-300 py-5 shadow-lg lg:flex lg:w-11/12">
        <div className="flex h-96 flex-auto justify-center self-center lg:w-96">
          <img
            className="flex h-full self-center"
            src={process.env.NEXT_PUBLIC_IMAGE_URL + material?.picture}
            alt={material?.name}
          />
        </div>
        <div className="flex-auto items-center p-6 lg:w-32">
          <h1 className="mb-1 text-3xl font-bold text-neutral-950">
            {material?.name}
          </h1>
          <p className="text-gray mb-8 text-2xl font-bold">
            {material?.price}€
          </p>
          <p className="text-gray mb-8">{material?.description}</p>
          <p className="mx-2 text-center">Sélectionner une taille</p>
          <div className="text-gray mt-2 flex justify-center">
            {material?.sizes?.map(
              (sizeDetail: { size: string; quantity: number }, index: Key) => (
                <div key={index} className="mb-2">
                  <button
                    className={`button rounded border px-4 py-2 ${
                      selectedSize === sizeDetail.size
                        ? "bg-white-500 text-neutral border-blue-500"
                        : "bg-black text-white"
                    }`}
                    onClick={() => setSelectedSize(sizeDetail.size)}
                  >
                    {sizeDetail.size}
                  </button>
                  <br />
                </div>
              ),
            )}
          </div>

          <div className="p-6">
            <div className="mt-4 flex justify-center lg:justify-end">
              <Button
                onClick={handleAddToCart}
                className="button w-10/12 rounded bg-black text-white hover:text-black lg:w-full"
              >
                Ajouter au panier
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Link href="/" className="hover:underline">
          Retour à la liste
        </Link>
      </div>
    </main>
  );
}

export default MaterialDetail;
