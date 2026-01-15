/**
 * components/site-header.tsx
 *
 * Premium site header with sticky behavior and glass effect.
 * Content driven by Payload CMS SiteGlobal with fallbacks.
 * Modern tech publication aesthetic with centered navigation.
 * Supports mega menu for Tools navigation item.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/layout.tsx
 * - lib/payload.ts
 * - payload/globals/SiteGlobal.ts
 * - components/nav/MegaMenuTrigger.tsx
 */

'use client'

import { memo, useState, useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { MegaMenuTrigger } from '@/components/nav'

// Navigation item from Payload
interface NavItem {
  id: string
  label: string
  href: string
  style?: 'default' | 'highlight'
  visibility?: 'public' | 'loggedIn' | 'pro' | 'studio'
  hasMegaMenu?: boolean
}

interface SiteHeaderProps {
  locale: string
  siteName?: string
  tagline?: string
  navigation?: NavItem[]
  ctaLabel?: string
  ctaHref?: string
  megaMenuContent?: ReactNode
}

// Available languages
const languages = [
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

// Fallback navigation (used when CMS data isn't available)
const defaultNavItems = [
  { id: 'home', label: 'Home', href: '', labelKey: 'home' },
  { id: 'explore', label: 'Ontdek', href: '/explore', labelKey: 'explore' },
  { id: 'pulse', label: 'Pulse', href: '/pulse', labelKey: 'pulse' },
  { id: 'tools', label: 'Tools', href: '/tools', labelKey: 'tools' },
  { id: 'pricing', label: 'Prijzen', href: '/pricing', labelKey: 'pricing' },
  { id: 'about', label: 'Over ons', href: '/about', labelKey: 'about' },
]

// Fallback labels by locale
const fallbackLabels: Record<string, Record<string, string>> = {
  nl: {
    home: 'Home',
    explore: 'Ontdek',
    pulse: 'Pulse',
    tools: 'Tools',
    pricing: 'Prijzen',
    about: 'Over ons',
    cta: 'Dien micro-probleem in',
    tagline: 'Vibe coding in praktijk',
  },
  en: {
    home: 'Home',
    explore: 'Explore',
    pulse: 'Pulse',
    tools: 'Tools',
    pricing: 'Pricing',
    about: 'About',
    cta: 'Submit micro-problem',
    tagline: 'Vibe coding in practice',
  },
  es: {
    home: 'Inicio',
    explore: 'Explorar',
    pulse: 'Pulse',
    tools: 'Herramientas',
    pricing: 'Precios',
    about: 'Nosotros',
    cta: 'Enviar micro-problema',
    tagline: 'Vibe coding en práctica',
  },
}

export const SiteHeader = memo(function SiteHeader({
  locale,
  siteName,
  tagline,
  navigation,
  ctaLabel,
  ctaHref,
  megaMenuContent,
}: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const fallback = fallbackLabels[locale] || fallbackLabels.nl

  // Use CMS navigation or fall back to defaults
  const navItems = navigation?.length
    ? navigation.filter((item) => item.visibility === 'public' || !item.visibility)
    : defaultNavItems

  // Resolved values with fallbacks
  const resolvedTagline = tagline || fallback.tagline
  const resolvedCtaLabel = ctaLabel || fallback.cta
  const resolvedCtaHref = ctaHref || '/micro-probleem'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`
    if (href === '' || href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`
    }
    return pathname.startsWith(fullPath)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'glass-panel border-b border-border/50 shadow-sm'
          : 'bg-background border-b border-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Tagline */}
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">
            {siteName || 'VibeCodeSpace'}
          </span>
          <span className="hidden text-sm text-muted-foreground sm:block">
            {resolvedTagline}
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            // Check if this item has a mega menu (Tools item)
            const isToolsItem = item.href === '/tools' && megaMenuContent

            if (isToolsItem) {
              return (
                <MegaMenuTrigger
                  key={item.id}
                  label={item.label}
                  isActive={isActive(item.href)}
                >
                  {megaMenuContent}
                </MegaMenuTrigger>
              )
            }

            return (
              <Link
                key={item.id}
                href={`/${locale}${item.href}`}
                className={cn(
                  'relative px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-[hsl(var(--accent))]'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[hsl(var(--accent))]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right CTA + Language */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher locale={locale} />

          <Button
            asChild
            size="sm"
            className="hidden rounded-full btn-accent btn-hover-lift sm:inline-flex"
          >
            <Link href={`/${locale}${resolvedCtaHref}`}>{resolvedCtaLabel}</Link>
          </Button>

          {/* Mobile menu button */}
          <MobileMenu
            locale={locale}
            navItems={navItems}
            ctaLabel={resolvedCtaLabel}
            ctaHref={resolvedCtaHref}
            isActive={isActive}
          />
        </div>
      </div>
    </header>
  )
})

// === Mobile Menu ===

interface MobileMenuProps {
  locale: string
  navItems: Array<{ id: string; label: string; href: string }>
  ctaLabel: string
  ctaHref: string
  isActive: (href: string) => boolean
}

function MobileMenu({ locale, navItems, ctaLabel, ctaHref, isActive }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-16 border-b border-border/50 bg-background p-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}${item.href}`}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent))]'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-border/50">
              <Button asChild size="sm" className="w-full rounded-full btn-accent">
                <Link href={`/${locale}${ctaHref}`} onClick={() => setIsOpen(false)}>
                  {ctaLabel}
                </Link>
              </Button>
            </div>

            {/* Mobile Language Switch */}
            <div className="mt-3 pt-3 border-t border-border/50">
              <MobileLanguageSwitch locale={locale} onClose={() => setIsOpen(false)} />
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}

// === Mobile Language Switch ===

interface MobileLanguageSwitchProps {
  locale: string
  onClose: () => void
}

function MobileLanguageSwitch({ locale, onClose }: MobileLanguageSwitchProps) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    const newPath = `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
    onClose()
  }

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLanguage(lang.code)}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            lang.code === locale
              ? 'bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent))]'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <span>{lang.flag}</span>
          <span>{lang.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )
}

// === Language Switcher ===

interface LanguageSwitcherProps {
  locale: string
}

function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find((l) => l.code === locale) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLanguage = (newLocale: string) => {
    // Replace current locale in pathname with new locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    const newPath = `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors',
          'text-muted-foreground hover:text-foreground hover:bg-muted',
          isOpen && 'bg-muted text-foreground'
        )}
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 min-w-[160px] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <div className="p-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  lang.code === locale
                    ? 'bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent))]'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1 text-left font-medium">{lang.label}</span>
                {lang.code === locale && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
