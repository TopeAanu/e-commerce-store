import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import sendgrid from "@sendgrid/mail";
import cors from "cors";
import express from "express";

// Initialize Firebase Admin
initializeApp();

// Get config the old way
const config = functions.config();
sendgrid.setApiKey(config.sendgrid.api_key);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post("/sendConfirmationCode", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Missing email or code" });
  }

  const msg = {
    to: email,
    from: config.sendgrid.sender || "noreply@melstore.com",
    subject: "Your MelStore Confirmation Code",
    html: `
      <div style="font-family: sans-serif; padding: 16px;">
        <h2>Your Confirmation Code</h2>
        <p>Use the code below to complete your sign-up to MelStore:</p>
        <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #16a34a;">
          ${code}
        </div>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await sendgrid.send(msg);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("SendGrid error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

export const api = functions.https.onRequest(app);
