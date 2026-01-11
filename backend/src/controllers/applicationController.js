import Application from "../models/Application.js";

const createApplication = async (req, res) => {
  const {
    companyName,
    jobTitle,
    jobType,
    jobLocation,
    jobUrl,
    status,
    appliedDate,
    resumeId,
    source,
    notes,
  } = req.body;
  try {
    if (!companyName || !jobTitle) {
      return res
        .status(400)
        .json({ message: "Company name and Job title are required." });
    }

    const newApplication = await Application.create({
      userId: req.user.id,
      companyName,
      jobTitle,
      jobType,
      jobLocation,
      jobUrl,
      status,
      appliedDate,
      resumeId,
      source,
      notes,
    });

    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

const updateApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Failed to update application" });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedApplication = await Application.findByIdAndDelete(id);

    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Failed to delete application" });
  }
};

export {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
};
