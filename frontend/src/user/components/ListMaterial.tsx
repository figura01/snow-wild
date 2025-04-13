import { LIST_CATEGORIES } from "@/requetes/queries/category.queries";
import {
  LIST_MATERIAL,
  LIST_MATERIAL_BY_CATEGORY_ID,
} from "@/requetes/queries/material.queries";
import { CategoryQuery } from "@/types/category";
import { MaterialQuery } from "@/types/material";
import { useLazyQuery, useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";
import CategorySelector from "./CategorySelector";

const ListMaterial: React.FC = () => {
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery<CategoryQuery>(LIST_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data: allMaterialsData,
    loading: allMaterialsLoading,
    error: allMaterialsError,
  } = useQuery<MaterialQuery>(LIST_MATERIAL);
  const [
    getMaterialsByCategory,
    { data: materialsData, loading: materialsLoading, error: materialsError },
  ] = useLazyQuery<MaterialQuery>(LIST_MATERIAL_BY_CATEGORY_ID);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      getMaterialsByCategory({
        variables: { findMaterialByCategoriesId: categoryId },
      });
    }
  };

  const materialsToDisplay = selectedCategory
    ? materialsData?.findMaterialByCategories
    : allMaterialsData?.listMaterials;

  return (
    <div className="mx-auto h-fit px-4 py-8 font-poppins">
      <CategorySelector
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        categoriesData={categoriesData}
        handleCategoryClick={handleCategoryClick}
        selectedCategory={selectedCategory}
      />
      {(allMaterialsLoading || materialsLoading) && (
        <p className="text-center text-gray-500">Chargement des articles...</p>
      )}
      {(allMaterialsError || materialsError) && (
        <p className="text-red-500">Erreur lors du chargement des articles.</p>
      )}
      {materialsToDisplay && materialsToDisplay.length > 0 ? (
        <div className="mx-auto px-4 py-8 font-poppins">
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {materialsToDisplay.map((item) => (
              <li
                key={item.id}
                className="transform overflow-hidden rounded-xl bg-white transition duration-500 hover:scale-105"
              >
                <Link href={`product/${item.id}`}>
                  <div className="block">
                    <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-lg rounded-t-lg shadow-lg">
                      <img
                        className="h-full object-cover"
                        src={process.env.NEXT_PUBLIC_IMAGE_URL + item.picture}
                        alt={item.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-700 opacity-50"></div>
                    </div>
                    <div className="relative p-6">
                      <h2 className="text-xl font-bold uppercase text-neutral-950">
                        {item.name}
                      </h2>
                      <p className="line-clamp-3 text-sm text-neutral-950">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !allMaterialsLoading &&
        !materialsLoading && (
          <div className="h-full text-center">
            Aucun matériel trouvé dans cette catégorie.
          </div>
        )
      )}
    </div>
  );
};

export default ListMaterial;
