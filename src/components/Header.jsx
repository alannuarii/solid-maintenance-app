// Header.jsx
import { Show } from "solid-js";

export default function Header() {
  return (
    <header class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img src="/img/np.png" alt="Logo" height="40" class="d-inline-block align-text-top me-3" />
        </a>
        <button class="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
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
        </div>
      </div>
    </header>
  );
}
