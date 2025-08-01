import { onMount, createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import "./index.css";

export default function ListMaterial() {
  const [materials, setMaterials] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 20;

  onMount(async () => {
    try {
      const response = await fetch("/api/material/list");
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error("Failed to fetch material data:", error);
    }
  });

  const totalPages = () => Math.ceil(materials().length / itemsPerPage);

  const currentMaterials = () => {
    const start = (currentPage() - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return materials().slice(start, end);
  };

  // Fungsi handle klik pagination Prev dan Next
  const goPrev = () => {
    if (currentPage() > 1) setCurrentPage(currentPage() - 1);
  };

  const goNext = () => {
    if (currentPage() < totalPages()) setCurrentPage(currentPage() + 1);
  };

  return (
    <div class="list-material container mt-4">
      <div class="text-center mb-3">
        <h3 class="title fw-bold">DAFTAR MATERIAL</h3>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered text-center">
          <thead>
            <tr>
              <th class="align-middle">No</th>
              <th class="align-middle">Stock Code</th>
              <th class="align-middle">Nama Material </th>
              <th class="align-middle">Alias</th>
              <th class="align-middle">Description</th>
              <th class="align-middle">Satuan</th>
              <th class="align-middle">Persediaan</th>
              <th class="align-middle">Action</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={currentMaterials().length > 0}
              fallback={
                <tr>
                  <td colSpan="5" class="text-center">
                    Loading data...
                  </td>
                </tr>
              }
            >
              {currentMaterials().map((material, index) => (
                <tr>
                  <td class="align-middle">{index + 1}</td>
                  <td class="align-middle">{material.stock_code}</td>
                  <td class="text-start align-middle">{material.material_name}</td>
                  <td class="align-middle">{material.alias || `-`}</td>
                  <td class="text-start align-middle">{material.description}</td>
                  <td class="align-middle">{material.unit}</td>
                  <td class="align-middle">0</td>
                  <td>
                    <A href={`/material/detail/${material.stock_code}`} class="btn btn-primary btn-sm">
                      Detail
                    </A>
                  </td>
                </tr>
              ))}
            </Show>
          </tbody>
        </table>
      </div>

      {/* Pagination Bootstrap dengan Prev, current, dan Next */}
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class={`page-item ${currentPage() === 1 ? "disabled" : ""}`}>
            <a
              class="page-link"
              href="#"
              tabindex={currentPage() === 1 ? -1 : 0}
              onClick={(e) => {
                e.preventDefault();
                goPrev();
              }}
            >
              Previous
            </a>
          </li>
          <li class="page-item active" aria-current="page">
            <a class="page-link" href="#">
              Page {currentPage()}
            </a>
          </li>
          <li class={`page-item ${currentPage() === totalPages() ? "disabled" : ""}`}>
            <a
              class="page-link"
              href="#"
              tabindex={currentPage() === totalPages() ? -1 : 0}
              onClick={(e) => {
                e.preventDefault();
                goNext();
              }}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
