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
 * Clean text for WhatsApp template parameters.
 *
 * Meta does not allow:
 * - new lines
 * - tabs
 * - 5 or more consecutive spaces
 */
function cleanTemplateParameter(
  value: string | null | undefined
) {
  return String(value ?? "-")
    .replace(/[\r\n\t]+/g, " | ")
    .replace(/ {5,}/g, " ")
    .trim();
}

/**
 * Send the first transfer-assignment notification.
 *
 * Template:
 * new_transfer_assigned
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

  console.log("================================");
  console.log(
    "Sending WhatsApp assignment template"
  );
  console.log("To:", to);
  console.log(
    "Template: new_transfer_assigned"
  );
  console.log("================================");

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
          "Content-Type": "application/json",
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

  console.log("================================");
  console.log(
    "Sending WhatsApp 2-hour reminder"
  );
  console.log("To:", to);
  console.log(
    "Template: transfer_reminder_2h"
  );
  console.log("================================");

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
          "Content-Type": "application/json",
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

/**
 * Send guest transfer confirmation.
 *
 * Template:
 * guest_transfer_confirmation
 *
 * Variables:
 *
 * {{1}} Guest name
 * {{2}} Transfer number
 * {{3}} Date + time
 * {{4}} Transfer details
 * {{5}} Driver details
 *
 * IMPORTANT:
 * Meta WhatsApp template parameters cannot contain
 * newline or tab characters.
 */
export async function sendGuestTransferConfirmation(
  to: string,
  guestName: string,
  transferNumber: string,
  dateTime: string,
  transferDetails: string,
  driverDetails: string
) {
  const {
    phoneNumberId,
    accessToken,
  } = getWhatsAppConfig();

  /*
   * Clean all template variables before sending them
   * to Meta.
   */
  const cleanGuestName =
    cleanTemplateParameter(
      guestName
    );

  const cleanTransferNumber =
    cleanTemplateParameter(
      transferNumber
    );

  const cleanDateTime =
    cleanTemplateParameter(
      dateTime
    );

  const cleanTransferDetails =
    cleanTemplateParameter(
      transferDetails
    );

  const cleanDriverDetails =
    cleanTemplateParameter(
      driverDetails
    );

  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    "GUEST TRANSFER CONFIRMATION"
  );
  console.log(
    "=============================================="
  );

  console.log(
    "To:",
    to
  );

  console.log(
    "Template:",
    "guest_transfer_confirmation"
  );

  console.log(
    "PARAMETER 1 - Guest name:",
    cleanGuestName
  );

  console.log(
    "PARAMETER 2 - Transfer number:",
    cleanTransferNumber
  );

  console.log(
    "PARAMETER 3 - Date + time:",
    cleanDateTime
  );

  console.log(
    "PARAMETER 4 - Transfer details:",
    cleanTransferDetails
  );

  console.log(
    "PARAMETER 5 - Driver details:",
    cleanDriverDetails
  );

  console.log(
    "=============================================="
  );

  try {
    const response = await axios.post(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",

        to,

        type: "template",

        template: {
          name: "guest_transfer_confirmation",

          language: {
            code: "en",
          },

          components: [
            {
              type: "body",

              parameters: [
                {
                  type: "text",
                  text: cleanGuestName,
                },

                {
                  type: "text",
                  text: cleanTransferNumber,
                },

                {
                  type: "text",
                  text: cleanDateTime,
                },

                {
                  type: "text",
                  text: cleanTransferDetails,
                },

                {
                  type: "text",
                  text: cleanDriverDetails,
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

    console.log("");
    console.log(
      "GUEST WHATSAPP API RESPONSE:"
    );

    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    console.log(
      "=============================================="
    );

    return response.data;
  } catch (error: any) {
    console.error("");
    console.error(
      "=============================================="
    );

    console.error(
      "GUEST WHATSAPP CONFIRMATION ERROR"
    );

    console.error(
      "=============================================="
    );

    console.error(
      "HTTP status:",
      error.response?.status
    );

    console.error(
      "Meta response:"
    );

    console.error(
      JSON.stringify(
        error.response?.data ?? null,
        null,
        2
      )
    );

    console.error(
      "Error message:",
      error.message
    );

    console.error(
      "=============================================="
    );

    throw error;
  }
}