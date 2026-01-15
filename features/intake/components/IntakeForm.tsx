/**
 * features/intake/components/IntakeForm.tsx
 *
 * Airbnb-style problem intake form component.
 * Clean, minimal design with clear field grouping.
 *
 * Related:
 * - features/intake/hooks/useIntakeForm.ts
 * - features/intake/types/index.ts
 */

'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useIntakeForm } from '../hooks/useIntakeForm'
import type { IntakeDictionary, IntakeLocale, CompanySize, BudgetRange, Urgency } from '../types'

interface IntakeFormProps {
  dictionary: IntakeDictionary
  onSuccess: () => void
}

export function IntakeForm({ dictionary, onSuccess }: IntakeFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
  } = useIntakeForm({ dictionary, onSuccess })

  const d = dictionary.form

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="space-y-8"
    >
      {/* Required Fields Section */}
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-medium">
            {d.title} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('title', e.target.value)}
            placeholder={d.titlePlaceholder}
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Problem Description */}
        <div className="space-y-2">
          <Label htmlFor="problemDescription" className="text-base font-medium">
            {d.problemDescription} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="problemDescription"
            value={formData.problemDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('problemDescription', e.target.value)}
            placeholder={d.problemDescriptionPlaceholder}
            rows={4}
            className={errors.problemDescription ? 'border-destructive' : ''}
          />
          {errors.problemDescription && (
            <p className="text-sm text-destructive">{errors.problemDescription}</p>
          )}
        </div>

        {/* Desired Outcome */}
        <div className="space-y-2">
          <Label htmlFor="desiredOutcome" className="text-base font-medium">
            {d.desiredOutcome} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="desiredOutcome"
            value={formData.desiredOutcome}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('desiredOutcome', e.target.value)}
            placeholder={d.desiredOutcomePlaceholder}
            rows={3}
            className={errors.desiredOutcome ? 'border-destructive' : ''}
          />
          {errors.desiredOutcome && (
            <p className="text-sm text-destructive">{errors.desiredOutcome}</p>
          )}
        </div>

        {/* Country & Language Row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-base font-medium">
              {d.country} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('country', e.target.value)}
              placeholder={d.countryPlaceholder}
              className={errors.country ? 'border-destructive' : ''}
            />
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="text-base font-medium">
              {d.language} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.language}
              onValueChange={(value: string) => updateField('language', value as IntakeLocale)}
            >
              <SelectTrigger className={errors.language ? 'border-destructive' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nl">{d.languageOptions.nl}</SelectItem>
                <SelectItem value="en">{d.languageOptions.en}</SelectItem>
                <SelectItem value="es">{d.languageOptions.es}</SelectItem>
                <SelectItem value="other">{d.languageOptions.other}</SelectItem>
              </SelectContent>
            </Select>
            {errors.language && (
              <p className="text-sm text-destructive">{errors.language}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-medium">
            {d.email} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('email', e.target.value)}
            placeholder={d.emailPlaceholder}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Optional Fields Section */}
      <div className="space-y-6 border-t pt-8">
        <p className="text-sm text-muted-foreground">{d.optional}</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Company Size */}
          <div className="space-y-2">
            <Label htmlFor="companySize" className="text-base font-medium">
              {d.companySize}
            </Label>
            <Select
              value={formData.companySize ?? ''}
              onValueChange={(value: string) =>
                updateField('companySize', value ? (value as CompanySize) : undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">{d.companySizeOptions.solo}</SelectItem>
                <SelectItem value="2_10">{d.companySizeOptions['2_10']}</SelectItem>
                <SelectItem value="11_50">{d.companySizeOptions['11_50']}</SelectItem>
                <SelectItem value="51_200">{d.companySizeOptions['51_200']}</SelectItem>
                <SelectItem value="over_200">{d.companySizeOptions.over_200}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <Label htmlFor="budgetRange" className="text-base font-medium">
              {d.budgetRange}
            </Label>
            <Select
              value={formData.budgetRange ?? ''}
              onValueChange={(value: string) =>
                updateField('budgetRange', value ? (value as BudgetRange) : undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under_1k">{d.budgetRangeOptions.under_1k}</SelectItem>
                <SelectItem value="1k_5k">{d.budgetRangeOptions['1k_5k']}</SelectItem>
                <SelectItem value="5k_15k">{d.budgetRangeOptions['5k_15k']}</SelectItem>
                <SelectItem value="15k_50k">{d.budgetRangeOptions['15k_50k']}</SelectItem>
                <SelectItem value="over_50k">{d.budgetRangeOptions.over_50k}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Urgency */}
          <div className="space-y-2">
            <Label htmlFor="urgency" className="text-base font-medium">
              {d.urgency}
            </Label>
            <Select
              value={formData.urgency ?? ''}
              onValueChange={(value: string) =>
                updateField('urgency', value ? (value as Urgency) : undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{d.urgencyOptions.low}</SelectItem>
                <SelectItem value="medium">{d.urgencyOptions.medium}</SelectItem>
                <SelectItem value="high">{d.urgencyOptions.high}</SelectItem>
                <SelectItem value="urgent">{d.urgencyOptions.urgent}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? d.submitting : d.submit}
        </Button>
      </div>
    </form>
  )
}
