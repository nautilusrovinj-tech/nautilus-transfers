import axios from "axios";

const WHATSAPP_API_VERSION = "v23.0";

function getWhatsAppConfig() {
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

  return {
    phoneNumberId,
    accessToken,
  };
}

/**
 * Send the first transfer-assignment notification.
 *
 * Template:
 * new_transfer_assigned
 *
 * Variables:
 * {{1}} Transfer number
 * {{2}} Date
 * {{3}} Time
 * {{4}} Pickup
 * {{5}} Destination
 * {{6}} Passenger
 */
export async function sendWhatsAppTemplate(
  to: string,
  transferNumber: string,
  date: string,
  time: string,
  pickup: string,
  destination: string,
  passenger: string
) {
  const {
    phoneNumberId,
    accessToken,
  } = getWhatsAppConfig();

  console.log(
    "================================"
  );
  console.log(
    "Sending WhatsApp assignment template"
  );
  console.log("To:", to);
  console.log(
    "Template: new_transfer_assigned"
  );
  console.log(
    "================================"
  );

  try {
    const response = await axios.post(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",

        to,

        type: "template",

        template: {
          name: "new_transfer_assigned",

          language: {
            code: "en",
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
          "Content-Type":
            "application/json",
        },
      }
    );

    console.log(
      "WhatsApp assignment response:",
      response.data
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "========== WHATSAPP ASSIGNMENT ERROR =========="
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

/**
 * Send the 2-hour transfer reminder.
 *
 * Template:
 * transfer_reminder_2h
 *
 * Variables:
 * {{1}} Transfer number
 * {{2}} Date
 * {{3}} Time
 * {{4}} Pickup
 * {{5}} Destination
 * {{6}} Passenger
 */
export async function sendWhatsAppReminder(
  to: string,
  transferNumber: string,
  date: string,
  time: string,
  pickup: string,
  destination: string,
  passenger: string
) {
  const {
    phoneNumberId,
    accessToken,
  } = getWhatsAppConfig();

  console.log(
    "================================"
  );
  console.log(
    "Sending WhatsApp 2-hour reminder"
  );
  console.log("To:", to);
  console.log(
    "Template: transfer_reminder_2h"
  );
  console.log(
    "================================"
  );

  try {
    const response = await axios.post(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",

        to,

        type: "template",

        template: {
          name: "transfer_reminder_2h",

          language: {
            code: "en",
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
          "Content-Type":
            "application/json",
        },
      }
    );

    console.log(
      "WhatsApp reminder response:",
      response.data
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "========== WHATSAPP REMINDER ERROR =========="
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