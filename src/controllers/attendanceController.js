import { prisma } from "../app.js";

export const scanQR = async (req, res) => {
  try {
    const { qrCodeHash } = req.body;

    const member = await prisma.member.findUnique({
      where: { qrCodeHash },
      include: { attendanceRecords: true },
    });

    if (!member) return res.status(404).json({ message: "Invalid QR Code" });

    const status = new Date(member.membershipEnd) >= new Date() ? "ACTIVE" : "EXPIRED";

    if (status === "ACTIVE") {
      await prisma.attendance.create({
        data: { memberId: member.id },
      });
    }

    const attendanceCount = member.attendanceRecords.length + 1;

    res.json({
      fullName: member.fullName,
      membershipEnd: member.membershipEnd,
      status,
      attendanceCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing scan" });
  }
};
