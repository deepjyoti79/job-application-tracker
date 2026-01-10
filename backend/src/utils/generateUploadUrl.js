import "dotenv/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import s3 from "../config/s3.js";

const generateUploadUrl = async ({ userId }) => {
  const key = `resumes/${userId}/${uuidv4()}.pdf`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: "application/pdf",
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  return { uploadUrl, key };
};

export { generateUploadUrl };
