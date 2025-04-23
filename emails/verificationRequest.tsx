import { SendVerificationRequestParams } from "next-auth/providers/email";
import {emailConfig,transporter} from "../lib/email";

export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url, provider } = params;

  await transporter.sendMail({
    to: identifier,
    from: emailConfig.from,
    subject: `Sign in to Barter Marketplace`,
    text: text({ url }),
    html: html({ url }),
  });
}

function html({ url }: { url: string }) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #111;">Welcome to Barter Marketplace</h1>
      <p style="color: #333;">Click the link below to sign in:</p>
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Sign In</a>
      <p style="color: #666; font-size: 14px; margin-top: 24px;">
        If you didn't request this email, you can safely ignore it.
      </p>
    </div>
  `;
}

function text({ url }: { url: string }) {
  return `Sign in to Barter Marketplace: ${url}\n\n`;
}