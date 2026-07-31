import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Booking text is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          temperature: 0,
          text: {
            format: {
              type: "json_schema",
              name: "booking",
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  clientName: { type: "string" },
                  phone: { type: "string" },
                  email: { type: "string" },

                  date: { type: "string" },
                  time: { type: "string" },

                  pickup: { type: "string" },
                  destination: { type: "string" },

                  flight: { type: "string" },
                  transferType: { type: "string" },

                  adults: { type: "number" },
                  children: { type: "number" },
                  babySeats: { type: "number" },
                  boosterSeats: { type: "number" },

                  vehicle: { type: "string" },
                  partner: { type: "string" },

                  price: { type: "number" },

                  notes: { type: "string" }
                },
                required: [
                  "clientName",
                  "phone",
                  "email",
                  "date",
                  "time",
                  "pickup",
                  "destination",
                  "flight",
                  "transferType",
                  "adults",
                  "children",
                  "babySeats",
                  "boosterSeats",
                  "vehicle",
                  "partner",
                  "price",
                  "notes"
                ]
              }
            }
          },
          input: [
            {
              role: "system",
              content: `
You are an expert airport transfer dispatcher.

Extract booking information from emails, WhatsApp messages and booking confirmations.

Rules:

- Return ONLY JSON.
- Never invent information.
- Unknown strings = ""
- Unknown numbers = 0

Transfer Type:

Arrival
- Airport -> Hotel
- Airport -> Address
- Flight arriving

Departure
- Hotel -> Airport
- Address -> Airport
- Flight departing

Tour
- Tour
- Sightseeing
- Chauffeur hire
- Windsor
- Stonehenge
- Oxford
- Cotswolds

Local
- Anything else.

Flight:
- Keep SHORT.
- Examples:
BA216
EK001
FR5487
VS45

Never expand airline names.

Passengers:

Examples:
2 adults
2 pax
2 passengers
2A
=> adults = 2

1 child
1CH
=> children = 1

Baby Seats:

Examples:
baby seat
infant seat
rear facing

Booster Seats:

Examples:
booster
child booster

Price:
Numbers only.
Remove £, €, $, commas.

Notes:
Store any remaining useful information.
`
            },
            {
              role: "user",
              content: text
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();

      console.error(error);

      return NextResponse.json(
        { error: "OpenAI request failed." },
        { status: 500 }
      );
    }

    const result = await response.json();

    const output =
      result.output?.find(
        (item: any) => item.type === "message"
      );

    const json =
      output?.content?.find(
        (item: any) => item.type === "output_text"
      )?.text;

    if (!json) {
      return NextResponse.json(
        { error: "No AI response received." },
        { status: 500 }
      );
    }

    return NextResponse.json(JSON.parse(json));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to extract booking." },
      { status: 500 }
    );
  }
}