import AuthContext from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useDate } from "@/contexts/DateContext";
import UseLocalStorage from "@/hooks/useLocalStorage";
import { CREATE_RESERVATION } from "@/requetes/mutations/reservation.mutations";
import ReservationDateStep from "@/user/components/reservation/ReservationDateStep";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function BookingReservation() {
  const router = useRouter();
  const [createReservation] = useMutation(CREATE_RESERVATION);
  const { formInfos } = useDate();
  const { cart } = useCart();
  const { user } = useContext(AuthContext);
  const { SetToLocalStorage } = UseLocalStorage();
  const reservationMaterials = cart.map((item) => ({
    materialId: item.id,
    quantity: item.quantity,
    size: item.selectedSize,
  }));
  const handleSubmit = async () => {
    if (reservationMaterials.length === 0) {
      console.error("Error: No materials to reserve.");
      router.push("/");
      return;
    }

    try {
      const response = await createReservation({
        variables: {
          data: {
            start_date: formInfos.start_date,
            end_date: formInfos.end_date,
            materials: reservationMaterials,
            user: {
              id: user?.userId,
            },
          },
        },
      });
      console.log("Reservation created successfully:", response.data);
      const reservationId = response.data.createReservation.id;
      SetToLocalStorage("reservationId", reservationId);
      router.push("/user/reservations/create/payment");
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };
  return (
    <main>
      <ReservationDateStep handleSubmit={handleSubmit} />
    </main>
  );
}
