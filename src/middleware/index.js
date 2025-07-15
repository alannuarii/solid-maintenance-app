import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie, deleteCookie } from "vinxi/http";

export default createMiddleware({
  async onRequest(event) {
    console.log("Middleware onRequest triggered");
    const apiAuthUrl = process.env.API_AUTH;
    if (!apiAuthUrl) {
      console.error("API_AUTH environment variable harus diisi");
      throw new Error("API_AUTH env is missing");
    }

    // Logging header cookie dari request untuk debugging
    console.log("Cookies header:", event.request.headers.get("cookie"));

    // Ambil token cookie secara eksplisit
    const token = getCookie(event, "accessToken") || null;
    console.log("AccessToken extracted from cookie:", token);

    const url = new URL(event.request.url);
    const pathname = url.pathname;

    const isAuthPage = pathname.startsWith("/auth");
    const isApiAuth = pathname.startsWith("/api/auth");

    if (isApiAuth) return; // biarkan API auth request lolos tanpa cek

    if (!token && !isAuthPage) {
      console.warn("No access token found, redirecting to /auth/login");
      return new Response(null, {
        status: 302,
        headers: {
          Location: new URL("/auth/login", event.request.url).toString(),
        },
      });
    }

    if (token) {
      try {
        const verifyResponse = await fetch(`${apiAuthUrl}/api/verify-token`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!verifyResponse.ok) {
          console.warn("Token verification failed, deleting cookie and redirecting");
          deleteCookie(event, "accessToken");
          return new Response(null, {
            status: 302,
            headers: {
              Location: new URL("/auth/login", event.request.url).toString(),
            },
          });
        }

        if (isAuthPage) {
          console.info("User already logged in and accessing auth page, redirecting to root /");
          return new Response(null, {
            status: 302,
            headers: {
              Location: new URL("/", event.request.url).toString(),
            },
          });
        }
      } catch (error) {
        console.error("Error saat verifikasi token:", error);
        deleteCookie(event, "accessToken");
        return new Response(null, {
          status: 302,
          headers: {
            Location: new URL("/auth/login", event.request.url).toString(),
          },
        });
      }
    }

    // Lanjutkan request jika tidak ada kondisi redirect
    console.log("Access granted, continue to requested page");
    return;
  },
});
