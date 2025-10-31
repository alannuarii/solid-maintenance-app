import { onMount, createSignal, Show } from "solid-js";
import { useParams, A } from "@solidjs/router";
import "./index.css";

export default function DetailMaterial() {
  const params = useParams();
  const [materials, setMaterials] = createSignal([]);

  onMount(async () => {
    try {
      const stockCode = params.detail;
      const response = await fetch(`/api/material/detail/${stockCode}`);
      const data = await response.json();
      setMaterials(data);

      console.log("Fetched Material Data:", data);
    } catch (error) {
      console.error("Failed to fetch material data:", error);
    }
  });

  const detailData = () => {
    const data = materials()[0];
    if (!data) return [];
    return [
      {
        label: "Stock Code",
        data: data.stock_code,
      },
      {
        label: "Nama Material",
        data: data.material_name,
      },
      {
        label: "Alias",
        data: data.alias || "-",
      },
      {
        label: "Deskripsi Material",
        data: data.description,
      },
      {
        label: "Mesin / Unit",
        data: `${data.engine || "Common"} #${data.engine_unit || "00"}`,
      },
      {
        label: "Stok Material",
        data: `100 ${data.unit}`,
      },
      {
        label: "Lokasi Material",
        data: data.location || "Gudang Material",
      },
      {
        label: "Keterangan",
        data: "-",
      },
    ];
  };

  const picture = () => {
    const data = materials()[0];
    if (data && data.picture) {
      return `/img/materials/${data.picture}`;
    }
    return "/img/materials/default.png";
  }

  return (
    <div class="detail-material container mt-4">
      <div class="text-center mb-3">
        <h3 class="title fw-bold">DETAIL MATERIAL</h3>
      </div>

      <Show when={detailData().length > 0} fallback={<div>Loading data...</div>}>
        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
          <A href="/" class="btn btn-sm btn-secondary">
            <i class="bi-box-arrow-in-right me-1"></i>Masuk
          </A>
          <A href="/" class="btn btn-sm btn-secondary">
            <i class="bi-box-arrow-right me-1"></i>Keluar
          </A>
          <A href={`/material/detail/${materials()[0].stock_code}/update`} class="btn btn-sm btn-secondary">
            <i class="bi-vr me-1"></i>Update
          </A>
          <A href="/" class="btn btn-sm btn-danger">
            <i class="bi-trash3 me-1"></i>Hapus
          </A>
        </div>
        <hr />
        <div class="row">
          <div class="col-md-3 mb-2">
            <img src={picture()} class="img-fluid rounded d-block mx-auto" alt="public/img/materials/${picture()}"></img>
          </div>
          <div class="col-md-5">
            {detailData().map((item) => (
              <div class="row mb-2">
                <label for="inputEmail3" class="col-sm-4 col-form-label">
                  {item.label}
                </label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" id="inputEmail3" value={item.data} disabled></input>
                </div>
              </div>
            ))}
          </div>
          <div class="col-md-4">
            <label for="inputEmail3" class=" col-form-label">
              Mutasi Material
            </label>
            <div class="table-responsive">
              <table class="table table-bordered text-center">
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Tanggal</th>
                    <th scope="col">Awal</th>
                    <th scope="col">Masuk</th>
                    <th scope="col">Keluar</th>
                    <th scope="col">Akhir</th>
                    <th scope="col">Ket</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>01-08-2025</td>
                    <td>95</td>
                    <td>5</td>
                    <td>0</td>
                    <td>100</td>
                    <td>Penyesuaian</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
