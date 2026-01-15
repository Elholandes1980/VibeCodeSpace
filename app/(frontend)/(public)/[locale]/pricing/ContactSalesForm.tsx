/**
 * app/(frontend)/(public)/[locale]/pricing/ContactSalesForm.tsx
 *
 * Contact sales form for enterprise inquiries.
 * Submits to Convex salesLeads table.
 *
 * Related:
 * - convex/salesLeads.ts
 * - app/(frontend)/(public)/[locale]/pricing/page.tsx
 */

'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle } from 'lucide-react'

interface ContactSalesFormProps {
  locale: 'nl' | 'en' | 'es'
  dictionary: {
    name: string
    email: string
    company: string
    message: string
    submit: string
    success: string
    error: string
  }
}

export function ContactSalesForm({ locale, dictionary }: ContactSalesFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const submit = useMutation(api.salesLeads.submit)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'loading') return

    setStatus('loading')
    try {
      await submit({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        message: formData.message,
        plan: 'enterprise',
        locale,
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="h-12 w-12 text-primary mb-4" />
        <p className="text-lg font-medium">{dictionary.success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{dictionary.name}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{dictionary.email}</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">{dictionary.company}</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{dictionary.message}</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          required
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-destructive">{dictionary.error}</p>
      )}

      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? '...' : dictionary.submit}
      </Button>
    </form>
  )
}
