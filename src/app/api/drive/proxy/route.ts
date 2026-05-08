import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json({ error: 'Missing file ID' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
    }

    // Fetch the raw file content from Google Drive API
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
    
    const response = await fetch(driveUrl);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file from Google Drive' }, { status: response.status });
    }

    // Pass the stream directly to the client with the correct content type
    // This allows the browser's native ultra-fast PDF viewer to handle it
    const contentType = response.headers.get('Content-Type') || 'application/pdf';

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        // Optional: Cache it at the edge/browser to make reopening instant
        'Cache-Control': 'public, max-age=86400',
        // 'Content-Disposition': 'inline' tells the browser to display it rather than download
        'Content-Disposition': 'inline', 
      },
    });

  } catch (error: any) {
    console.error("Proxy API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
