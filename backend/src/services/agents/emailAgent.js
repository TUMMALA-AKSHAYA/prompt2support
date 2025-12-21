import { google } from "googleapis";

class EmailAgent {
  constructor(tokens) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials(tokens);
    this.gmail = google.gmail({ version: "v1", auth });
  }

  async readUnreadEmails() {
    const res = await this.gmail.users.messages.list({
      userId: "me",
      q: "is:unread"
    });
    return res.data.messages || [];
  }

  async sendEmail(to, subject, body) {
    const message = Buffer.from(
      `To: ${to}\r\nSubject: ${subject}\r\n\r\n${body}`
    ).toString("base64");

    await this.gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: message }
    });
  }
}

export default EmailAgent;