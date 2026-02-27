export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not set in Vercel environment variables" });
  }

  const { mode, text, image } = req.body;

  const systemPrompt = `You are an expert grants analyst for RGN, a South African labour rights NPO.
Extract funder/grant information and return ONLY valid JSON (no markdown, no explanation) with these exact keys:
{
  "grantName": "descriptive opportunity name based on funder + focus",
  "funderName": "exact funder organisation name",
  "applicationURL": "full website URL if mentioned, else empty string",
  "description": "2-3 sentence description of the funder's focus areas and what they fund",
  "contactName": "contact person name if mentioned, else empty string",
  "contactEmail": "email if mentioned, else empty string",
  "contactPhone": "phone if mentioned, else empty string",
  "funderType": "one of: Government, Private Foundation, Corporate CSI, Government SETA, International Foundation, Corporate ESD, Bilateral Donor, Trust, DFI",
  "categoryTag": "one of: Labour Rights, Access to Justice, Youth Employment, Skills Training, Worker Education, Legal Empowerment, Civil Society, Social Justice, Gender Justice, Economic Justice, Enterprise Development, Digital Skills",
  "amountRequested": "funding amount range if mentioned (e.g. R450,000-R720,000) else empty string",
  "eligibilityStatus": "who can apply - summarise eligibility requirements",
  "pillar": "one of: Labour Justice & Inclusion, Skills Development & Workforce Acceleration, Enterprise Development & Formalisation, Market Access & Aggregation",
  "sectors": ["1-3 items from: Labour & Legal Services, Skills Development (SETA/QCTO), Digital & 4IR, Personal Care & Beauty, Cleaning & Hygiene, Green Economy & Agritech, Manufacturing, Creative Industries, Technical Trades, Healthcare, Retail & Township Trade, Youth Employability, Cooperative Development, Infrastructure & Innovation Hubs, Funding & Investment Facilitation"],
  "province": "one of: Gauteng, Western Cape, KwaZulu-Natal, Eastern Cape, Limpopo, Mpumalanga, North West, Free State, Northern Cape, National",
  "revenueType": "one of: Grant, Corporate Contract, Management Fee, Hybrid, SETA Levy, CSI, International Aid",
  "strategicAlignmentScore": 4,
  "loiDeadline": "YYYY-MM-DD if deadline mentioned else empty string",
  "fullProposalDeadline": "YYYY-MM-DD if mentioned else empty string",
  "internalReviewDeadline": "empty string",
  "sustainabilityPlan": "any sustainability or long-term notes mentioned",
  "revenueDiversification": "any revenue or diversification notes",
  "status": "Opportunity Identified"
}`;

  const userContent = mode === "text"
    ? [{ type: "text", text: `Extract all grant opportunity information from this text and return as the specified JSON:\n\n${text}` }]
    : [
        { type: "image", source: { type: "base64", media_type: "image/png", data: image } },
        { type: "text", text: "Extract all grant/funder information visible in this image and return as the specified JSON." }
      ];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: "Anthropic API error: " + errText });
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("AI import error:", err);
    return res.status(500).json({ error: err.message || "Failed to parse AI response" });
  }
}
