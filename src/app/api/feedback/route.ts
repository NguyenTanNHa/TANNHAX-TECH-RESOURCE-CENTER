import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, type, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin.' },
        { status: 400 }
      );
    }

    const feedbackTypeLabel: Record<string, string> = {
      bug: '🐛 Báo lỗi (Bug Report)',
      suggestion: '💡 Góp ý / Đề xuất',
      request: '📦 Yêu cầu tài nguyên mới',
      other: '💬 Khác',
    };

    const typeLabel = feedbackTypeLabel[type] || type;
    const sentAt = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TanNhaX Feedback</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#18181b;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6 0%,#8b5cf6 100%);padding:32px;text-align:center;">
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
                TanNha<span style="color:#93c5fd;">X</span> — Feedback mới
              </h1>
              <p style="margin:10px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">
                Có phản hồi mới từ hệ thống Tech Resource Center
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              
              <!-- Type -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;">Loại phản hồi</p>
                    <span style="display:inline-block;padding:5px 14px;border-radius:20px;font-size:13px;font-weight:600;background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.25);">${typeLabel}</span>
                  </td>
                </tr>
              </table>

              <!-- Name -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;">Người gửi</p>
                    <div style="background:#09090b;border-radius:10px;padding:12px 16px;border:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0;font-size:15px;color:#e4e4e7;">${name}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Email -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;">Email liên hệ</p>
                    <div style="background:#09090b;border-radius:10px;padding:12px 16px;border:1px solid rgba(255,255,255,0.06);">
                      <a href="mailto:${email}" style="margin:0;font-size:15px;color:#60a5fa;text-decoration:none;">${email}</a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:0;">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;">Nội dung phản hồi</p>
                    <div style="background:#09090b;border-radius:10px;padding:16px;border:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0;font-size:15px;color:#e4e4e7;line-height:1.7;white-space:pre-wrap;">${message.replace(/\n/g, '<br/>')}</p>
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-size:12px;color:#52525b;">
                Gửi lúc ${sentAt} (ICT) &nbsp;•&nbsp;
                <a href="#" style="color:#3b82f6;text-decoration:none;">TanNhaX Resource Center</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: 'TanNhaX Feedback <onboarding@resend.dev>',
      to: ['tannha.nam2003@gmail.com'],
      replyTo: email,
      subject: `[TanNhaX] ${typeLabel} từ ${name}`,
      html,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json(
        { success: false, message: 'Gửi email thất bại. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Phản hồi đã được gửi thành công!' });

  } catch (err: any) {
    console.error('Feedback API Error:', err);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi hệ thống.' },
      { status: 500 }
    );
  }
}
