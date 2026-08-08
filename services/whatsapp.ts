import axios from "axios";

export async function sendWhatsAppTemplate(
  to: string,
  transferNumber: string,
  date: string,
  time: string,
  pickup: string,
  destination: string,
  passenger: string
) {
  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  const accessToken =
    process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId) {
    throw new Error(
      "WHATSAPP_PHONE_NUMBER_ID is missing"
    );
  }

  if (!accessToken) {
    throw new Error(
      "WHATSAPP_ACCESS_TOKEN is missing"
    );
  }

  console.log(
    "Sending WhatsApp template to:",
    to
  );

  console.log(
    "Phone Number ID:",
    phoneNumberId
  );

  console.log(
    "Template: new_transfer_assigned"
  );

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",

        to,

        type: "template",

        template: {
          name: "new_transfer_assigned",

          language: {
            code: "en_US",
          },

          components: [
            {
              type: "body",

              parameters: [
                {
                  type: "text",
                  text: transferNumber,
                },
                {
                  type: "text",
                  text: date,
                },
                {
                  type: "text",
                  text: time,
                },
                {
                  type: "text",
                  text: pickup,
                },
                {
                  type: "text",
                  text: destination,
                },
                {
                  type: "text",
                  text: passenger,
                },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "WhatsApp template response:",
      response.data
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "========== WHATSAPP TEMPLATE ERROR =========="
    );

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "Data:",
      JSON.stringify(
        error.response?.data,
        null,
        2
      )
    );

    console.error(
      "Message:",
      error.message
    );

    throw error;
  }
}