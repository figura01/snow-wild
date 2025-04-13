import AuthContext from "@/contexts/AuthContext";
import { REGISTER } from "@/requetes/mutations/auth.mutations";
import { LOGIN } from "@/requetes/queries/auth.queries";
import { InputLogin, RegisterInput } from "@/types/auth";
import { Button } from "@/ui/Button";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

interface AuthFormProps {
  mode: "login" | "register";
}

function AuthForm({ mode }: AuthFormProps) {
  const { setAuthUser, logout } = useContext(AuthContext);
  const router = useRouter();
  const [login] = useMutation(LOGIN);
  const [register] = useMutation(REGISTER);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (mode === "login") {
      // Handling login
      const loginData = data as unknown as InputLogin;
      if (loginData.email && loginData.password) {
        try {
          const response = await login({
            variables: {
              infos: { email: loginData.email, password: loginData.password },
            },
          });
          setAuthUser({
            userId: response.data.login.id,
            email: response.data.login.email,
            role: response.data.login.role,
            token: response.data.login.token,
          });
          console.log("ROUTER", router);

          router.push(
            response.data.login.role === "ADMIN"
              ? "/admin/dashboard"
              : router.query.redirect
                ? (router.query.redirect as string)
                : "/",
          );
        } catch (err) {
          setError("Login failed. Please try again.");
        }
      }
    } else {
      // Handling registration
      const registerData = data as unknown as RegisterInput;
      if (
        registerData.email &&
        registerData.password &&
        registerData.firstName &&
        registerData.lastName &&
        registerData.phone
      ) {
        try {
          const response = await register({
            variables: { infos: registerData },
          });
          router.push("/success");
        } catch (err) {
          setError("Registration failed. Please try again.");
        }
      }
    }
    setLoading(false);
  };

  return (
    <main className="m-0 flex min-h-3/4 flex-col items-center justify-center font-poppins">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-8 shadow-md md:w-1/2"
      >
        <h1 className="mb-10 text-center text-2xl font-bold text-black">
          {mode === "login" ? "Connexion" : "Inscription"}
        </h1>

        {mode === "register" && (
          <>
            <div className="mb-6">
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="text"
                name="lastName"
                placeholder="Nom"
                className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="tel"
                name="phone"
                placeholder="06..."
                className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
                required
              />
            </div>
          </>
        )}

        <div className="mb-6">
          <input
            type="email"
            name="email"
            placeholder="Indiquez votre email"
            className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Indiquez votre mot de passe"
            className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
            required
          />
        </div>
        <Button
          type="submit"
          value={mode === "login" ? "Connexion" : "S'inscrire"}
          className="w-1/2 cursor-pointer rounded-lg bg-black py-2 text-white hover:bg-neutral-100 hover:font-bold hover:text-neutral-950"
          style={{ display: "block", margin: "0 auto" }}
        >
          {mode === "login" ? "Connexion" : "S'inscrire"}
        </Button>
      </form>

      {loading && <p className="text-center">Chargement...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="mt-8 text-center">
        {mode === "login" && (
          <>
            <Link href="/auth/reset">
              <div className="block text-black hover:text-gray-600">
                Mot de passe oublié?
              </div>
            </Link>
            <Link href="/auth/register">
              <div className="block text-black hover:text-gray-600">
                Pas encore inscrit ?
              </div>
            </Link>
          </>
        )}
        {mode === "register" && (
          <Link href="/auth/login">
            <div className="mt-2 block text-black hover:text-gray-600">
              Déjà inscrit ? Connectez-vous
            </div>
          </Link>
        )}
      </div>

      {}
    </main>
  );
}

export default AuthForm;
