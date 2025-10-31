import { onMount, createSignal, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { toast, Toaster } from "solid-toast";
import "./index.css";

export default function UpdateDetailMaterial() {
  const params = useParams();
  const [materials, setMaterials] = createSignal([]);
  const [previewImg, setPreviewImg] = createSignal("");
  const [hasPhoto, setHasPhoto] = createSignal(false);

  // Inisialisasi state input dengan sinyal
  const [alias, setAlias] = createSignal("");
  const [engine, setEngine] = createSignal("");
  const [engineUnit, setEngineUnit] = createSignal("");
  const [location, setLocation] = createSignal("");
  const [remarks, setRemarks] = createSignal("");

  onMount(async () => {
    try {
      const stockCode = params.detail;
      const response = await fetch(`/api/material/detail/${stockCode}`);
      const data = await response.json();
      setMaterials(data);

      if (data.length > 0) {
        const pictureName = data[0].picture || "";
        setAlias(data[0].alias || "");
        setEngine(data[0].engine || "");
        setEngineUnit(data[0].engine_unit || "");
        setLocation(data[0].location || "");
        setRemarks(data[0].remarks || "");

        if (pictureName) {
          setPreviewImg(`/img/materials/${pictureName}`); // Set path gambar dari nama file
          setHasPhoto(true);
        } else {
          setPreviewImg("");
          setHasPhoto(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch material data:", error);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPreviewImg("");
      setHasPhoto(false);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImg(event.target.result);
      setHasPhoto(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPreviewImg("");
    setHasPhoto(false);
    // Reset input file supaya bisa upload file yang sama lagi kalau perlu
    document.getElementById("upload-photo").value = "";
    document.getElementById("camera-input").value = "";
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const stockCode = params.detail;
      const formData = new FormData();
      formData.append("stock_code", stockCode);
      formData.append("alias", alias());
      formData.append("engine", engine());
      formData.append("engine_unit", engineUnit());
      formData.append("location", location());
      formData.append("remarks", remarks());

      if (hasPhoto() && previewImg().startsWith("data:")) {
        // Jika previewImg adalah data URL (hasil encoding file baru)
        const res = await fetch(previewImg());
        const blob = await res.blob();
        formData.append("photo", blob);
      }
      // Jika bukan data URL (misalnya path gambar lama), tidak perlu mengirim ulang file

      const res = await fetch(`/api/material/detail/${stockCode}`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Data berhasil diupdate.");
      } else {
        toast.error(result.error || "Gagal mengupdate data.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
      console.error(err);
    }
  }

  // Binding input dengan onChange, bukan onInput, untuk mengatasi masalah input delay
  const detailData = () => {
    const data = materials()[0];
    if (!data) return { filled: [], notFilled: [] };
    return {
      filled: [
        { label: "Stock Code", data: data.stock_code },
        { label: "Nama Material", data: data.material_name },
        { label: "Deskripsi Material", data: data.description },
      ],
      notFilled: [
        {
          label: "Alias",
          data: alias(),
          onChange: (e) => setAlias(e.target.value),
        },
        {
          label: "Mesin",
          data: engine(),
          onChange: (e) => setEngine(e.target.value),
        },
        {
          label: "Unit",
          data: engineUnit(),
          onChange: (e) => setEngineUnit(e.target.value),
        },
        {
          label: "Lokasi Material",
          data: location(),
          onChange: (e) => setLocation(e.target.value),
        },
        {
          label: "Stok Awal",
          data: 0,
        },
        {
          label: "Keterangan",
          data: remarks(),
          onChange: (e) => setRemarks(e.target.value),
        },
      ],
    };
  };

  return (
    <div class="update-detail-material container mt-4">
      <Toaster position="top-center" />
      <div class="text-center mb-3">
        <h3 class="title fw-bold">UPDATE DATA MATERIAL</h3>
      </div>

      <Show when={materials().length > 0} fallback={<div>Loading data...</div>}>
        <form onSubmit={handleSubmit}>
          <div class="row mb-3">
            <div class="col-md-4">
              {detailData().filled.map((item) => (
                <div class="mb-2" key={item.label}>
                  <label class="form-label fw-bold">{item.label}</label>
                  <input type="text" class="form-control" value={item.data} disabled />
                </div>
              ))}
            </div>

            <div class="col-md-4">
              {detailData().notFilled.map((item) => (
                <div class="mb-2" key={item.label}>
                  <label class="form-label fw-bold">{item.label}</label>
                  <input
                    type="text"
                    class="form-control"
                    value={item.data}
                    onChange={item.onChange}
                    disabled={item.label === "Stok Awal"}
                    autocomplete="off"
                  />
                </div>
              ))}
            </div>

            <div class="col-md-4">
              {/* Tampilkan preview foto jika ada */}
              <Show when={hasPhoto()} fallback={
                <div class="mb-2 foto">
                  <label for="upload-photo" class="form-label fw-bold">
                    Foto Material
                  </label>
                  <div class="mb-2">
                    <p class="mb-1 fst-italic">Upload foto material</p>
                    <input
                      type="file"
                      class="form-control mb-2"
                      id="upload-photo"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <hr />
                  <div>
                    <p class="mb-1 fst-italic">Ambil foto dari kamera</p>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      id="camera-input"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      class="btn btn-success w-100"
                      onClick={() => document.getElementById("camera-input").click()}
                    >
                      Camera
                    </button>
                  </div>
                </div>
              }>
                <div>
                  <img
                    src={previewImg()}
                    alt="Preview Foto Material"
                    style={{ width: "100%", marginTop: "10px", borderRadius: "8px" }}
                  />
                  <button
                    type="button"
                    class="btn btn-danger w-100 mt-2"
                    onClick={handleRemovePhoto}
                  >
                    Hapus Foto
                  </button>
                </div>
              </Show>
            </div>
          </div>
          <div class="d-flex justify-content-center">
            <button type="submit" class="btn btn-primary">
              Simpan
            </button>
          </div>
        </form>
      </Show>
    </div>
  );
}
