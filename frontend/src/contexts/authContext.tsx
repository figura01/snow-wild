import { LOGOUT } from "@/requetes/queries/auth.queries";
import { toast } from "@/ui/use-toast";
import { useLazyQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
type UserType = {
  email: string | undefined;
  userId: string | undefined;
  role: string | undefined;
  token: string | undefined;
};

const COOKIE_KEY = "authUser";

const AuthContext = createContext<{
  user: UserType | null;
  setAuthUser: ({
    userId,
    email,
    role,
    token,
  }: {
    userId: string;
    email: string;
    role: string;
    token: string;
  }) => void;
  logout: () => void;
  authReady: boolean;
}>({
  user: null,
  setAuthUser: () => {},
  logout: () => {},
  authReady: false,
});
export default AuthContext;
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [userLogout] = useLazyQuery(LOGOUT);
  const setAuthUser = ({
    userId,
    role,
    email,
    token,
  }: {
    userId: string;
    email: string;
    role: string;
    token: string;
  }) => {
    const userData = { userId, email, role, token };
    setUser(userData);
    console.log("auth context setting cookies", userData);
    Cookies.set(COOKIE_KEY, JSON.stringify(userData), { expires: 7 });
  };
  useEffect(() => {
    const storedUser = Cookies.get(COOKIE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setAuthReady(true); // Indique que l'état d'authentification est prêt
  }, []);

  const logout = () => {
    // Nettoyer le localStorage lors de la déconnexio
    userLogout({
      onCompleted: (data) => {
        console.log("user Logout: ", data);
        setUser(null);
        Cookies.remove(COOKIE_KEY);
        Cookies.remove("userId");
        Cookies.remove("role");
        Cookies.remove("email");
        Cookies.remove("token");
        toast({
          title: "Logout",
          description: data.logout.message,
        });
        router.push("/");
      },
    });
  };

  return (
    <AuthContext.Provider value={{ user, setAuthUser, logout, authReady }}>
      {children}
    </AuthContext.Provider>
  );
};
