"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RutaResumen } from "@/entities";

interface SearchFormProps {
  rutas: RutaResumen[];
  actionPath?: string;
}

export default function SearchForm({ rutas, actionPath = "/" }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const origenes = Array.from(new Set(rutas.map((r) => r.origen)));

  const initialOrigen = searchParams.get("origen") || "";
  const initialDestino = searchParams.get("destino") || "";
  const initialFecha = searchParams.get("fecha") || "";

  const [origen, setOrigen] = useState(initialOrigen);
  const [destino, setDestino] = useState(initialDestino);
  const [fecha, setFecha] = useState(initialFecha);

  const destinosFiltrados = rutas
    .filter((r) => r.origen === origen)
    .map((r) => r.destino);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origen || !destino || !fecha) return;
    const params = new URLSearchParams();
    params.set("origen", origen);
    params.set("destino", destino);
    params.set("fecha", fecha);
    router.push(`${actionPath}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-200 flex flex-col md:flex-row gap-4 items-end backdrop-blur-md bg-opacity-80"
    >
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Origen</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={origen}
          onChange={(e) => {
            setOrigen(e.target.value);
            setDestino("");
          }}
          required
        >
          <option value="" disabled>
            Selecciona Origen
          </option>
          {origenes.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          {!origenes.includes("Oaxaca") && <option value="Oaxaca">Oaxaca</option>}
          {!origenes.includes("Chihuahua") && <option value="Chihuahua">Chihuahua</option>}
          {!origenes.includes("Baja California Norte") && <option value="Baja California Norte">Baja California Norte</option>}
        </select>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Destino</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          required
          disabled={!origen}
        >
          <option value="" disabled>
            Selecciona Destino
          </option>
          {Array.from(new Set(destinosFiltrados)).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Fecha</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-full md:w-auto">
        Buscar Viajes
      </button>
    </form>
  );
}
