import AuthContext from "@/contexts/AuthContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Button } from "@/ui/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useRef } from "react";

export default function DropdownUser({
  toggleDropdown,
  id,
}: {
  toggleDropdown: () => void;
  id: string;
}): JSX.Element {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, toggleDropdown, id);

  const handleConnect = () => {
    router.push("/auth/login");
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };
  const handleLogout = () => {
    logout();

    router.push("/auth/login");
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-16 z-50 mt-2 h-[100vh] w-full bg-white shadow-lg lg:right-6 lg:top-10 lg:h-min lg:w-96 lg:rounded-xl"
      onClick={toggleDropdown}
      id={id}
    >
      <div className="p-5">
        <h2 className="text-left text-2xl">Mon compte</h2>

        {user ? (
          <>
            <h3 className="mt-5 text-left text-lg">Bonjour {user.email}</h3>
            <div className="mb-5 mt-5 flex flex-col text-left">
              {user.role === "USER" ? (
                <>
                  <Link
                    href="/user/reservations/view"
                    className="mt-2 text-left text-black hover:text-gray-600"
                  >
                    Mes informations
                  </Link>
                  <Link
                    href="/user/reservations/view"
                    className="mt-2 text-left text-black hover:text-gray-600"
                  >
                    Mes réservations
                  </Link>
                  <Link
                    href="/user/reservations/view"
                    className="mt-2 text-left text-black hover:text-gray-600"
                  >
                    Mes factures
                  </Link>
                </>
              ) : (
                <Link
                  href="/admin/dashboard"
                  className="mt-2 text-left text-black hover:text-gray-600"
                >
                  Mon Dashboard
                </Link>
              )}
            </div>
            <Button
              onClick={handleLogout}
              className="mt-4 w-full cursor-pointer rounded-lg bg-black p-2 text-white hover:bg-neutral-100 hover:font-bold hover:text-neutral-950"
            >
              Je me déconnecte
            </Button>
          </>
        ) : (
          <>
            <h3 className="mt-5 text-left text-base">Déjà Snow wilder ?</h3>
            <p className="mt-2 text-left text-sm">
              Connectez-vous pour bénéficier d'une expérience personnalisée et
              accéder à vos offres et avantages.
            </p>
            <Button
              onClick={handleConnect}
              className="mt-4 w-full cursor-pointer rounded-lg bg-black p-2 text-white hover:bg-neutral-100 hover:font-bold hover:text-neutral-950"
            >
              Je me connecte
            </Button>
            {/* <AuthForm mode="login" /> ADD LATER THE FORM IN THE DROPDOWN */}

            <h3 className="mt-5 text-left text-base">
              Pas encore dans la team ?
            </h3>
            <Button
              onClick={handleRegister}
              className="mt-4 w-full cursor-pointer rounded-lg bg-black p-2 text-white hover:bg-neutral-100 hover:font-bold hover:text-neutral-950"
            >
              Je crée mon compte
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
