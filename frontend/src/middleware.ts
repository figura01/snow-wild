import { routes } from "@/routes";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface Payload {
  email: string;
  role: string;
  userId: string;
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";

export async function verify(token: string): Promise<Payload> {
  console.log("HOLA");

  const { payload } = await jwtVerify<Payload>(
    token,
    new TextEncoder().encode(JWT_SECRET_KEY)
  );
  console.log("PAYE", payload);

  return payload;
}

async function checkToken(token: string | undefined, request: NextRequest) {
  const currentRoute = findRouteByPathname(request.nextUrl.pathname);
  console.log("HELLO", token, currentRoute);
  let response = NextResponse.next();
  console.log("HELLO2");

  if (!token) {
    if (currentRoute && currentRoute.protected !== "PUBLIC") {
      response = NextResponse.redirect(new URL("/auth/login", request.url));
    }
    response.cookies.delete("email");
    response.cookies.delete("role");
    response.cookies.delete("userId");

    return response;
  }
  //On delete les cookies existants
  console.log("HELLO3");

  try {
    const { email, role, userId } = await verify(token);
    console.log("HELLO4");

    if (currentRoute?.protected === "ADMIN" && role !== "ADMIN") {
      response = NextResponse.redirect(new URL("/errors", request.url)); // redirige sur la Page error
    }

    if (email && role && userId) {
      //On vérifie que le role de l'utilisateur est "ADMIN" pour les routes "ADMIN"

      if (currentRoute?.protected === "ADMIN" && role !== "ADMIN") {
        response = NextResponse.redirect(new URL("/errors", request.url)); // Créer une page "Access denied"
      }

      //On ajoute des cookie avec les infos du user
      response.cookies.set("email", email);
      response.cookies.set("role", role);
      response.cookies.set("userId", userId);

      if (currentRoute?.protected === "ADMIN" && role === "ADMIN") {
        console.log(request.nextUrl.pathname);
      }

      return response;
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
    //penser au cas de figure où il a un token valide, il se rend sur une route admin, mais n'a pas le rôle admin pour y accéder => rediriger vers un "Not Authorized"
    // return NextResponse.redirect(new URL("/auth/login", request.url));
    // } catch (err) {
    //   console.log('%c⧭', 'color: #e50000', err);
    //   console.log("ERROR");
    //   if (request.nextUrl.pathname.startsWith("/auth/login")) {
    //     response = NextResponse.next();
    //   } else {
    //     response = NextResponse.redirect(new URL("/auth/login", request.url));
    //   }
    //   response.cookies.delete("token");//suppression du token s'il n'est pas valide (puisque l'on tombe dans le catch)

    //   return response;
    //
  } catch (err) {
    console.error("Verification echouée", err);
    response = NextResponse.redirect(new URL("/auth/login", request.url));
    //On delete les cookies existants
    response.cookies.delete("token");
    response.cookies.delete("email");
    response.cookies.delete("role");
    response.cookies.delete("userId");

    return response;
  }
}

function findRouteByPathname(url: string) {
  if (url === "/") {
    return routes.home;
  }
  // return url;
  const routeKeys = Object.keys(routes).filter((e) => e !== "home");
  for (const key of routeKeys) {
    if (url.includes(routes[key].pathname)) {
      console.log("routes[key].pathname: ", routes[key].pathname);
      return routes[key];
    }
  }
  return null;
}

export default async function middleware(request: NextRequest) {
  const authUser = request.cookies.get("authUser");
  let token = undefined;
  if (authUser && authUser.value) {
    token = JSON.parse(authUser?.value).token;
  }
  console.log("token", token);

  return await checkToken(token, request);
}

// // WITH AUTHUSER
// import { routes } from "@/routes";
// import { NextRequest, NextResponse } from "next/server";

// async function middleware(request: NextRequest) {
//   const authUser = request.cookies.get("authUser")?.value;
//   const currentRoute = findRouteByPathname(request.nextUrl.pathname);

//   let response = NextResponse.next();

//   if (!authUser) {
//     // Si l'utilisateur n'est pas authentifié, redirigez vers /auth/login
//     if (currentRoute && currentRoute.protected !== "PUBLIC") {
//       response = NextResponse.redirect(new URL("/auth/login", request.url));
//     }
//     response.cookies.delete("email");
//     response.cookies.delete("role");
//     response.cookies.delete("userId");
//     return response;
//   }

//   try {
//     const { email, role, userId } = JSON.parse(authUser);

//     // Vérification du rôle pour les routes protégées "ADMIN"
//     if (currentRoute?.protected === "ADMIN" && role !== "ADMIN") {
//       return NextResponse.redirect(new URL("/errors", request.url));
//     }

//     // Ajout des cookies avec les informations de l'utilisateur
//     response.cookies.set("email", email);
//     response.cookies.set("role", role);
//     response.cookies.set("userId", userId);

//     return response;
//   } catch (err) {
//     console.error("Erreur de vérification de l'utilisateur", err);
//     response = NextResponse.redirect(new URL("/auth/login", request.url));
//     // Suppression des cookies en cas d'échec
//     response.cookies.delete("email");
//     response.cookies.delete("role");
//     response.cookies.delete("userId");
//     return response;
//   }
// }

// // Fonction pour trouver la route correspondante à partir du pathname
// function findRouteByPathname(url: string) {
//   if (url === "/") {
//     return routes.home;
//   }
//   const routeKeys = Object.keys(routes).filter((e) => e !== "home");
//   for (const key of routeKeys) {
//     if (url.includes(routes[key].pathname)) {
//       return routes[key];
//     }
//   }
//   return null;
// }

// export default middleware;
