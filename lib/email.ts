export type EmailPayload = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmailStub(payload: EmailPayload) {
  // TODO: plug in a real email provider (SendGrid, Postmark, SES) here.
  console.log("Email stub ->", payload);
}
