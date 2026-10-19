/**
 * uploadToStorage - Uploads a File object to Supabase Storage via /api/upload.
 * Returns the public URL.
 */
export async function uploadToStorage(
  file: File,
  bucket: 'gallery' | 'videos' | 'downloads' | 'news',
  folder?: string
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = folder ? `${folder}/${uniqueName}` : uniqueName;

  // Convert file to base64 DataURL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bucket, path: filePath, dataUrl, mimeType: file.type }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error || 'Upload failed');
  }

  const result = await response.json();
  if (!result.url) throw new Error('No URL returned from upload');
  return result.url;
}

/**
 * uploadDataUrlToStorage - Uploads a base64 DataURL string to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadDataUrlToStorage(
  dataUrl: string,
  bucket: 'gallery' | 'videos' | 'downloads' | 'news',
  fileNameWithExt: string,
  folder?: string
): Promise<string> {
  const ext = fileNameWithExt.split('.').pop()?.toLowerCase() || 'bin';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = folder ? `${folder}/${uniqueName}` : uniqueName;

  // Extract MIME type from DataURL header
  const mimeMatch = dataUrl.match(/^data:([^;]+);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bucket, path: filePath, dataUrl, mimeType }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error || 'Upload failed');
  }

  const result = await response.json();
  if (!result.url) throw new Error('No URL returned from upload');
  return result.url;
}
