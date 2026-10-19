/**
 * Helper utility to reliably download or view files (especially PDFs and base64 Data URLs)
 * across desktop, Android, and iOS Safari / standalone PWA.
 */

export function isIOS(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const byteString = atob(parts[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}

export function getDirectDownloadUrl(url: string, fileName?: string): string {
  if (!url || url === '#') return '';
  if (url.startsWith('data:')) return url;

  const cleanName = (fileName || 'document.pdf').replace(/[/\\?%*:|"<>]/g, '_').trim();

  // Supabase Storage URLs support ?download=filename query param for instant attachment download
  if (url.includes('/storage/v1/object/public/')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}download=${encodeURIComponent(cleanName)}`;
  }
  return url;
}

export async function downloadOrOpenFile(
  urlOrDataUrl: string,
  fileName?: string,
  mimeType = 'application/pdf'
): Promise<void> {
  if (!urlOrDataUrl || urlOrDataUrl === '#') {
    alert('No document file attached.');
    return;
  }

  const cleanFileName = (fileName || 'document.pdf').replace(/[/\\?%*:|"<>]/g, '_').trim() || 'document.pdf';
  const isDataUri = urlOrDataUrl.startsWith('data:');

  // 1. Direct Cloud URL (Supabase Storage / CDN / External) - trigger instant native download
  if (!isDataUri) {
    const downloadUrl = getDirectDownloadUrl(urlOrDataUrl, cleanFileName);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = cleanFileName;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch (e) {}
    }, 200);
    return;
  }

  // 2. Base64 Data URL handling
  try {
    const blob = dataUrlToBlob(urlOrDataUrl);
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = cleanFileName;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (e) {}
    }, 1000);
  } catch (err) {
    console.error('Download error:', err);
    window.open(urlOrDataUrl, '_blank');
  }
}
