import "dotenv/config";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import Resume from "../models/Resume.js";
import { generateUploadUrl } from "../utils/generateUploadUrl.js";

const uploadResume = async (req, res) => {
  const { fileName, contentType } = req.body;
  try {
    if (contentType !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    };

    const { uploadUrl, key } = await generateUploadUrl({ userId: req.user.id });

    const resume = new Resume({
      userId: req.user.id,
      fileName,
      s3key: key,
    });

    await resume.save();

    res.json({ uploadUrl, resume });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewResume = async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: resume.s3key,
  })

  const viewUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  res.json({ viewUrl });
  try {
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { uploadResume, viewResume };
