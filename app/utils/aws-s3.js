import AWS from "aws-sdk";
import message from "aws-sdk/lib/maintenance_mode_message.js";
message.suppress = true;

const s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadToS3 = async (buffer) => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Body: buffer, // pass file body
            Key: "radhakishan-dev-test.pdf", // pass key filename
            ContentType: 'application/pdf'
        };

        const result = await s3Client.upload(params).promise();
        console.log("aws uploaded");
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export { uploadToS3 };
