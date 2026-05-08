import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getFilesInFolder } from '@/lib/drive';
import connectDB from '@/lib/db';
import Resource from '@/models/Resource';
import { DRIVE_FOLDERS, CATEGORIES } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin Auth
    const isAuthenticated = await verifyAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const syncResults = {
      added: 0,
      skipped: 0,
      errors: 0,
    };

    // 2. Map Folders to Categories
    const folderMappings = [
      { id: DRIVE_FOLDERS.TECH_DOCS, category: CATEGORIES.DOCUMENT },
      { id: DRIVE_FOLDERS.TECH_SOFTWARE, category: CATEGORIES.SOFTWARE },
      // Driver category could be inferred from filename or added manually later
    ];

    // 3. Sync Process
    for (const mapping of folderMappings) {
      try {
        const files = await getFilesInFolder(mapping.id);
        
        for (const file of files) {
          if (!file.id || !file.name) continue;

          // Check if file already exists in DB
          const existing = await Resource.findOne({ googleDriveFileId: file.id });
          if (existing) {
            syncResults.skipped++;
            continue;
          }

          // Simple heuristic to extract brand/model from filename (e.g. "HP_LaserJet_1020_Driver.exe")
          // In production, this might need manual review, so we save it with basic extracted info
          const parts = file.name.split(/[-_ ]/);
          const brand = parts[0] || 'Unknown';
          const model = parts.length > 1 ? parts[1] : 'Unknown';

          await Resource.create({
            name: file.name,
            category: mapping.category,
            brand: brand,
            model: model,
            googleDriveFileId: file.id,
            tags: ['auto-synced'],
          });
          
          syncResults.added++;
        }
      } catch (err) {
        console.error(`Failed to sync folder ${mapping.id}`, err);
        syncResults.errors++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Sync completed', 
      data: syncResults 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
