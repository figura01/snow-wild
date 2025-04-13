/* eslint-disable @next/next/no-img-element */
import { useCart } from "@/contexts/CartContext";
import StepperFormActions from "../reservation/ReservationActions";
import { useStepper } from "../stepper";
import CartItem from "./CartItem";
export default function CartWithoutActions({
  handleSubmit,
}: {
  handleSubmit: () => Promise<void>;
}) {
  const { cart } = useCart();
  const { nextStep } = useStepper();
  const handleSubmitAndNextStep = () => {
    handleSubmit();
    nextStep();
  };

  const numberOfArticleText = "Nombre d'articles";
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return (
    <>
      <main className="container mx-auto px-4 py-8 font-poppins grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 ">
          <h1 className="text-3xl text-neutral-950 font-bold mb-8 mt-8">
            Votre panier
          </h1>
          <div className="space-y-4 rounded-lg  ">
            {cart.map((item, index) => (
              <CartItem
                key={`${item.id}-${item.selectedSize}`}
                id={item.id}
                name={item.name}
                picture={item.picture}
                selectedSize={item.selectedSize}
                quantity={item.quantity}
                price={item.price}
                description={item.description}
              />
            ))}
          </div>
        </div>
        <div className="col-span-1 mt-[99px]">
          <div className=" p-5  border-4 border-blue-300 rounded-lg shadow-lg ">
            <h2 className="text-2xl font-bold mb-4">Récapitulatif</h2>
            <div className="flex justify-between mt-6 items-center border-b-2 pb-2">
              <p className="text-gray-700">{numberOfArticleText}</p>
              <p className="text-gray-700">{totalItems}</p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <p className="text-gray-700">Total :</p>
              <p className="text-gray-700">{totalPrice}€</p>
            </div>
            <StepperFormActions handleSubmit={handleSubmitAndNextStep} />
          </div>
        </div>
      </main>
    </>
  );
}
