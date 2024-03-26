import { SendMailClient } from "zeptomail";
const url = "api.zeptomail.in/";
const token = process.env.EMAIL_TOKEN;

export const sendEMAIL = async (
    email_to,
    subject,
    body,
    html = "<div></div>",
    attachments = ""
) => {
    try {
        let client = new SendMailClient({ url, token });

        let res = await client.sendMail({
            bounce_address: "prefix@subdomain.bidsinfoglobal.com",
            from:
            {
                address: "noreply@bidsinfoglobal.com",
                name: "noreply"
            },
            to: email_to,
            "subject": subject,
            "textbody": body,
            "htmlbody": html,
            "attachments": attachments
        });

        return res;

    } catch (error) {
        console.log(
            "🚀 ~ file: email.util.js ~ line 16 ~ sendEMAIL ~ error",
            error,
        );
        throw new Error(error);
    }
};