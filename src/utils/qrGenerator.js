import QRCode from "qrcode";

export async function generateQR(data) {
  try {
    const qrImage = await QRCode.toDataURL(data);
    return qrImage;
  } catch (error) {
    console.error("QR Generation Error:", error);
    throw error;
  }
}
