"use client"

import { useState } from "react"
import { CompanyComparisonForm } from "@/components/company-comparison-form"
import { ComparisonResult } from "@/components/comparison-result"
import { ErrorDisplay } from "@/components/error-display"
import { compareCompanies, type ComparisonData } from "@/lib/openai"
import { BarChart3 } from "lucide-react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ComparisonData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [companies, setCompanies] = useState<{
    company1: string
    company2: string
  } | null>(null)

  const handleCompare = async (
    company1: string,
    company2: string,
    apiKey: string
  ) => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setCompanies({ company1, company2 })

    console.log("[v0] Starting comparison:", company1, "vs", company2)

    const response = await compareCompanies({ company1, company2, apiKey })

    if (response.error) {
      console.log("[v0] Comparison failed:", response.error)
      setError(response.error)
    } else if (response.data) {
      console.log("[v0] Comparison succeeded, rows:", response.data.rows.length)
      setResult(response.data)
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Competitor Analysis
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            AI-Powered Company Comparison
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Enter two company names and your OpenAI API key to generate an
            instant, detailed competitive analysis powered by GPT-4o-mini.
          </p>
        </div>

        <CompanyComparisonForm onSubmit={handleCompare} isLoading={isLoading} />

        {isLoading && (
          <div className="animate-in fade-in flex flex-col items-center gap-3 py-12 duration-300">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/30 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/30 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/30 [animation-delay:300ms]" />
            </div>
            <p className="text-sm text-muted-foreground">
              Analyzing competitive landscape...
            </p>
          </div>
        )}

        {error && <ErrorDisplay message={error} />}

        {result && companies && (
          <ComparisonResult
            data={result}
            company1={companies.company1}
            company2={companies.company2}
          />
        )}
      </main>

      <footer className="border-t border-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Powered by OpenAI GPT-4o-mini
          </p>
          <p className="text-xs text-muted-foreground">
            Your API key is never stored
          </p>
        </div>
      </footer>
    </div>
  )
}
