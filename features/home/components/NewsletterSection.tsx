/**
 * features/home/components/NewsletterSection.tsx
 *
 * Newsletter signup section with Convex backend.
 * Clean editorial styling with success state.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/page.tsx
 * - convex/newsletterLeads.ts
 */

'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Container, Section } from '@/components/layout'
import { Send, CheckCircle } from 'lucide-react'

interface NewsletterSectionProps {
  locale: 'nl' | 'en' | 'es'
  dictionary: {
    kicker: string
    title: string
    description: string
    placeholder: string
    button: string
    success: string
    error: string
  }
}

export function NewsletterSection({ locale, dictionary }: NewsletterSectionProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const subscribe = useMutation(api.newsletterLeads.subscribe)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'loading') return

    setStatus('loading')
    try {
      await subscribe({ email, locale, source: 'homepage' })
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section background="panel" className="border-y">
      <Container size="tight" className="text-center">
        <p className="kicker">{dictionary.kicker}</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          {dictionary.title}
        </h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          {dictionary.description}
        </p>

        {status === 'success' ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">{dictionary.success}</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
            suppressHydrationWarning
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={dictionary.placeholder}
              className="h-12 rounded-full px-5 sm:w-80"
              required
              suppressHydrationWarning
            />
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="h-12 rounded-full px-6 btn-hover-lift"
              suppressHydrationWarning
            >
              {status === 'loading' ? (
                <span className="animate-pulse">...</span>
              ) : (
                <>
                  {dictionary.button}
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-4 text-sm text-destructive">{dictionary.error}</p>
        )}
      </Container>
    </Section>
  )
}
