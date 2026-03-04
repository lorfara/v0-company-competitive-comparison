export interface ComparisonRequest {
  company1: string
  company2: string
  apiKey: string
}

export interface ComparisonRow {
  category: string
  company1: string
  company2: string
}

export interface ComparisonData {
  summary: string
  rows: ComparisonRow[]
  verdict: string
}

export interface ComparisonResponse {
  data?: ComparisonData
  error?: string
}

export async function compareCompanies(
  request: ComparisonRequest
): Promise<ComparisonResponse> {
  const { company1, company2, apiKey } = request

  const systemPrompt = `You are a business analyst expert. Compare two companies and return your analysis as valid JSON only — no markdown, no code fences, no extra text. Use this exact structure:

{
  "summary": "A one-sentence overview of the comparison.",
  "rows": [
    { "category": "Description", "company1": "...", "company2": "..." },
    { "category": "Founded", "company1": "...", "company2": "..." },
    { "category": "Market Position", "company1": "...", "company2": "..." },
    { "category": "Core Products", "company1": "...", "company2": "..." },
    { "category": "Target Audience", "company1": "...", "company2": "..." },
    { "category": "Revenue / Scale", "company1": "...", "company2": "..." },
    { "category": "Strengths", "company1": "...", "company2": "..." },
    { "category": "Weaknesses", "company1": "...", "company2": "..." },
    { "category": "Competitive Edge", "company1": "...", "company2": "..." }
  ],
  "verdict": "A concise 1-2 sentence verdict on how they compare."
}

Keep each cell value concise (1-3 sentences max). Be factual and insightful.`

  const userPrompt = `Compare these two companies: "${company1}" vs "${company2}". Provide a detailed competitive analysis.`

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  }

  console.log("[v0] Sending request to OpenAI API with payload:", {
    model: payload.model,
    temperature: payload.temperature,
    max_tokens: payload.max_tokens,
    company1,
    company2,
  })

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    console.log("[v0] Received response from OpenAI API:", {
      status: response.status,
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      usage: data.usage,
      error: data.error,
    })

    if (!response.ok) {
      const errorMessage =
        data.error?.message || `API request failed with status ${response.status}`
      console.log("[v0] OpenAI API error:", errorMessage)
      return { data: undefined, error: errorMessage }
    }

    const result = data.choices?.[0]?.message?.content || ""
    console.log("[v0] Raw API response content:", result.slice(0, 300))

    try {
      const cleaned = result.replace(/```json\n?|```\n?/g, "").trim()
      const parsed: ComparisonData = JSON.parse(cleaned)
      console.log("[v0] Successfully parsed JSON comparison data, rows:", parsed.rows.length)
      return { data: parsed }
    } catch (parseErr) {
      console.log("[v0] JSON parse error, raw content:", result)
      return { data: undefined, error: "Failed to parse comparison data. Please try again." }
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
    console.log("[v0] Network/fetch error:", errorMessage)
    return { data: undefined, error: errorMessage }
  }
}
