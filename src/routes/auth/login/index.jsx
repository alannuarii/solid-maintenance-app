import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import "./index.css";

export default function Login() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [errorMsg, setErrorMsg] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("email", email());
      formData.append("password", password());

      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data?.success) {
        navigate("/");
      } else {
        setErrorMsg(data?.error || "Gagal login.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="login-wrapper d-flex">
      <div class="right-panel d-flex flex-column justify-content-center align-items-center">
        <form onSubmit={handleLogin} class="login-form p-4 w-100">
          <div class="icon-user text-center text-light mb-4">
            <img src="/public/img/npwhite.png" width="250" alt="" />
            <h5>UP MINAHASA</h5>
            <h6>ULPLTD TAHUNA</h6>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label visually-hidden">
              Username
            </label>
            <input id="email" type="email" placeholder="Username" class="form-control form-control-lg" required autocomplete="username" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label visually-hidden">
              Password
            </label>
            <input id="password" type="password" placeholder="Password" class="form-control form-control-lg" required autocomplete="current-password" value={password()} onInput={(e) => setPassword(e.currentTarget.value)} />
          </div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="rememberMe" />
              <label class="form-check-label" for="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#" class="text-dark text-decoration-none">
              Forgot Password?
            </a>
          </div>
          <button type="submit" class="btn btn-dark btn-lg fw-bold w-100" disabled={loading()}>
            {loading() ? "Memproses..." : "LOGIN"}
          </button>
          {errorMsg() && <p class="text-danger mt-3 text-center">{errorMsg()}</p>}
        </form>
      </div>
    </div>
  );
}
