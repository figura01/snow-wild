import Link from "next/link";

export default function NoReservations({
  hasReservations,
}: {
  hasReservations: boolean | undefined;
}) {
  return (
    <>
      <p>Pas de reservation pour le moment</p>
      <Link href={"/products"} className="text-blue-500 hover:underline">
        Visitez notre boutique
      </Link>
    </>
  );
}
