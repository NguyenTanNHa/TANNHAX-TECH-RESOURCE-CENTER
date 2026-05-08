import { NextRequest, NextResponse } from 'next/server';
import { drive } from '@/lib/drive';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, fileId } = body;

    const validPin = process.env.DOCUMENT_PIN;

    if (!validPin) {
      console.warn("Missing DOCUMENT_PIN in environment variables.");
      return NextResponse.json(
        { success: false, message: "System configuration error" },
        { status: 500 }
      );
    }

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: "Missing file ID" },
        { status: 400 }
      );
    }

    if (pin !== validPin) {
      return NextResponse.json(
        { success: false, message: "Mã PIN không chính xác!" },
        { status: 401 }
      );
    }

    // PIN is correct, fetch the actual file links from Google Drive API
    try {
      const response = await drive.files.get({
        fileId: fileId,
        fields: 'id, webContentLink, webViewLink',
      });

      const file = response.data;
      
      return NextResponse.json({
        success: true,
        data: {
          downloadUrl: file.webContentLink || file.webViewLink || '#',
          previewUrl: file.webViewLink ? file.webViewLink.replace('/view', '/preview') : '',
        }
      });
    } catch (driveError: any) {
      console.error(`Error fetching file ${fileId} from Drive:`, driveError);
      return NextResponse.json(
        { success: false, message: "Không tìm thấy file hoặc lỗi từ Google Drive." },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error("Document Unlock Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
