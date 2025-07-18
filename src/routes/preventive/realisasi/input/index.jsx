import { engines } from "~/lib/data/engineData";

export default function InputRealisasiPM() {
  return (
    <div class="inputRealisasiPM">
      <div class="card p-md-5 p-3 mx-3 mx-md-0">
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Waktu Realisasi
          </label>
          <input type="date" class="form-control" id="exampleFormControlInput1"></input>
        </div>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Unit
          </label>
          <select class="form-select" aria-label="Default select example">
            <option selected>Open this select menu</option>
            {engines().map(({ mesin, unit }) => (
              <option value={unit} key={unit}>
                {mesin} Unit {unit}
              </option>
            ))}
          </select>
        </div>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Jenis PM
          </label>
          <select class="form-select" aria-label="Default select example">
            <option selected>Open this select menu</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
            <option value="P5">P5</option>
          </select>
        </div>
      </div>
    </div>
  );
}
