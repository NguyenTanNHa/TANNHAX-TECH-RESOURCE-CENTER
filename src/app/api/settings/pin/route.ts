import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { currentPin, newPin } = await req.json();

    const validPin = process.env.DOCUMENT_PIN;

    if (!validPin) {
      return NextResponse.json({ success: false, message: "Lỗi cấu hình hệ thống (Thiếu PIN gốc)." }, { status: 500 });
    }

    if (currentPin !== validPin) {
      return NextResponse.json({ success: false, message: "Mã PIN hiện tại không chính xác!" }, { status: 401 });
    }

    if (!newPin || newPin.length < 4) {
      return NextResponse.json({ success: false, message: "Mã PIN mới phải có ít nhất 4 ký tự!" }, { status: 400 });
    }

    // Path to .env.local
    const envPath = path.join(process.cwd(), '.env.local');

    // Read current .env.local
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Replace or add DOCUMENT_PIN
    if (envContent.includes('DOCUMENT_PIN=')) {
      envContent = envContent.replace(/DOCUMENT_PIN=.*/g, `DOCUMENT_PIN=${newPin}`);
    } else {
      envContent += `\nDOCUMENT_PIN=${newPin}\n`;
    }

    // Write back to .env.local
    fs.writeFileSync(envPath, envContent, 'utf-8');

    // Important: process.env updates don't persist automatically in Next.js runtime across all places unless restarted,
    // but we can update it in the current process so subsequent calls in this same process work.
    process.env.DOCUMENT_PIN = newPin;

    return NextResponse.json({ success: true, message: "Cập nhật mã PIN thành công!" });
  } catch (error) {
    console.error("Update PIN Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi máy chủ" }, { status: 500 });
  }
}
