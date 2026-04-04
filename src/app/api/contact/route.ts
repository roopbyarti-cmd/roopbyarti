import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // 🔐 transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "roopbyarti@gmail.com",
        pass: process.env.EMAIL_PASS, // 👈 gmail app password
      },
    });

    // 📩 mail send
    await transporter.sendMail({
      from: email,
      to: "roopbyarti@gmail.com",
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/> ${message}</p>
      `,
    });

    return Response.json({ success: true });

  } catch (error) {
    console.log(error);
    return Response.json({ success: false });
  }
}