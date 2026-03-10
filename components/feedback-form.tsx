"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormData {
  fullName: string
  email: string
  rating: number
  message: string
}

interface FormErrors {
  fullName?: string
  email?: string
  rating?: string
  message?: string
}

export function FeedbackForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    rating: 0,
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Feedback message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("feedback").insert({
        full_name: formData.fullName,
        email: formData.email,
        rating: formData.rating,
        message: formData.message,
      })

      if (error) {
        throw error
      }

      toast.success("Feedback submitted successfully!")

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        rating: 0,
        message: "",
      })
      setErrors({})
    } catch {
      toast.error("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }))
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full duration-500">
      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Share Your Feedback
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How was your experience with the competitive analysis? We&apos;d love to
            hear from you.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                aria-invalid={!!errors.fullName}
                disabled={isSubmitting}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                aria-invalid={!!errors.email}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Star Rating */}
            <div className="flex flex-col gap-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    disabled={isSubmitting}
                    className={cn(
                      "rounded-sm p-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "hover:scale-110 active:scale-95",
                      "disabled:pointer-events-none disabled:opacity-50"
                    )}
                    aria-label={`Rate ${star} out of 5 stars`}
                  >
                    <Star
                      className={cn(
                        "h-7 w-7 transition-colors",
                        (hoveredRating || formData.rating) >= star
                          ? "fill-primary text-primary"
                          : "fill-transparent text-muted-foreground/40"
                      )}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-sm text-destructive">{errors.rating}</p>
              )}
            </div>

            {/* Feedback Message */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Feedback Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us about your experience..."
                value={formData.message}
                onChange={handleInputChange}
                aria-invalid={!!errors.message}
                disabled={isSubmitting}
                rows={4}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto sm:self-end">
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
