// ResponsiveMenu.jsx
import { createSignal, onMount } from "solid-js";

export default function Menu() {
  // Tidak perlu state khusus, cukup andalkan kelas Bootstrap untuk responsive

  return (
    <>
      {/* Bottom Menu: hanya tampil di mobile (d-lg-none) */}
      <nav class="navbar fixed-bottom navbar-light bg-light d-lg-none">
        <div class="container justify-content-around">
          <a href="#" class="nav-link text-center">
            <i class="bi bi-house-fill"></i>
            <div>Home</div>
          </a>
          <a href="#" class="nav-link text-center">
            <i class="bi bi-search"></i>
            <div>Search</div>
          </a>
          <a href="#" class="nav-link text-center">
            <i class="bi bi-person-fill"></i>
            <div>Profile</div>
          </a>
        </div>
      </nav>

      {/* Sidebar: hanya tampil di desktop/tablet (d-none d-lg-block) */}
      {/* <aside
        class="d-none d-lg-block bg-light border-end"
        style={{
          width: "240px",
          height: "100vh",
          position: "fixed",
          top: "56px", // menyesuaikan tinggi header
          left: 0,
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        <nav class="nav flex-column">
          <a href="#" class="nav-link active">
            <i class="bi bi-house-fill"></i> Home
          </a>
          <a href="#" class="nav-link">
            <i class="bi bi-search"></i> Search
          </a>
          <a href="#" class="nav-link">
            <i class="bi bi-person-fill"></i> Profile
          </a>
        </nav>
      </aside> */}
    </>
  );
}
