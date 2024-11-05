import { SendMailClient } from "zeptomail";
const url = "api.zeptomail.in/";
const token = "Zoho-enczapikey PHtE6r0KSri932d99xIJ5/fqFpb1Y4gsr+sxKgNFt9tEAvEDGE0H+IwtxjHjo098UaMWHaSbyt1hte+es+LTJWjtZ2ZNVGqyqK3sx/VYSPOZsbq6x00ZtFUbc0DdVIfuetFr1Czfvt3bNA==";

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
            bounce_address: "bounce@bounce-zem.bidsinfoglobal.com",
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
            JSON.stringify(error),
        );
        // throw new Error(JSON.stringify( error));
    }
};
