const nodemailer = require("nodemailer");

type emailType = {
  to: String,
  subject: String,
  text: String,
  filename?: String,
  path?: String
}

export async function sendEmail(props: emailType) {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info.djscompute@gmail.com",
        pass: "xrkgmghmleltcokq",
      },
    });

    var mailOptions = {
      from: "info.djscompute@gmail.com",
      to: `${props.to}`,
      subject: `${props.subject}`,
      text: `${props.text}`,
      attachments: [{
          filename: `Customer_${props.filename}.pdf`,
          path: `./src/files/Customer_${props.filename}.pdf`
      },]
    };

    transporter.sendMail(
      mailOptions,
      function (error: Error | null, info: any) {
        if (error) {
          console.log(error);
        } else {
          console.log("Mail sent successfully");
        }
      }
    );
  } catch (error: any) {}
}