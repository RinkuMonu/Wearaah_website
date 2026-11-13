// Centralized Image Resolver & Fallback Utility for Wearaah
export const DEFAULT_PRODUCT_IMAGES = [
  "/images/1.jpg",
  "/images/jeans.jpg",
  "/images/shirt1.jpg",
  "/images/10.webp",
  "/images/11.webp",
  "/images/21.webp",
  "/images/tee1.jpg",
  "/images/polo.webp",
  "/images/plain.webp",
  "/images/cargopants.webp",
];

export function resolveImageUrl(rawPath, fallback = "/images/1.jpg") {
  if (!rawPath || typeof rawPath !== "string") {
    return fallback;
  }

  let cleaned = rawPath.trim().replace(/\\/g, "/");

  // Fix common erroneous localhost URLs stored in DB or generated with /api/
  cleaned = cleaned.replace(/^https?:\/\/localhost:\d+\/api\/uploads\//i, "/uploads/");
  cleaned = cleaned.replace(/^https?:\/\/localhost:\d+\/uploads\//i, "/uploads/");
  cleaned = cleaned.replace(/^https?:\/\/api\.wearaah\.com\/api\/uploads\//i, "/uploads/");
  cleaned = cleaned.replace(/^https?:\/\/api\.wearaah\.com\/uploads\//i, "/uploads/");

  // Already a full external valid http URL (e.g. CDN or S3)
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }

  // Relative uploads
  if (cleaned.startsWith("/uploads/") || cleaned.startsWith("uploads/")) {
    return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  }

  // Images folder
  if (cleaned.startsWith("/images/") || cleaned.startsWith("images/")) {
    return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  }

  if (cleaned.startsWith("/image/") || cleaned.startsWith("image/")) {
    return `/${cleaned.replace(/^\/?image\//, "images/")}`;
  }

  // Logo folder
  if (cleaned.startsWith("/logo/") || cleaned.startsWith("logo/")) {
    return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  }

  // If path is just a filename that looks like an upload (e.g. "177...webp")
  if (/^\d+-[^/]+$/i.test(cleaned)) {
    return `/uploads/${cleaned}`;
  }

  // Any other leading slash
  if (cleaned.startsWith("/")) {
    return cleaned;
  }

  return `/${cleaned}`;
}

export function handleImageFallback(e, fallback = "/images/1.jpg") {
  const current = e.currentTarget;
  if (!current.dataset.hasFailed) {
    current.dataset.hasFailed = "true";
    current.src = fallback;
  }
}

