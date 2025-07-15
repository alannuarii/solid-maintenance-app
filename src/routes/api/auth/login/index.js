import { setCookie } from "vinxi/http";

export async function POST(event) {
    try {
        // Ambil body sebagai form-data dari frontend
        const formData = await event.request.formData();

        // Buat objek FormData baru untuk dikirim ke API eksternal
        const externalFormData = new FormData();

        for (const [key, value] of formData.entries()) {
            externalFormData.append(key, value);
        }

        // Kirim form-data ke API eksternal tanpa mengubahnya ke JSON
        const res = await fetch(`${process.env.API_AUTH}/api/login`, {
            method: "POST",
            // Jangan set Content-Type header manual agar fetch otomatis set boundary form-data
            body: externalFormData,
        });


        if (!res.ok) {
            // Jika server eksternal error
            const errorData = await res.json().catch(() => ({}));
            return new Response(
                JSON.stringify({
                    error: errorData.message || "Login gagal dari server eksternal.",
                }),
                {
                    status: res.status,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const result = await res.json();
        console.log("Login result from external API:", result.access_token);

        if (result.access_token) {
            // Set cookie token dari response eksternal
            setCookie(event, "accessToken", result.access_token, {
                path: "/",
                httpOnly: true,
                sameSite: "strict", // coba 'lax' dulu, 'strict' kadang terlalu ketat
                maxAge: 60 * 60 * 24,
                secure: false, // jangan pakai secure di localhost/non-HTTPS
            });


            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Jika tidak ada token yang dikembalikan
        return new Response(
            JSON.stringify({ error: result.message || "Token tidak ditemukan." }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error in login API:", error);
        return new Response(
            JSON.stringify({ error: "Terjadi kesalahan saat login." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
