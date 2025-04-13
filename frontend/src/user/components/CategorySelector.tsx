import { cn } from "@/lib/utils";
import { CategoryQuery } from "@/types/category";
import { Button } from "@/ui/Button";
import { ApolloError } from "@apollo/client";

export default function CategorySelector({
  categoriesLoading,
  categoriesError,
  categoriesData,
  handleCategoryClick,
  selectedCategory,
}: {
  categoriesLoading: boolean;
  categoriesError: ApolloError | undefined;
  categoriesData: CategoryQuery | undefined;
  handleCategoryClick: (categoryId: string | null) => void;
  selectedCategory: string | null;
}) {
  const buttonCategoryClassName =
    "w-48 rounded-xl border justify-items-center self-center border-stone-950 px-4 py-2 uppercase transition hover:bg-stone-950 hover:text-white justify-self-center bg-white";
  return (
    <div className="mx-auto mb-6 justify-center justify-items-center gap-2 space-x-2 space-y-2 text-center lg:flex">
      <Button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          buttonCategoryClassName,
          selectedCategory === null ? "bg-stone-950 text-white" : "",
          "ml-2 lg:mt-2",
        )}
      >
        Tous les produits
      </Button>
      {categoriesLoading && <p>Loading categories...</p>}
      {categoriesError && (
        <p>Error loading categories: {categoriesError.message}</p>
      )}
      {categoriesData?.categories.map((c) => (
        <Button
          key={c.id}
          onClick={() => handleCategoryClick(c.id)}
          className={cn(
            buttonCategoryClassName,
            selectedCategory === c.id ? "bg-stone-950 text-white" : "",
          )}
        >
          {c.name}
        </Button>
      ))}
    </div>
  );
}
