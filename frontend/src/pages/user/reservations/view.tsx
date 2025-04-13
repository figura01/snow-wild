import AuthContext from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import UseLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { GET_RESERVATIONS_BY_USER_ID } from "@/requetes/queries/reservation.queries";
import {
  Reservation,
  ReservationsByUserIdResponse,
  ReservationsByUserIdVariables,
} from "@/types/reservation";
import { Button } from "@/ui/Button";
import NoReservations from "@/user/components/reservation/NoReservations";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext } from "react";

export enum StatutReservation {
  AWAITING = "en_attente",
  CONFIRMATION = "confirmée",
  PAID = "payée",
  CANCEL = "annulée",
  FINISHED = "terminée",
}
const UserReservations = () => {
  const { user } = useContext(AuthContext);
  const { SetToLocalStorage, RemoveFromLocalStorage } = UseLocalStorage();
  const router = useRouter();
  const { data, loading, error } = useQuery<
    ReservationsByUserIdResponse,
    ReservationsByUserIdVariables
  >(GET_RESERVATIONS_BY_USER_ID, {
    variables: { reservationsByUserIdId: user?.userId?.toString() || "" },
    fetchPolicy: "no-cache",
  });
  const { setCart } = useCart();

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("fr-FR"); // Utilise 'fr-FR' pour un format français
    const formattedTime = date.toLocaleTimeString("fr-FR");
    return `${formattedDate} à ${formattedTime}`;
  };

  const handlePaiement = (reservation: Reservation) => {
    setCart([]);
    SetToLocalStorage("reservation", reservation);
    RemoveFromLocalStorage("cart");
    console.log(reservation.id);

    router.push(`/user/reservations/create/payment`);
  };
  const hasReservations =
    data?.reservationsByUserId && data.reservationsByUserId.length > 0;
  return (
    <main className="">
      <h1 className="m-4 text-center text-3xl font-bold">MES RESERVATIONS</h1>
      {!hasReservations && <NoReservations hasReservations={hasReservations} />}
      {data?.reservationsByUserId.map((reservation, index) => (
        <div
          key={reservation.id}
          className="mx-auto mb-8 w-11/12 rounded-lg border-4 border-blue-300 bg-white p-6 shadow-lg"
        >
          <div className="mb-4 border-b pb-4">
            <h2 className="mb-2 text-xl font-semibold">
              Reservation n°{index + 1}
            </h2>
            <div className="lg:flex lg:justify-between">
              <p>
                <span className="font-semibold">Début : </span>
                {formatDate(reservation.start_date)}
              </p>
              <p>
                <span className="font-semibold">Fin : </span>
                {formatDate(reservation.end_date)}
              </p>
              <p>
                <span className="font-semibold">Status : </span>
                {reservation.status}
              </p>
            </div>
          </div>
          <h3 className="mb-4 text-lg font-semibold">Matériel(s)</h3>
          <div
            className={cn(
              "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
              reservation.reservationMaterials.length > 1
                ? "h-96 overflow-y-scroll"
                : "",
            )}
          >
            {reservation.reservationMaterials.map((material) => (
              <div
                key={material.id}
                className="rounded-lg border p-4 shadow-sm"
              >
                <img
                  src={
                    process.env.NEXT_PUBLIC_IMAGE_URL +
                    material.material.picture
                  }
                  alt={material.material.name}
                  className="mb-4 h-32 w-96 rounded object-cover"
                />
                <p className="font-semibold">{material.material.name}</p>
                <p>Prix: ${material.price}</p>
                <p>Quantité: {material.quantity}</p>
                <p>Taille: {material.size}</p>
              </div>
            ))}
          </div>
          {reservation.status === StatutReservation.AWAITING && (
            <Button
              className="mx-2 mb-2 mt-8 rounded-full bg-neutral-900 text-white hover:bg-green-700"
              onClick={() => handlePaiement(reservation)}
            >
              Payer ma réservation
            </Button>
          )}
        </div>
      ))}
    </main>
  );
};

export default UserReservations;
