import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configure email transporter (using Gmail or custom SMTP)
const createEmailTransporter = () => {
  // Using environment variables for email configuration
  // You can use Gmail SMTP or any other email service
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'your-app-password',
    },
  });
};

export const getJobsHandler = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const jobs = await prisma.job.findMany({
      skip,
      take: limit,
      orderBy: { postedAt: "desc" },
    });

    const total = await prisma.job.count();

    return res.status(200).json({
      data: jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ getJobs error:", error);
    return res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

/**
 * Send application email when user applies for a job
 * POST /api/alerts/send-application-email
 */
export const sendApplicationEmailHandler = async (req: Request, res: Response) => {
  console.log('Request received at /api/alerts/send-application-email');
  try {
    const { jobId, jobTitle, company, jobLocation, atsScore, applicantName, applicantEmail, hrEmail, applicantResume } = req.body;

    if (!jobId || !company || !applicantEmail || !hrEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(hrEmail)) {
      return res.status(400).json({ message: 'Invalid HR email address' });
    }
    
    if (!applicantResume) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const transporter = createEmailTransporter();

    // Email content
    const emailContent = `
      <h2>New Job Application</h2>
      <p><strong>Applicant Name:</strong> ${applicantName}</p>
      <p><strong>Applicant Email:</strong> ${applicantEmail}</p>
      <p><strong>Job Title:</strong> ${jobTitle}</p>
      <p><strong>Location:</strong> ${jobLocation}</p>
      <p><strong>ATS Match Score:</strong> ${atsScore}%</p>
      <hr />
      <p>This is an automated application from the AI Job Alert System.</p>
      <p>Please contact the applicant directly at ${applicantEmail} to discuss the position.</p>
    `;

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_USER || 'noreply@aijobsalert.com',
      to: hrEmail,
      subject: `New Application for ${jobTitle} - ${applicantName}`,
      html: emailContent,
      replyTo: applicantEmail,
    };

    if (applicantResume) {
      mailOptions.attachments = [
        {
          filename: 'resume.txt',
          content: applicantResume,
        },
      ];
    }

    // Send email with error handling
    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Application email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send application email:', error);
      // Even if email fails, the application is still "successful" on the frontend
      // You may want to add more robust error handling or a retry mechanism here
      return res.status(500).json({
        message: 'Application recorded, but failed to send HR notification.',
        jobId,
        appliedAt: new Date().toISOString()
      });
    }

    // Return success immediately
    return res.status(200).json({
      message: `Application recorded. HR notification sent to ${hrEmail}`,
      jobId,
      appliedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ sendApplicationEmail error:', error);
    return res.status(500).json({ message: 'Error processing application' });
  }
};
