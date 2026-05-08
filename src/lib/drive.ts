import { google } from 'googleapis';
import { unstable_cache } from 'next/cache';

const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

if (!apiKey) {
  console.warn("WARNING: Missing GOOGLE_DRIVE_API_KEY in environment variables. Drive sync will fail.");
}

// Since the folder is public ("Anyone with the link can view"), we can just use an API key
export const drive = google.drive({ version: 'v3', auth: apiKey });

/**
 * Fetches the list of files from a specific Google Drive folder.
 */
export async function getFilesInFolder(folderId: string) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, size, modifiedTime, webContentLink, webViewLink, description)',
      pageSize: 1000,
    });
    return response.data.files || [];
  } catch (error) {
    console.error(`Error fetching files for folder ${folderId}:`, error);
    throw error;
  }
}

/**
 * Cached version of getFilesInFolder.
 * Caches the result for 1800 seconds (30 minutes) using Next.js Data Cache.
 */
export const getCachedFilesInFolder = (folderId: string) => 
  unstable_cache(
    async () => getFilesInFolder(folderId),
    [`drive-folder-${folderId}`],
    { revalidate: 1800, tags: ['drive-files', `folder-${folderId}`] }
  )();
