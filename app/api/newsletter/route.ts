import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('Invalid/Missing environment variable: "SENDGRID_API_KEY"');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("football-newsletter");

    // Check if email already exists
    const existingSubscriber = await db
      .collection("subscribers")
      .findOne({ email });

    if (existingSubscriber) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 400 }
      );
    }

    // Add new subscriber
    await db.collection("subscribers").insertOne({
      email,
      subscribedAt: new Date(),
    });

    // Send welcome email
    await sgMail.send({
      to: email,
      from: {
        email: "apavirooppaul10@gmail.com",
        name: "FootStats",
      },
      subject: "Welcome to FootStats Newsletter!",
      text: "Thank you for subscribing to our newsletter. You'll receive the latest football news and updates straight to your inbox.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669;">Welcome to FootStats Newsletter!</h1>
          <p>Thank you for subscribing to our newsletter. You'll receive the latest football news and updates straight to your inbox.</p>
          <p>Stay tuned for:</p>
          <ul>
            <li>Match results and analysis</li>
            <li>Transfer news and rumors</li>
            <li>Player statistics and insights</li>
            <li>Exclusive content and more!</li>
          </ul>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Successfully subscribed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
