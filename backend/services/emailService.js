const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "SendGrid", // Or use "Mailgun"
  auth: {
    user: process.env.EMAIL_USER, // SendGrid API key
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendJobAlert = async (userEmail, jobList) => {
  const jobDetails = jobList.map(job => `
    <b>${job.title}</b> at ${job.company} <br/>
    Location: ${job.location} <br/>
    <a href="${job.link}">Apply Here</a>
    <hr/>
  `).join("");

  const mailOptions = {
    from: "noreply@job-alerts.com",
    to: userEmail,
    subject: "New Job Matches Based on Your Resume!",
    html: `<h2>Here are some job recommendations for you:</h2>${jobDetails}`,
  };

  await transporter.sendMail(mailOptions);
};
