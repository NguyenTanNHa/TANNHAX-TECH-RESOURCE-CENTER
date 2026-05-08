import { NextRequest, NextResponse } from 'next/server';
import { getFilesInFolder, getCachedFilesInFolder } from '@/lib/drive';

export const revalidate = 1800; // Cache the response for 30 minutes (ISR)

// Helper function to format file size
const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Map Google Drive MIME types or file names to our ResourceCategory
const determineCategory = (mimeType: string, name: string): "software" | "driver" | "document" => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('driver') || lowerName.includes('sdk')) {
    return 'driver';
  }
  
  if (
    mimeType.includes('pdf') || 
    mimeType.includes('document') || 
    mimeType.includes('text') ||
    lowerName.includes('guide') ||
    lowerName.includes('manual')
  ) {
    return 'document';
  }

  // Default fallback for exe, zip, rar, etc.
  return 'software';
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paramFolderId = searchParams.get('folderId');
    
    let driveFiles: any[] = [];
    
    if (paramFolderId) {
      driveFiles = await getCachedFilesInFolder(paramFolderId);
    } else {
      // Default folders to fetch from
      const folderIds = [
        '1TVecsVokM3w4yW-_XWkyXzn-r3EjF7QD', // Original folder
        '1sjYrqvfIIiFCDeN9U1KTDX-DdXKtIQwD'  // New Document folder
      ];
      
      const results = await Promise.all(
        folderIds.map(async id => {
          try {
            const files = await getCachedFilesInFolder(id);
            return files.map(file => ({ ...file, sourceFolderId: id }));
          } catch (err) {
            console.error(`Failed to fetch folder ${id}:`, err);
            return []; // Return empty array for failed folder
          }
        })
      );
      
      driveFiles = results.flat();
    }

    // Map Google Drive files to our ResourceItem format
    const resources = driveFiles.map((file) => {
      // Force category to 'document' if it came from the new document folder
      const isFromDocumentFolder = file.sourceFolderId === '1sjYrqvfIIiFCDeN9U1KTDX-DdXKtIQwD';
      const category = isFromDocumentFolder ? 'document' : determineCategory(file.mimeType || '', file.name || '');

      return {
        id: file.id || Math.random().toString(),
        title: file.name || 'Unknown File',
        description: file.description || (file.mimeType === 'application/vnd.google-apps.folder' ? 'Thư mục (Folder) từ Google Drive' : `Loại file: ${file.mimeType}`),
        category,
        fileSize: formatBytes(Number(file.size || 0)),
        updatedAt: file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Unknown Date',
        // Hide links for documents
        downloadUrl: category === 'document' ? '' : (file.webContentLink || file.webViewLink || '#'),
        previewUrl: category === 'document' ? '' : (file.webViewLink ? file.webViewLink.replace('/view', '/preview') : ''),
      };
    });

    return NextResponse.json({ success: true, data: resources });
  } catch (error: any) {
    console.error("Drive API Route Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
