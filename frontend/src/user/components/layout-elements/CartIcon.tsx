import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/router";

export default function CartIcon({ className }: { className: string }) {
  const router = useRouter();
  const gotToCart = () => {
    router.push("/user/cart");
  };
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  return (
    <>
      <button className={cn(className)} onClick={gotToCart}>
        <ShoppingCart className="relative" />
        {itemCount > 0 && (
          <span className="absolute right-[100px] top-7 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold leading-none text-red-100 lg:right-20 lg:top-6">
            {itemCount}
          </span>
        )}
      </button>
    </>
  );
}
