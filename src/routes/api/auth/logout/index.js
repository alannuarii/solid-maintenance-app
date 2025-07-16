import { serialize } from "cookie";

export async function GET() {

  const expiredCookie = serialize("accessToken", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true, // true di produksi, false di development
    expires: new Date(0),
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/auth/login",
      "Set-Cookie": expiredCookie,
    },
  });
}
