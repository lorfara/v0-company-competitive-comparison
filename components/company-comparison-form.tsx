"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    console.log("[v0] Form submitted with companies:", company1, "vs", company2)
    console.log("[v0] API key provided (first 8 chars):", apiKey.slice(0, 8) + "...")
    onSubmit(company1.trim(), company2.trim(), apiKey.trim())
  }

  const isValid = company1.trim() && company2.trim() && apiKey.trim()

  return (
    <Card className="w-full border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Compare Companies
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter two company names and your OpenAI API key to generate a detailed
          competitive analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="company1"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                Company Name 1
              </Label>
              <Input
                id="company1"
                placeholder="e.g. Apple"
                value={company1}
                onChange={(e) => setCompany1(e.target.value)}
                disabled={isLoading}
                className="bg-background"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="company2"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                Company Name 2
              </Label>
              <Input
                id="company2"
                placeholder="e.g. Samsung"
                value={company2}
                onChange={(e) => setCompany2(e.target.value)}
                disabled={isLoading}
                className="bg-background"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="apiKey"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Key className="h-3.5 w-3.5 text-muted-foreground" />
              OpenAI API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isLoading}
              className="bg-background font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is sent directly to OpenAI and never stored.
            </p>
          </div>
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full sm:w-auto sm:self-end"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Compare
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
