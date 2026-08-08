import axios from "axios";

export async function sendWhatsApp(
  to: string,
  body: string
) {
  // Convert Croatian numbers to international format
  let phone = to.replace(/\D/g, "");

  if (phone.startsWith("0")) {
    phone = "385" + phone.substring(1);
  }

  console.log("================================");
  console.log("PHONE_NUMBER_ID:", process.env.WHATSAPP_PHONE_NUMBER_ID);
  console.log("BUSINESS_ACCOUNT_ID:", process.env.WHATSAPP_BUSINESS_ACCOUNT_ID);
  console.log("TOKEN EXISTS:", !!process.env.WHATSAPP_ACCESS_TOKEN);
  console.log("Sending to:", phone);
  console.log("Message:");
  console.log(body);
  console.log("================================");

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
          body,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("========== META RESPONSE ==========");
    console.log(
      JSON.stringify(response.data, null, 2)
    );
    console.log("===================================");

    return response.data;
  } catch (error: any) {
    console.error("========== WHATSAPP ERROR ==========");
    console.error("Status:", error.response?.status);
    console.error(
      JSON.stringify(error.response?.data, null, 2)
    );
    console.error("Message:", error.message);
    console.error("====================================");

    throw error;
  }
}