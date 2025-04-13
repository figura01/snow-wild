import AuthContext from "@/contexts/AuthContext";
import { LOGIN } from "@/requetes/queries/auth.queries";
import { InputLogin } from "@/types/auth";
import AuthForm from "@/user/components/AuthForm";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext } from "react";

function Login() {
  const { user, setAuthUser, logout } = useContext(AuthContext);
  const router = useRouter();
  const [login, { data, error }] = useMutation(LOGIN);

  const handleLogout = () => {
    logout();

    router.push("/auth/login");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as unknown as InputLogin;
    console.log("data send", data);
    if (data.email && data.password) {
      login({
        variables: { infos: { email: data.email, password: data.password } },
        onCompleted: (data) => {
          console.log("completed and received", data);
          if (data) {
            setAuthUser({
              userId: data.login.id,
              email: data.login.email,
              role: data.login.role,
              token: data.login.token,
            });
            const redirectTo = router.query.redirect || "/";
            if (data?.login?.role === "ADMIN") {
              console.log("DataLogin to Admin", data?.login.role);
              router.push("/admin/dashboard");
            } else {
              router.push(redirectTo as string);
            }
          }
        },
      });
    }
  };

  // if (user) {
  //   return (
  //     <main className="flex min-h-3/4 m-8 flex-col items-center justify-center p-8 font-poppins">
  //       <h1 className="font-bold text-center text-2xl mb-10 text-black">
  //         Bonjour, {user.email}!
  //       </h1>
  //       <a> Mes réservation </a>
  //       <button
  //         onClick={handleLogout}
  //         className="w-1/2 bg-black text-white py-2 rounded-lg hover:bg-neutral-100 hover:text-neutral-950 hover:font-bold cursor-pointer"
  //         style={{ display: "block", margin: "0 auto" }}
  //       >
  //         Déconnexion
  //       </button>
  //     </main>
  //   );
  // }

  return (
    <AuthForm mode="login" />
    // <main className="m-0 flex min-h-3/4 flex-col items-center justify-center p-8 font-poppins">
    //   <form
    //     onSubmit={handleSubmit}
    //     className="rounded-lg bg-white p-8 shadow-md md:w-1/2"
    //   >
    //     <h1 className="mb-10 text-center text-2xl font-bold text-black">
    //       Connexion
    //     </h1>
    //     <div className="mb-10">
    //       <input
    //         type="text"
    //         name="email"
    //         placeholder="Indiquez votre email"
    //         className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
    //       />
    //     </div>
    //     <div className="mb-10">
    //       <input
    //         type="password"
    //         name="password"
    //         placeholder="Indiquez votre mot de passe"
    //         className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
    //       />
    //     </div>
    //     <input
    //       type="submit"
    //       value="Connection"
    //       className="w-1/2 cursor-pointer rounded-lg bg-black py-2 text-white hover:bg-neutral-100 hover:font-bold hover:text-neutral-950"
    //       style={{ display: "block", margin: "0 auto" }}
    //     />
    //     <div className="mt-8 text-center">
    //       <span className="block text-red-500">{error?.message}</span>
    //       {data?.login?.success ? (
    //         <span className="block text-blue-500">{data?.login?.message}</span>
    //       ) : (
    //         <span className="block text-red-500">{data?.login?.message}</span>
    //       )}
    //     </div>
    //     <div className="mt-8 text-center">
    //       <Link
    //         href="/auth/reset"
    //         className="block text-black hover:text-gray-600"
    //       >
    //         Mot de passe oublié?
    //       </Link>
    //       <Link
    //         href="/auth/register"
    //         className="mt-2 block text-black hover:text-gray-600"
    //       >
    //         Pas encore inscrit ?
    //       </Link>
    //     </div>
    //   </form>
    // </main>
  );
}

export default Login;
