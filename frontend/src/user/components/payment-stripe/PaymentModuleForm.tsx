import UseLocalStorage from "@/hooks/useLocalStorage";
import { Button } from "@/ui/Button";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React from "react";

function PaymentModuleForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { RemoveFromLocalStorage } = UseLocalStorage();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_FRONT_URL}/payment/success`,
      },
    });

    if (result.error) {
      // window.location.href = `${process.env.NEXT_PUBLIC_FRONT_URL}/payment/canceled`;
      console.log(result.error.message);
    }
  };

  const deleteLS = () => {
    RemoveFromLocalStorage("reservation");
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        onClick={deleteLS}
        disabled={!stripe || !elements}
        className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white"
      >
        {stripe || elements ? "Procéder au paiement" : "Veuillez patienter"}
      </Button>
    </form>
  );
}

export default PaymentModuleForm;
