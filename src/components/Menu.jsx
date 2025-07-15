import { A } from "@solidjs/router";
import { createSignal } from "solid-js";

export default function Menu() {
  // State untuk menu desktop floating
  const [menuVisible, setMenuVisible] = createSignal(false);

  // Daftar menu
  const menuItems = [
    { label: "Home", icon: "bi bi-house-fill", to: "/" },
    { label: "Profile", icon: "bi bi-person-fill", to: "#" },
    { label: "Logout", icon: "bi-box-arrow-right", to: "#" },
  ];

  // Style dinamis untuk container menu floating
  const menuStyle = {
    bottom: "60px",
    left: "10px",
    minWidth: "180px",
    backgroundColor: "white",
    borderRadius: "0.25rem",
    boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    zIndex: 1100,
  };

  return (
    <>
      {/* Bottom Menu: hanya tampil di mobile */}
      <nav class="navbar fixed-bottom navbar-light bg-light d-lg-none shadow-lg">
        <div class="container justify-content-around">
          {menuItems.map((item) => (
            <a href={item.to} class="nav-link text-center text-dark">
              <i class={item.icon}></i>
              <div>{item.label}</div>
            </a>
          ))}
        </div>
      </nav>

      {/* Desktop Floating Menu Button dan Dropdown */}
      <div class="d-none d-lg-block">
        <button
          class="btn btn-secondary position-fixed bottom-0 start-0 m-2 rounded-circle"
          style={{ width: "40px", height: "40px", fontSize: "16px", zIndex: 1100 }}
          onClick={() => setMenuVisible(!menuVisible())}
          aria-label="Toggle navigation menu"
          classList={{ rotate: menuVisible() }}
        >
          ☰
        </button>

        {/* Menu muncul/hilang dengan animasi */}
        <Show when={menuVisible()}>
          <div class="position-fixed start-0 p-2 d-flex flex-column" style={menuStyle}>
            {menuItems.map((item) => (
              <A href={item.to} class="mb-1 py-2 px-3 bg-white border rounded card-menu d-block text-decoration-none text-dark" onClick={() => setMenuVisible(false)} tabIndex={0} role="button">
                <i class={item.icon + " me-2"}></i>
                {item.label}
              </A>
            ))}
          </div>
        </Show>
      </div>

      <style>{`
        .card-menu:hover {
          background-color: #e9f5ff;
          border-color: #0d6efd;
        }
        .card-menu:focus {
          outline: 2px solid #0d6efd;
          outline-offset: 2px;
        }
        .rotate {
          transform: rotate(90deg);
          transition: transform 0.3s ease;
        }
        // Animasi fade-slide-up
        .fade-slide-up-enter-active {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .fade-slide-up-enter-from {
          opacity: 0;
          transform: translateY(15px);
        }
        .fade-slide-up-enter-to {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-slide-up-leave-active {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .fade-slide-up-leave-from {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-slide-up-leave-to {
          opacity: 0;
          transform: translateY(15px);
        }
      `}</style>
    </>
  );
}
