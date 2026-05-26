import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, name, visitDate } = await request.json();

    if (!to || !name) {
      return Response.json(
        { error: "Missing required fields: to, name" },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: "Grace Flow Church <onboarding@resend.dev>",
      to,
      subject: "Welcome to Grace Flow Church!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e40af; text-align: center;">Grace Flow Church</h1>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #111827; margin-top: 0;">Hello ${name},</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              We're excited to see you at Grace Flow Church! Thank you for registering your visit.
            </p>
            
            <div style="background-color: #fff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
              <p style="margin: 0; color: #111827;"><strong>Planned Visit Date:</strong> ${visitDate}</p>
            </div>
            
            <h3 style="color: #111827;">Service Times</h3>
            <ul style="color: #4b5563; line-height: 1.8;">
              <li>Sunday Morning Worship: 9:00 AM & 11:00 AM</li>
              <li>Wednesday Evening: 7:00 PM - Bible Study</li>
              <li>Friday Youth Group: 6:30 PM</li>
            </ul>
            
            <h3 style="color: #111827;">Location</h3>
            <p style="color: #4b5563;">
              123 Faith Street<br/>
              Grace City, ST 12345
            </p>
            
            <p style="color: #4b5563; margin-top: 30px;">
              If you have any questions, feel free to reach out to us at:<br/>
              <strong>Phone:</strong> (555) 123-4567<br/>
              <strong>Email:</strong> info@graceflow.com
            </p>
            
            <p style="color: #4b5563; margin-top: 30px;">
              Blessings,<br/>
              <strong>Grace Flow Church Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p>&copy; 2026 Grace Flow Church. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return Response.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Email sent successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
