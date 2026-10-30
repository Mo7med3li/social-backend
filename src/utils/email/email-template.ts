interface ConfirmEmailTemplateProps {
  otp: string | number;
  userName?: string;
  title: string;
  purpose: string;
}

export const confirmEmailTemplate = ({
  otp,
  userName,
  title,
  purpose,
}: ConfirmEmailTemplateProps) => {
  const brand = process.env.APPLICATION_NAME || "Social";
  const greeting = userName ? `Hey ${userName},` : "Hey there,";
  const year = new Date().getFullYear();
  const otpDigits = String(otp)
    .split("")
    .map(
      (digit) =>
        `<td align="center" style="width:44px;height:52px;background-color:#111827;border-radius:10px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;letter-spacing:0;color:#ffffff;line-height:52px;">${digit}</td>`,
    )
    .join(`<td style="width:8px;font-size:0;line-height:0;">&nbsp;</td>`);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0B1220;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B1220;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Brand mark -->
          <tr>
            <td align="center" style="padding:0 0 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:36px;height:36px;background-color:#FF4D6D;border-radius:10px;text-align:center;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#ffffff;line-height:36px;">
                    S
                  </td>
                  <td style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#F8FAFC;">
                    ${brand}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#111827;border:1px solid #1F2937;border-radius:20px;overflow:hidden;">

                <!-- Accent strip -->
                <tr>
                  <td style="height:4px;background-color:#FF4D6D;font-size:0;line-height:0;">&nbsp;</td>
                </tr>

                <!-- Hero copy -->
                <tr>
                  <td style="padding:36px 36px 8px;">
                    <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#FF4D6D;">
                      ${title}
                    </p>
                    <h1 style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:700;line-height:1.25;letter-spacing:-0.02em;color:#F8FAFC;">
                      Jump back into the conversation
                    </h1>
                    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#94A3B8;">
                      ${greeting}
                    </p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#94A3B8;">
                      Use this one-time code to ${purpose}. It expires soon — never share it with anyone.
                    </p>
                  </td>
                </tr>

                <!-- OTP -->
                <tr>
                  <td align="center" style="padding:28px 36px 12px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B1220;border:1px solid #1F2937;border-radius:16px;">
                      <tr>
                        <td align="center" style="padding:22px 28px;">
                          <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#64748B;">
                            Your code
                          </p>
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              ${otpDigits}
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Safety note -->
                <tr>
                  <td style="padding:20px 36px 36px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B1220;border-radius:12px;">
                      <tr>
                        <td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#64748B;">
                          Didn’t ask for this? You can ignore this email — your account stays safe.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 8px 0;">
              <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#64748B;text-align:center;">
                Connect · Share · Belong
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#475569;text-align:center;">
                © ${year} ${brand}. Built for people who show up.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
