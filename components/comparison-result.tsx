"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeftRight } from "lucide-react"
import type { ComparisonData } from "@/lib/openai"
import { FeedbackForm } from "@/components/feedback-form"

interface ComparisonResultProps {
  data: ComparisonData
  company1: string
  company2: string
}

export function ComparisonResult({
  data,
  company1,
  company2,
}: ComparisonResultProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full duration-500">
      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-semibold tracking-tight">
              Analysis Results
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-medium">
                {company1}
              </Badge>
              <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground" />
              <Badge variant="secondary" className="font-medium">
                {company2}
              </Badge>
            </div>
          </div>
          {data.summary && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {data.summary}
            </p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Desktop table - hidden on small screens */}
          <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[160px] whitespace-nowrap font-semibold text-foreground">
                    Category
                  </TableHead>
                  <TableHead className="min-w-[200px] font-semibold text-foreground">
                    {company1}
                  </TableHead>
                  <TableHead className="min-w-[200px] font-semibold text-foreground">
                    {company2}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row, index) => (
                  <TableRow
                    key={index}
                    className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                  >
                    <TableCell className="whitespace-nowrap font-medium text-foreground">
                      {row.category}
                    </TableCell>
                    <TableCell className="text-sm leading-relaxed text-foreground/80">
                      {row.company1}
                    </TableCell>
                    <TableCell className="text-sm leading-relaxed text-foreground/80">
                      {row.company2}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card stack - visible only on small screens */}
          <div className="flex flex-col gap-4 md:hidden">
            {data.rows.map((row, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-background p-4"
              >
                <p className="mb-3 text-sm font-semibold text-foreground">
                  {row.category}
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <Badge variant="secondary" className="mb-1.5 text-xs font-medium">
                      {company1}
                    </Badge>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {row.company1}
                    </p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-1.5 text-xs font-medium">
                      {company2}
                    </Badge>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {row.company2}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.verdict && (
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="text-sm font-medium text-foreground">Verdict</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {data.verdict}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Form - appears after analysis results */}
      <div className="mt-8">
        <FeedbackForm />
      </div>
    </div>
  )
}
