// src/utils/imageHelper.js
// Utility to normalize image URLs from Instagram, Google Drive, and other CDNs with fallback support

const categoryFallbacks = {
  Technology: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  Cultural: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  Sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
  Business: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
  Art: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
  Music: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  Food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  Other: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
};

export const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";

/**
 * Normalizes an image URL so Instagram, Google Drive, etc. display correctly.
 */
export function normalizeImageUrl(url, category = "Technology") {
  if (!url || typeof url !== "string" || !url.trim()) {
    return categoryFallbacks[category] || DEFAULT_FALLBACK_IMAGE;
  }

  let cleaned = url.trim();

  // 1. Instagram Post URL converter:
  // e.g., https://www.instagram.com/p/ABC123xyz/ -> https://www.instagram.com/p/ABC123xyz/media/?size=l
  const igPostRegex = /https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/i;
  const igMatch = cleaned.match(igPostRegex);
  if (igMatch && igMatch[1]) {
    const postId = igMatch[1];
    // Return direct media endpoint or proxy
    return `https://www.instagram.com/p/${postId}/media/?size=l`;
  }

  // 2. Google Drive Share Link converter:
  // e.g., https://drive.google.com/file/d/FILE_ID/view -> https://drive.google.com/uc?export=view&id=FILE_ID
  const gDriveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i;
  const gDriveMatch = cleaned.match(gDriveRegex);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${gDriveMatch[1]}`;
  }

  // 3. Dropbox share link converter:
  if (cleaned.includes("dropbox.com") && cleaned.includes("dl=0")) {
    return cleaned.replace("dl=0", "raw=1");
  }

  return cleaned;
}

/**
 * Fallback handler for <img> onError event
 */
export function handleImageError(e, category = "Technology") {
  const target = e.currentTarget || e.target;
  const fallback = categoryFallbacks[category] || DEFAULT_FALLBACK_IMAGE;

  // Prevent infinite loop if fallback fails
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
