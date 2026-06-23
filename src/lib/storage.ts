import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, { url: string; expires: number }>();

/**
 * Returns signed URLs for a set of storage paths in a given bucket.
 * Caches in memory for 1 hour to avoid re-signing on every render.
 */
export function useSignedUrls(bucket: string, paths: string[] | null | undefined) {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!paths || paths.length === 0) {
      setUrls([]);
      return;
    }
    const now = Date.now();
    const need: string[] = [];
    const resolved: (string | null)[] = paths.map((p) => {
      const c = cache.get(`${bucket}:${p}`);
      if (c && c.expires > now) return c.url;
      need.push(p);
      return null;
    });

    if (need.length === 0) {
      setUrls(resolved.filter((u): u is string => !!u));
      return;
    }

    supabase.storage
      .from(bucket)
      .createSignedUrls(need, 60 * 60 * 24 * 7)
      .then(({ data }) => {
        if (!data) return;
        data.forEach((d) => {
          if (d.signedUrl && d.path) {
            cache.set(`${bucket}:${d.path}`, {
              url: d.signedUrl,
              expires: now + 60 * 60 * 1000,
            });
          }
        });
        const final = paths.map((p) => cache.get(`${bucket}:${p}`)?.url ?? "");
        setUrls(final.filter(Boolean));
      });
  }, [bucket, paths?.join(",")]);

  return urls;
}

export function useSignedUrl(bucket: string, path: string | null | undefined) {
  const urls = useSignedUrls(bucket, path ? [path] : []);
  return urls[0] ?? null;
}
