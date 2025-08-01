import { onMount, createSignal, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import "./index.css";

export default function UpdateDetailMaterial() {
  const params = useParams();
  const [materials, setMaterials] = createSignal([]);
  const [previewImg, setPreviewImg] = createSignal("");

  onMount(async () => {
    try {
      const stockCode = params.detail;
      const response = await fetch(`/api/material/detail/${stockCode}`);
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error("Failed to fetch material data:", error);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPreviewImg("");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImg(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const detailData = () => {
    const data = materials()[0];
    if (!data) return [];
    return {
      filled: [
        {
          label: "Stock Code",
          data: data.stock_code,
        },
        {
          label: "Nama Material",
          data: data.material_name,
        },
        {
          label: "Deskripsi Material",
          data: data.description,
        },
      ],
      notFilled: [
        {
          label: "Alias",
          data: data.alias,
        },
        {
          label: "Mesin",
          data: data.engine,
        },
        {
          label: "Unit",
          data: data.engine_unit,
        },
        {
          label: "Lokasi Material",
          data: data.location,
        },
        {
          label: "Stok Awal",
          data: 0,
        },
        {
          label: "Keterangan",
          data: data.remarks,
        },
      ],
    };
  };

  return (
    <div class="update-detail-material container mt-4">
      <div class="text-center mb-3">
        <h3 class="title fw-bold">UPDATE DATA MATERIAL</h3>
      </div>

      <Show when={materials().length > 0} fallback={<div>Loading data...</div>}>
        <div class="row">
          <div class="col-md-4">
            {detailData().filled.map((item) => (
              <div class="mb-2">
                <label for="exampleFormControlInput1" class="form-label fw-bold">
                  {item.label}
                </label>
                <input type="email" class="form-control" id="exampleFormControlInput1" value={item.data} disabled></input>
              </div>
            ))}
          </div>
          <div class="col-md-5">
            {detailData().notFilled.map((item) => (
              <div class="mb-2">
                <label for="exampleFormControlInput1" class="form-label fw-bold">
                  {item.label}
                </label>
                <input type="email" class="form-control" id="exampleFormControlInput1" value={item.data}></input>
              </div>
            ))}
          </div>
          <div class="col-md-3">
            <div class="mb-2">
              <label for="upload-photo" class="form-label fw-bold">
                Foto Material
              </label>
              <input type="file" class="form-control" id="upload-photo" accept="image/*" onChange={handleFileChange} />
            </div>
            <div>
              <Show when={previewImg()}>
                <img src={previewImg()} alt="Preview Foto Material" style={{ width: "100%", "margin-top": "10px", "border-radius": "8px" }} />
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
