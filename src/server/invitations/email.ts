import "server-only";
import { ApiError } from "@/server/http/api-error";

export function emailConfig() {
  const { APP_URL, RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env;
  if (!APP_URL || !RESEND_API_KEY || !RESEND_FROM_EMAIL) throw new ApiError(503, "Invitation email is not configured. Contact the administrator.");
  const url = new URL(APP_URL);
  if (!['http:', 'https:'].includes(url.protocol)) throw new ApiError(503, "Invalid application URL");
  return { origin: url.origin, key: RESEND_API_KEY, from: RESEND_FROM_EMAIL };
}
export async function sendInvitation(email: string, title: string, role: string, token: string, key: string) {
  const config = emailConfig();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST", signal: AbortSignal.timeout(15000),
    headers: { Authorization: `Bearer ${config.key}`, "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify({ from: config.from, to: [email], subject: "You're invited to a wedding team", text: `You have been invited to ${title} as a ${role.toLowerCase()}.\n\nSign in or create an account with ${email}, then accept your invitation:\n${config.origin}/join/${token}\n\nThis link expires in 7 days. A resent invitation replaces earlier links.\nIf you weren't expecting this invitation, you can ignore this email.` }),
  });
  if (!response.ok) throw new Error("Email provider rejected the invitation");
}
