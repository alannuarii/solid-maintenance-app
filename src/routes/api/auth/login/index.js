export async function POST(event) {
    try {
        const formData = await event.request.formData();

        // Buat objek FormData baru untuk diteruskan ke API eksternal
        const externalFormData = new FormData();
        for (const [key, value] of formData.entries()) {
            externalFormData.append(key, value);
        }

        // Kirim form-data ke API eksternal tanpa set Content-Type, biarkan otomatis
        const res = await fetch(`${process.env.API_AUTH}/api/login`, {
            method: "POST",
            body: externalFormData,
        });

        const data = await res.json();

        if (!res.ok) {
            return new Response(JSON.stringify({ error: data.message || "Login failed" }), {
                status: res.status,
                headers: { "Content-Type": "application/json" },
            });
        }

        const accessToken = data.access_token;
        console.log("Access Token:", accessToken);

        // Serialize cookie secara manual, tambah HttpOnly dan Max-Age agar lebih aman dan tahan lama
        const cookie = `accessToken=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;


        return new Response(
            JSON.stringify({
                success: true,
                message: "Login berhasil",
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": cookie,
                },
            }
        );
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message || "Terjadi kesalahan" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
