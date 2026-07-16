import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

const FROM_EMAIL = "onboarding@resend.dev"
const APP_NAME = "RepurposeAI"

function welcomeEmailHtml(name: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 0;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">${APP_NAME}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 24px;">
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#1e293b;">Welcome to ${APP_NAME}, ${name}!</h2>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#475569;">
                We're thrilled to have you on board. Your account is now active and ready to go.
              </p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#475569;">
                Start repurposing your content across LinkedIn and Twitter in minutes. Turn one piece of content into a multi-channel strategy.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#64748b;">
                    <span style="color:#6366f1;font-weight:600;">&check;</span> Extract from YouTube, blogs, and podcasts
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#64748b;">
                    <span style="color:#6366f1;font-weight:600;">&check;</span> Generate LinkedIn posts and Twitter threads
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#64748b;">
                    <span style="color:#6366f1;font-weight:600;">&check;</span> Schedule and publish across platforms
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;padding:12px 28px;background-color:#6366f1;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;border-radius:8px;">Go to dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                ${APP_NAME} &mdash; Repurpose content. Amplify reach.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function passwordResetEmailHtml(resetLink: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 0;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">${APP_NAME}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 24px;">
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#1e293b;">Reset your password</h2>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#475569;">
                We received a request to reset the password for your ${APP_NAME} account. Click the button below to set a new password.
              </p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#475569;">
                This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" style="display:inline-block;padding:12px 28px;background-color:#6366f1;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;border-radius:8px;">Reset password</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetLink}" style="color:#6366f1;word-break:break-all;">${resetLink}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to ${APP_NAME}, ${name}!`,
      html: welcomeEmailHtml(name),
    })
  } catch (error) {
    console.error("sendWelcomeEmail error:", error)
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Reset your ${APP_NAME} password`,
      html: passwordResetEmailHtml(resetLink),
    })
  } catch (error) {
    console.error("sendPasswordResetEmail error:", error)
  }
}
