import { prisma } from "../app.js";
import { generateQR } from "../utils/qrGenerator.js";
import crypto from "crypto";

// Create new member and generate QR code
export const createMember = async (req, res) => {
  try {
    const { fullName, phoneNumber, membershipStart, membershipEnd } = req.body;

    const qrCodeHash = crypto.randomUUID();

    const member = await prisma.member.create({
      data: {
        fullName,
        phoneNumber,
        membershipStart: new Date(membershipStart),
        membershipEnd: new Date(membershipEnd),
        qrCodeHash,
      },
    });

    const qrCode = await generateQR(qrCodeHash);

    return res.json({ member, qrCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Renew membership
export const renewMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { extraDays } = req.body;

    const member = await prisma.member.update({
      where: { id },
      data: {
        membershipEnd: {
          increment: extraDays * 24 * 60 * 60 * 1000,
        },
      },
    });

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Error renewing membership" });
  }
};

// Get member details + attendance count
export const getMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({
      where: { id },
      include: { attendanceRecords: true },
    });

    if (!member) return res.status(404).json({ message: "Member not found" });

    const attendanceCount = member.attendanceRecords.length;
    const status = new Date(member.membershipEnd) >= new Date() ? "ACTIVE" : "EXPIRED";

    res.json({ member, status, attendanceCount });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
