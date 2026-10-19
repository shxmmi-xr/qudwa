import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Accept JSON body with base64 file data - simpler than multipart
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb', // Allow up to 25MB uploads
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    console.error('[API /upload] Missing env vars');
    return res.status(500).json({ error: 'Server storage not configured' });
  }

  const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  try {
    const { bucket, path: filePath, dataUrl, mimeType } = req.body as {
      bucket: string;
      path: string;
      dataUrl: string;
      mimeType: string;
    };

    if (!bucket || !filePath || !dataUrl) {
      return res.status(400).json({ error: 'Missing required fields: bucket, path, dataUrl' });
    }

    // Convert base64 DataURL to Buffer
    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
    const fileBuffer = Buffer.from(base64, 'base64');
    const contentType = mimeType || 'application/octet-stream';

    const { data, error } = await adminSupabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error('[API /upload] Supabase storage error:', error);
      return res.status(500).json({ error: error.message });
    }

    const { data: urlData } = adminSupabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return res.status(200).json({
      success: true,
      path: data.path,
      url: urlData.publicUrl,
    });
  } catch (err: any) {
    console.error('[API /upload] Error:', err);
    return res.status(500).json({ error: err?.message || 'Upload failed' });
  }
}
