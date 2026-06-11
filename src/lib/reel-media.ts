import { supabase } from "@/integrations/supabase/client";

// Stored values are either full http(s) URLs OR storage paths like "<uuid>.jpg".
// Uploaded files live in private buckets, surfaced via long-lived signed URLs.

export function isHttpUrl(v: string | null | undefined): v is string {
  return !!v && /^https?:\/\//i.test(v);
}

export async function resolveMediaUrl(
  bucket: "reel-covers" | "reel-videos",
  value: string | null | undefined,
): Promise<string | null> {
  if (!value) return null;
  if (isHttpUrl(value)) return value;
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(value, 60 * 60 * 24 * 365);
  if (error) return null;
  return data.signedUrl;
}

export async function uploadReelMedia(
  bucket: "reel-covers" | "reel-videos",
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}

export async function removeReelMedia(
  bucket: "reel-covers" | "reel-videos",
  value: string | null | undefined,
) {
  if (!value || isHttpUrl(value)) return;
  await supabase.storage.from(bucket).remove([value]);
}
