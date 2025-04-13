/* eslint-disable @next/next/no-img-element */
import AuthContext from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CartItem from "@/user/components/cart/CartItem";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemIdToRemove, setItemIdToRemove] = useState<string | null>(null);
  const [itemSizeToRemove, setItemSizeToRemove] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useContext(AuthContext);

  const confirmRemoveItem = (id: string, selectedSize: string) => {
    setShowConfirmation(true);
    setItemIdToRemove(id);
    setItemSizeToRemove(selectedSize);
  };

  const handleCheckout = () => {
    if (user?.userId) {
      router.push("/user/reservations/create/booking");
    } else {
      console.log("redirectif");

      router.push(`/auth/login?redirect=/user/reservations/create/booking`);
    }
  };

  const handleRemoveItem = () => {
    if (itemIdToRemove && itemSizeToRemove) {
      removeFromCart(itemIdToRemove, itemSizeToRemove);
      setItemIdToRemove(null);
      setItemSizeToRemove(null);
      setShowConfirmation(false);
    }
  };

  const handleCancelRemove = () => {
    setItemIdToRemove(null);
    setShowConfirmation(false);
  };
  const numberOfArticleText = "Nombre d'articles";
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <main className="container mx-auto font-poppins">
        <h1 className="mb-8 text-3xl font-bold text-neutral-950">
          Votre panier est vide
        </h1>
        <Link href="/">
          <div className="text-blue-500 hover:underline">
            Retour à la liste des produits
          </div>
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto grid grid-cols-1 font-poppins lg:grid-cols-3 lg:gap-8">
      <div className="col-span-2 max-w-fit">
        <h1 className="mb-8 text-3xl font-bold text-neutral-950">
          Votre panier
        </h1>
        <div className="space-y-4">
          {cart.map((item) => (
            <CartItem
              key={`${item.id}-${item.selectedSize}`}
              id={item.id}
              name={item.name}
              picture={item.picture}
              selectedSize={item.selectedSize}
              quantity={item.quantity}
              price={item.price}
              description={item.description}
              onQuantityChange={(quantity) =>
                updateQuantity(item.id, item.selectedSize, quantity)
              }
              onRemove={() => confirmRemoveItem(item.id, item.selectedSize)}
            />
          ))}
        </div>
      </div>
      <div className="col-span-1 mt-16 w-full">
        <div className="rounded-xl border-4 border-blue-300 p-5 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold">Récapitulatif</h2>
          <div className="flex items-center justify-between border-b-2 pb-2">
            <p className="text-gray-700">{numberOfArticleText}</p>
            <p className="text-gray-700">{totalItems}</p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-gray-700">Total :</p>
            <p className="text-gray-700">{totalPrice}€</p>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full rounded-full bg-neutral-900 p-4 text-white hover:bg-neutral-700"
          >
            Finaliser la commande
          </button>
          <Link href="/">
            <div className="mt-4 text-center text-neutral-900 hover:underline">
              Continuer vos achats
            </div>
          </Link>
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-11/12 rounded bg-white p-4 shadow-lg lg:w-1/2">
            <p>
              Êtes-vous sûr de vouloir supprimer cet article de votre panier?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCancelRemove}
                className="mr-2 rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleRemoveItem}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
