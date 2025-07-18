import { createSignal, onMount } from "solid-js";

export default function Header() {
  const [offcanvasId] = createSignal("offcanvasNavbar");

  // Fungsi untuk menutup Offcanvas
  function closeOffcanvas() {
    const offcanvasEl = document.getElementById(offcanvasId());
    if (!offcanvasEl) return;
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  }

  return (
    <div class="header">
      <header class="navbar navbar-light bg-dark-subtle fixed-top shadow-sm">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            <img src="/img/np.png" alt="Logo" height="40" class="d-inline-block align-text-top me-3" />
          </a>

          {/* Tombol toggle Offcanvas muncul hanya di mobile (xs-sm) */}
          <button
            class="navbar-toggler d-md-none" // tampilkan hanya di bawah md
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target={`#${offcanvasId()}`}
            aria-controls={offcanvasId()}
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          {/* Navigasi navbar biasa muncul di md ke atas */}
          <nav class="d-none d-md-flex ms-auto">
            <ul class="navbar-nav flex-row gap-3">
              <li class="nav-item">
                <a class="nav-link active" href="/preventive">
                  Preventive Maintenance
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#">
                  Periodic Maintenance
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="/material">
                  Material
                </a>
              </li>
            </ul>
          </nav>

          {/* Offcanvas menu untuk mobile */}
          <div class="offcanvas offcanvas-end d-md-none" tabindex="-1" id={offcanvasId()} aria-labelledby={`${offcanvasId()}Label`}>
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id={`${offcanvasId()}Label`}>
                Menu
              </h5>
              <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item fw-bold">Preventive Maintenance</li>
                <a href="/preventive" class="list-group-item list-group-item-action ms-3" onClick={closeOffcanvas}>
                  Jadwal PM
                </a>
                <a href="/preventive/realisasi/input" class="list-group-item list-group-item-action ms-3" onClick={closeOffcanvas}>
                  Input Realisasi PM
                </a>
                <li class="list-group-item fw-bold">Periodic maintenance</li>
                <li class="list-group-item fw-bold">Material</li>
                <a href="/material" class="list-group-item list-group-item-action ms-3" onClick={closeOffcanvas}>
                  Rencana Fast Moving
                </a>
                <a href="/" class="list-group-item list-group-item-action ms-3" onClick={closeOffcanvas}>
                  Input Pemakaian Material
                </a>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
