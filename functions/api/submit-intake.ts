export interface Env {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
}

type InquiryPayload = {
  fullName?: string;
  phone?: string;
  email?: string;
  location?: string;
  whoNeedsSupport?: string;
  potentialCustomerName?: string;
  servicesInterested?: string[];
  preferredContactMethod?: string;
  bestTimeToReach?: string;
  situation?: string;
  website?: string;
};

const OWNER_EMAIL = "truenorthrisingsc@gmail.com";

const trimValue = (value: unknown) => {
  return typeof value === "string" ? value.trim() : "";
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const tooLong = (value: string, max: number) => value.length > max;

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) => {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return Response.json({ message: "Email service is not configured." }, { status: 500 });
  }
  if (request.method !== "POST") {
  return Response.json({ message: "Method not allowed." }, { status: 405 });
  }

  try {
    const payload = (await request.json()) as InquiryPayload;

    const fullName = trimValue(payload.fullName);
    const phone = trimValue(payload.phone);
    const email = trimValue(payload.email);
    const location = trimValue(payload.location);
    const whoNeedsSupport = trimValue(payload.whoNeedsSupport);
    const potentialCustomerName = trimValue(payload.potentialCustomerName);
    const preferredContactMethod = trimValue(payload.preferredContactMethod);
    const bestTimeToReach = trimValue(payload.bestTimeToReach);
    const situation = trimValue(payload.situation);
    const website = trimValue(payload.website);

    const servicesInterested = Array.isArray(payload.servicesInterested)
      ? payload.servicesInterested
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    if (website) {
      return Response.json({ ok: true }, { status: 200 });
    }

    if (
      !fullName ||
      !phone ||
      !email ||
      !location ||
      !whoNeedsSupport ||
      !preferredContactMethod ||
      !situation
    ) {
      return Response.json({ message: "Please complete all required fields." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    if (
      tooLong(fullName, 120) ||
      tooLong(phone, 50) ||
      tooLong(email, 200) ||
      tooLong(location, 150) ||
      tooLong(whoNeedsSupport, 100) ||
      tooLong(potentialCustomerName, 120) ||
      tooLong(preferredContactMethod, 50) ||
      tooLong(bestTimeToReach, 120) ||
      tooLong(situation, 4000)
    ) {
      return Response.json({ message: "One or more fields are too long." }, { status: 400 });
    }

    const servicesText = servicesInterested.length > 0 ? servicesInterested.join(", ") : "Not specified";
    const safeSituation = escapeHtml(situation).replace(/\n/g, "<br />");

    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">New True North Rising inquiry</h2>
        <p>A new intake form was submitted from the website.</p>

        <table style="border-collapse: collapse; width: 100%; margin-top: 16px;">
          <tbody>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Full name</td>
              <td>${escapeHtml(fullName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Phone</td>
              <td>${escapeHtml(phone)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Email</td>
              <td>${escapeHtml(email)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Location</td>
              <td>${escapeHtml(location)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Who needs support</td>
              <td>${escapeHtml(whoNeedsSupport)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Potential customer name</td>
              <td>${escapeHtml(potentialCustomerName || "Not provided")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Services of interest</td>
              <td>${escapeHtml(servicesText)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Preferred contact method</td>
              <td>${escapeHtml(preferredContactMethod)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Best time to reach</td>
              <td>${escapeHtml(bestTimeToReach || "Not provided")}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 18px;">
          <div style="font-weight: 700; margin-bottom: 6px;">Situation</div>
          <div style="padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
            ${safeSituation}
          </div>
        </div>
      </div>
    `;

    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Thank you for reaching out to True North Rising</h2>
        <p>Hi ${escapeHtml(fullName)},</p>
        <p>We received your information and will be in touch soon.</p>
        <p>
          If you need to reach us sooner, you can reply to this email or call us at (442) 888-4419.
        </p>
        <p style="margin-top: 24px;">
          Warmly,<br />
          True North Rising
        </p>
      </div>
    `;

    const ownerRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: OWNER_EMAIL,
        reply_to: email,
        subject: `New inquiry from ${fullName}`,
        html: ownerHtml,
      }),
    });

    if (!ownerRes.ok) {
      const ownerText = await ownerRes.text();
      console.error("Owner email failed:", ownerText);
      return Response.json({ message: "Could not send owner email." }, { status: 500 });
    }

    const confirmRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: email,
        subject: "We received your request - True North Rising",
        html: confirmationHtml,
      }),
    });

    if (!confirmRes.ok) {
      const confirmText = await confirmRes.text();
      console.error("Confirmation email failed:", confirmText);
      return Response.json({ message: "Could not send confirmation email." }, { status: 500 });
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("submit-intake error:", error);

    return Response.json(
      {
        message: "We could not send your request right now. Please try again or call us directly.",
      },
      { status: 500 }
    );
  }
};