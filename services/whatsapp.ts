import axios from "axios";

export async function sendWhatsApp(
  to: string,
  body: string
) {
  console.log("PHONE_NUMBER_ID:", process.env.WHATSAPP_PHONE_NUMBER_ID);
  console.log(
    "TOKEN EXISTS:",
    !!process.env.WHATSAPP_ACCESS_TOKEN
  );

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
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

    console.log(
      "META RESPONSE:",
      JSON.stringify(response.data, null, 2)
    );
    
    return response.data;
  } catch (error: any) {
    console.error("========== WHATSAPP ERROR ==========");
    console.error("Status:", error.response?.status);
    console.error(
      "Data:",
      JSON.stringify(error.response?.data, null, 2)
    );
    console.error("Message:", error.message);
  
    throw error;
  }
}