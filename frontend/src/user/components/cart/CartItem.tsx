import { Button } from "@/ui/Button";
import { Trash2 } from "lucide-react";
import React from "react";

interface CartItemProps {
  id: string;
  name: string;
  picture: string;
  selectedSize: string;
  quantity: number;
  price: number;
  description?: string;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  picture,
  selectedSize,
  quantity,
  price,
  description,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <div
      key={`${id}-${selectedSize}`}
      className="relative flex overflow-hidden rounded-xl border-4 border-blue-300 shadow-lg"
    >
      {/* <Trash2
        className="absolute right-0 h-12 w-12 cursor-pointer bg-red-500 text-xl"
        onClick={onRemove}
      /> */}
      <div className="flex h-72 w-72 justify-center self-center">
        <img
          className="flex h-full self-center"
          src={process.env.NEXT_PUBLIC_IMAGE_URL + picture}
          alt={name}
        />
      </div>
      <div className="w-4/5 items-center justify-between p-6 lg:flex">
        <div>
          <h2 className="mb-2 text-2xl font-bold">{name}</h2>
          {description && (
            <p className="line-clamp-3 w-9/12 text-gray-700">{description}</p>
          )}

          <div className="mt-5 gap-6 space-y-4 lg:flex lg:items-center lg:space-y-0">
            <p className="text-gray-700">
              Taille : <span className="underline">{selectedSize}</span>
            </p>
            <div className="flex items-center">
              <span className="mr-2">Quantité : </span>
              {onQuantityChange && (
                <select
                  value={quantity}
                  onChange={(e) => onQuantityChange(parseInt(e.target.value))}
                  className="rounded border px-2 py-1"
                >
                  {[1, 2, 3, 4, 5].map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {onRemove && (
              <Button
                onClick={onRemove}
                className="rounded-xl bg-red-500 text-start text-white hover:bg-red-700"
              >
                <Trash2 className="mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
        <p className="mt-2 text-xl font-bold text-gray-700">{price}€</p>
      </div>
    </div>
  );
};

export default CartItem;
