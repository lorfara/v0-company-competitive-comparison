"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Key, Loader2, ArrowRight } from "lucide-react"

interface CompanyComparisonFormProps {
  onSubmit: (company1: string, company2: string, apiKey: string) => void
  isLoading: boolean
}

export function CompanyComparisonForm({
  onSubmit,
  isLoading,
}: CompanyComparisonFormProps) {
  const [company1, setCompany1] = useState("")
  const [company2, setCompany2] = useState("")
  const [apiKey, setApiKey] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company1.trim() || !company2.trim() || !apiKey.trim()) return
    onSubmit(company1.trim(), company2.trim(), apiKey.trim())
  }

  const isValid = company1.trim() && company2.trim() && apiKey.trim()

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-1 pb-6">
        <h2 className="text-lg font-semibold tracking-tight text-card-foreground">
          Compare Companies
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter two company names and your OpenAI API key to begin.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="company1"
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              <Building2 className="h-3 w-3" />
              Company 1
            </Label>
            <Input
              id="company1"
              placeholder="e.g. Apple"
              value={company1}
              onChange={(e) => setCompany1(e.target.value)}
              disabled={isLoading}
              className="border-border/60 bg-background placeholder:text-muted-foreground/40"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="company2"
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              <Building2 className="h-3 w-3" />
              Company 2
            </Label>
            <Input
              id="company2"
              placeholder="e.g. Samsung"
              value={company2}
              onChange={(e) => setCompany2(e.target.value)}
              disabled={isLoading}
              className="border-border/60 bg-background placeholder:text-muted-foreground/40"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="apiKey"
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            <Key className="h-3 w-3" />
            OpenAI API Key
          </Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={isLoading}
            className="border-border/60 bg-background font-mono text-sm placeholder:text-muted-foreground/40"
          />
          <p className="text-[11px] text-muted-foreground/60">
            Sent directly to OpenAI. Never stored on our servers.
          </p>
        </div>
        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Run Analysis
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
