import { r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
const cache = /* @__PURE__ */ new Map();
function useSignedUrls(bucket, paths) {
  const [urls, setUrls] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!paths || paths.length === 0) {
      setUrls([]);
      return;
    }
    const now = Date.now();
    const need = [];
    const resolved = paths.map((p) => {
      const c = cache.get(`${bucket}:${p}`);
      if (c && c.expires > now) return c.url;
      need.push(p);
      return null;
    });
    if (need.length === 0) {
      setUrls(resolved.filter((u) => !!u));
      return;
    }
    supabase.storage.from(bucket).createSignedUrls(need, 60 * 60 * 24 * 7).then(({ data }) => {
      if (!data) return;
      data.forEach((d) => {
        if (d.signedUrl && d.path) {
          cache.set(`${bucket}:${d.path}`, {
            url: d.signedUrl,
            expires: now + 60 * 60 * 1e3
          });
        }
      });
      const final = paths.map((p) => cache.get(`${bucket}:${p}`)?.url ?? "");
      setUrls(final.filter(Boolean));
    });
  }, [bucket, paths?.join(",")]);
  return urls;
}
function useSignedUrl(bucket, path) {
  const urls = useSignedUrls(bucket, path ? [path] : []);
  return urls[0] ?? null;
}
export {
  useSignedUrls as a,
  useSignedUrl as u
};
