import { REGISTER } from "@/requetes/mutations/auth.mutations";
import { RegisterInput } from "@/types/auth";
import AuthForm from "@/user/components/AuthForm";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

function Register() {
  const router = useRouter();
  const [register, { data, loading, error }] = useMutation(REGISTER);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formDataObject = Object.fromEntries(formData.entries());
    const data = formDataObject as unknown as RegisterInput;

    if (
      data.email &&
      data.password &&
      data.lastName &&
      data.firstName &&
      data.phone
    ) {
      try {
        const response = await register({
          variables: {
            infos: {
              email: data.email,
              password: data.password,
              lastName: data.lastName,
              firstName: data.firstName,
              phone: data.phone,
            },
          },
        });

        if (response.data) {
          router.push("/success");
        }
      } catch (err) {
        console.error("Error registering user:", err);
      }
    } else {
      console.error("All fields are required");
    }
  };

  const errorWhenRegisterText = `Erreur lors de l'inscription`;

  return (
    <AuthForm mode="register" />
    // <main className="m-0 flex min-h-3/4 flex-col items-center justify-center p-8 font-poppins">
    //   <form
    //     onSubmit={handleSubmit}
    //     className="w-1/2 rounded-lg bg-white p-8 shadow-md"
    //   >
    //     <h1 className="mb-10 text-center text-2xl font-bold text-black">
    //       Inscription
    //     </h1>
    //     <div className="mb-6">
    //       <input
    //         type="text"
    //         name="firstName"
    //         placeholder="Prénom"
    //         className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
    //         required
    //       />
    //     </div>
    //     <div className="mb-6">
    //       <input
    //         type="text"
    //         name="lastName"
    //         placeholder="Nom"
    //         className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
    //         required
    //       />
    //     </div>
    //     <div className="mb-6">
    //       <input
    //         type="email"
    //         name="email"
    //         placeholder="Indiquez votre email"
    //         className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
    //         required
    //       />
    //     </div>
    //     <div className="mb-6">
    //       <input
    //         type="password"
    //         name="password"
    //         placeholder="Indiquez votre mot de passe"
    //         className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
    //         required
    //       />
    //     </div>
    //     <div className="mb-6">
    //       <input
    //         type="tel"
    //         name="phone"
    //         placeholder="06..."
    //         className="w-full rounded-lg border px-4 py-2 text-black placeholder-gray-500"
    //         required
    //       />
    //     </div>
    //     <input
    //       type="submit"
    //       value="S'inscrire"
    //       className="w-1/2 cursor-pointer rounded-lg bg-black py-2 text-white hover:bg-neutral-100 hover:font-bold hover:text-neutral-950"
    //       style={{ display: "block", margin: "0 auto" }}
    //     />
    //   </form>
    //   {loading && <p className="text-center">Inscription en cours...</p>}
    //   {error && (
    //     <p className="text-center text-red-500">
    //       {errorWhenRegisterText} : {error.message}
    //     </p>
    //   )}
    //   {data && (
    //     <p className="text-center text-blue-500">Inscription réussie!</p>
    //   )}
    //   <div className="mt-8 text-center">
    //     <Link
    //       href="/auth/reset"
    //       className="block text-black hover:text-gray-600"
    //     >
    //       Mot de passe oublié?
    //     </Link>
    //     <Link
    //       href="/auth/login"
    //       className="mt-2 block text-black hover:text-gray-600"
    //     >
    //       Déjà inscrit ? Connectez-vous
    //     </Link>
    //   </div>
    // </main>
  );
}

export default Register;
