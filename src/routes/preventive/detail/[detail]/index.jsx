import { onCleanup, onMount } from "solid-js";

export default function PreventiveDetail() {
  onMount(() => {
    // Hanya berjalan di client, localStorage tersedia
    // Bersihkan saat unmount halaman
    onCleanup(() => {
      localStorage.removeItem("selectedEvent");
    });
  });

  return (
    <div>
      <h1>TES</h1>
    </div>
  );
}
