import { createMiddleware } from "@solidjs/start/middleware";

const API_AUTH_URL = process.env.API_AUTH;

function parseCookies(cookieHeader = "") {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    cookies[name] = rest.join("=");
    return cookies;
  }, {});
}

function serializeCookie(name, value, options = {}) {
  let cookieStr = `${name}=${value}`;
  if (options.path) cookieStr += `; Path=${options.path}`;
  if (options.httpOnly) cookieStr += `; HttpOnly`;
  if (options.maxAge) cookieStr += `; Max-Age=${options.maxAge}`;
  if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`;
  if (options.secure) cookieStr += `; Secure`;
  return cookieStr;
}

export default createMiddleware({
  async onRequest(event) {

    if (!API_AUTH_URL) {
      console.error("API_AUTH environment variable harus diisi");
      // Lebih baik hentikan request dengan response error daripada throw
      return new Response("API_AUTH env is missing", { status: 500 });
    }

    const cookieHeader = event.request.headers.get("cookie");

    const cookies = parseCookies(cookieHeader);
    const token = cookies.accessToken;

    const url = new URL(event.request.url);
    const pathname = url.pathname;

    const isAuthPage = pathname.startsWith("/auth");
    const isApiAuth = pathname.startsWith("/api/auth");

    if (isApiAuth) return; // Bypass middleware untuk API Auth

    if (!token) {
      if (!isAuthPage) {
        console.warn("No access token found, redirecting to login");
        return new Response(null, {
          status: 302,
          headers: { Location: "/auth/login" },
        });
      }
      return; // Jika di halaman auth dan tidak ada token, lanjutkan saja
    }

    try {
      const verifyResponse = await fetch(`${API_AUTH_URL}/api/verify-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Jika response gagal, coba baca pesan error dari body JSON
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => ({}));
        console.warn("Token verification failed:", errorData.message || verifyResponse.statusText);

        const expiredCookie = serializeCookie("accessToken", "", {
          path: "/",
          maxAge: 0,
          httpOnly: true,
          sameSite: "Lax",
        });

        if (!isAuthPage) {
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/auth/login",
              "Set-Cookie": expiredCookie,
            },
          });
        }

        return new Response(null, {
          status: 200,
          headers: {
            "Set-Cookie": expiredCookie,
          },
        });
      }

      if (isAuthPage) {
        console.info("User authenticated but accessing auth page, redirect to home");
        return new Response(null, {
          status: 302,
          headers: { Location: "/" },
        });
      }
    } catch (error) {
      console.error("Token verification error:", error);
      const expiredCookie = serializeCookie("accessToken", "", {
        path: "/",
        maxAge: 0,
        httpOnly: true,
        sameSite: "Lax",
      });
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/auth/login",
          "Set-Cookie": expiredCookie,
        },
      });
    }

    console.log("Access granted for:", pathname);
    return;
  },
});
