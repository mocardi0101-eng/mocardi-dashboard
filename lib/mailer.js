import nodemailer from 'nodemailer'

export function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

export async function sendPinEmail({ to, name, pin }) {
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `Mocardi 🍰 <${process.env.GMAIL_USER}>`,
    to,
    subject: '🍰 PIN Dashboard Mocardi kamu',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin:0;padding:0;background:#FBEAF0;font-family:'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(212,83,126,0.12);">
          <div style="background:linear-gradient(135deg,#D4537E,#ED93B1);padding:32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:32px;font-weight:900;">Mocardi 🍰</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;font-style:italic;">"Delight in every bite"</p>
          </div>
          <div style="padding:32px;">
            <p style="color:#374151;font-size:15px;margin:0 0 8px;">Halo, <strong>${name}</strong>! 👋</p>
            <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Akun dashboard Mocardi kamu sudah berhasil dibuat. Ini PIN untuk login:</p>
            <div style="background:#FBEAF0;border:2px dashed #D4537E;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
              <p style="margin:0 0 4px;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">PIN kamu</p>
              <p style="margin:0;color:#D4537E;font-size:42px;font-weight:900;letter-spacing:10px;">${pin}</p>
            </div>
            <p style="color:#9ca3af;font-size:12px;margin:0 0 4px;">⚠️ Simpan PIN ini — jangan share ke orang lain.</p>
            <p style="color:#9ca3af;font-size:12px;margin:0;">Kalau lupa PIN, bisa request kirim ulang dari halaman login.</p>
          </div>
          <div style="background:#FBEAF0;padding:16px;text-align:center;">
            <p style="margin:0;color:#d1b3be;font-size:11px;">Mocardi Internal Dashboard · mocardi.vercel.app</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendNewPinEmail({ to, name, pin }) {
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `Mocardi 🍰 <${process.env.GMAIL_USER}>`,
    to,
    subject: '🔑 PIN Baru Dashboard Mocardi',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#FBEAF0;font-family:'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(212,83,126,0.12);">
          <div style="background:linear-gradient(135deg,#D4537E,#ED93B1);padding:32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:32px;font-weight:900;">Mocardi 🍰</h1>
          </div>
          <div style="padding:32px;">
            <p style="color:#374151;font-size:15px;margin:0 0 8px;">Halo, <strong>${name}</strong>!</p>
            <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Ini PIN baru kamu (PIN lama sudah tidak berlaku):</p>
            <div style="background:#FBEAF0;border:2px dashed #D4537E;border-radius:16px;padding:24px;text-align:center;">
              <p style="margin:0 0 4px;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">PIN Baru</p>
              <p style="margin:0;color:#D4537E;font-size:42px;font-weight:900;letter-spacing:10px;">${pin}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}
