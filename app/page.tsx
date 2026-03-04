"use client"

import { useState } from "react"
import { CompanyComparisonForm } from "@/components/company-comparison-form"
import { ComparisonResult } from "@/components/comparison-result"
import { ErrorDisplay } from "@/components/error-display"
import { compareCompanies, type ComparisonData } from "@/lib/openai"
import { Zap, Shield, GitCompareArrows } from "lucide-react"

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

    const response = await compareCompanies({ company1, company2, apiKey })

    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setResult(response.data)
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <GitCompareArrows className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            CompareAI
          </span>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
            Beta
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12">
        {/* Hero */}
        <section className="flex flex-col gap-4 pb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl">
            AI-Powered
            <br />
            <span className="text-primary">Competitive Intelligence</span>
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            Enter two companies to generate an instant, detailed side-by-side
            competitive analysis powered by GPT-4o-mini.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Instant results
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-primary" />
              API key never stored
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="pb-10">
          <CompanyComparisonForm onSubmit={handleCompare} isLoading={isLoading} />
        </section>

        {/* Loading state */}
        {isLoading && (
          <section className="animate-in fade-in flex flex-col items-center gap-4 py-16 duration-300">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-10 w-10 animate-ping rounded-full bg-primary/20" />
              <div className="relative h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Analyzing competitive landscape...
            </p>
          </section>
        )}

        {/* Error */}
        {error && (
          <section className="pb-10">
            <ErrorDisplay message={error} />
          </section>
        )}

        {/* Results */}
        {result && companies && (
          <section className="pb-10">
            <ComparisonResult
              data={result}
              company1={companies.company1}
              company2={companies.company2}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <p className="text-[11px] text-muted-foreground/60">
            Powered by OpenAI GPT-4o-mini
          </p>
          <p className="text-[11px] text-muted-foreground/60">
            Your API key is never stored
          </p>
        </div>
      </footer>
    </div>
  )
}
