"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";

export function CarImageUpload({
  carId,
  currentUrl,
}: {
  carId: string;
  currentUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(currentUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const blob = await upload(`cars/${carId}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        clientPayload: JSON.stringify({ carId, kind: "CAR_IMAGE" }),
      });
      setUrl(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opplasting feilet");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="image" value={url} />
      {url ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="aspect-[16/9] w-full rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-2 top-2 rounded-full bg-white px-3 py-1 text-xs font-medium shadow hover:bg-[color:var(--color-fog)]"
          >
            Fjern
          </button>
        </div>
      ) : (
        <div className="aspect-[16/9] w-full rounded-xl border border-dashed border-[color:var(--color-line)] bg-[color:var(--color-fog)]" />
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="h-11 rounded-full border border-[color:var(--color-line)] bg-white px-5 text-sm font-medium hover:border-[color:var(--color-ink)] disabled:opacity-50"
        >
          {uploading ? "Laster opp …" : url ? "Bytt bilde" : "Last opp bilde"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <input
          type="url"
          placeholder="eller lim inn URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-11 flex-1 rounded-xl border border-[color:var(--color-line)] bg-white px-3 text-sm focus:border-[color:var(--color-ink)] focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
