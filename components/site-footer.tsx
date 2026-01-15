/**
 * components/site-footer.tsx
 *
 * Premium site footer with clean editorial styling.
 * Content driven by Payload CMS SiteGlobal with fallbacks.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/layout.tsx
 * - lib/payload.ts
 * - payload/globals/SiteGlobal.ts
 */

import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout'

// Footer link from Payload
interface FooterLink {
  id: string
  label: string
  href: string
}

interface SiteFooterProps {
  locale: string
  siteName?: string
  copyright?: string
  footerLinks?: FooterLink[]
}

// Fallback labels by locale
const fallbackLabels: Record<string, Record<string, string>> = {
  nl: {
    tagline: 'De plek waar AI-bouwers samenkomen.',
    explore: 'Ontdek',
    pulse: 'Pulse',
    tools: 'Tools',
    pricing: 'Prijzen',
    about: 'Over ons',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Voorwaarden',
    copyright: 'Alle rechten voorbehouden.',
  },
  en: {
    tagline: 'Where AI builders come together.',
    explore: 'Explore',
    pulse: 'Pulse',
    tools: 'Tools',
    pricing: 'Pricing',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    copyright: 'All rights reserved.',
  },
  es: {
    tagline: 'Donde los constructores de IA se reúnen.',
    explore: 'Explorar',
    pulse: 'Pulse',
    tools: 'Herramientas',
    pricing: 'Precios',
    about: 'Nosotros',
    contact: 'Contacto',
    privacy: 'Privacidad',
    terms: 'Términos',
    copyright: 'Todos los derechos reservados.',
  },
}

// Use static year to avoid hydration mismatch
const CURRENT_YEAR = 2025

export const SiteFooter = memo(function SiteFooter({
  locale,
  siteName,
  copyright,
  footerLinks,
}: SiteFooterProps) {
  const fallback = fallbackLabels[locale] || fallbackLabels.nl
  const resolvedCopyright = copyright || fallback.copyright
  const resolvedSiteName = siteName || 'VibeCodeSpace'

  return (
    <footer className="border-t bg-muted/30">
      <Container size="wide" className="py-12 sm:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href={`/${locale}`} className="text-lg font-semibold">
              {resolvedSiteName}
            </Link>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {fallback.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold">Platform</h4>
            <nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href={`/${locale}/explore`} className="hover:text-foreground transition-colors">
                {fallback.explore}
              </Link>
              <Link href={`/${locale}/pulse`} className="hover:text-foreground transition-colors">
                {fallback.pulse}
              </Link>
              <Link href={`/${locale}/tools`} className="hover:text-foreground transition-colors">
                {fallback.tools}
              </Link>
              <Link href={`/${locale}/pricing`} className="hover:text-foreground transition-colors">
                {fallback.pricing}
              </Link>
            </nav>
          </div>

          {/* Company / CMS Footer Links */}
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              {footerLinks?.length ? (
                footerLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href.startsWith('/') ? `/${locale}${link.href}` : link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                <>
                  <Link href={`/${locale}/about`} className="hover:text-foreground transition-colors">
                    {fallback.about}
                  </Link>
                  <Link href={`/${locale}/contact`} className="hover:text-foreground transition-colors">
                    {fallback.contact}
                  </Link>
                  <Link href={`/${locale}/privacy`} className="hover:text-foreground transition-colors">
                    {fallback.privacy}
                  </Link>
                  <Link href={`/${locale}/terms`} className="hover:text-foreground transition-colors">
                    {fallback.terms}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>© {CURRENT_YEAR} {resolvedSiteName}. {resolvedCopyright}</p>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/privacy`} className="hover:text-foreground transition-colors">
              {fallback.privacy}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-foreground transition-colors">
              {fallback.terms}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
})
