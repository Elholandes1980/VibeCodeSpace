/**
 * app/(frontend)/(public)/[locale]/layout.tsx
 *
 * Layout for all public pages with locale support.
 * Fetches site-wide content from Payload CMS.
 * Wraps pages with SiteHeader and SiteFooter.
 * Includes Tools mega menu rendered server-side.
 *
 * Related:
 * - app/(frontend)/layout.tsx
 * - lib/payload.ts
 * - lib/cms/navigation.ts
 * - components/site-header.tsx
 * - components/site-footer.tsx
 * - components/nav/MegaMenuPanel.tsx
 */

import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MegaMenuPanel } from '@/components/nav'
import { validateLocale } from '@/lib/i18n'
import { getSiteGlobal } from '@/lib/payload'
import { getToolsMegaMenu } from '@/lib/cms/navigation'
import type { Locale } from '@/features/cases/types'

// Fallback labels for mega menu footer
const megaMenuLabels: Record<string, string> = {
  nl: 'Alle tools bekijken',
  en: 'View all tools',
  es: 'Ver todas las herramientas',
}

interface PublicLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function PublicLayout({
  children,
  params,
}: PublicLayoutProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)

  // Fetch site-wide content and mega menu data in parallel
  const [siteGlobal, megaMenuData] = await Promise.all([
    getSiteGlobal(locale as Locale),
    getToolsMegaMenu(locale as Locale),
  ])

  // Render mega menu panel server-side (passed as children to client trigger)
  const megaMenuContent = megaMenuData ? (
    <MegaMenuPanel
      data={megaMenuData}
      locale={locale}
      allToolsLabel={megaMenuLabels[locale] || megaMenuLabels.nl}
    />
  ) : null

  return (
    <div className="flex min-h-screen flex-col" data-locale={locale}>
      <SiteHeader
        locale={locale}
        siteName={siteGlobal?.identity?.siteName}
        tagline={siteGlobal?.identity?.tagline}
        navigation={siteGlobal?.navigation?.primaryNav}
        ctaLabel={siteGlobal?.headerCtas?.primaryCtaLabel}
        ctaHref={siteGlobal?.headerCtas?.primaryCtaHref}
        megaMenuContent={megaMenuContent}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        locale={locale}
        siteName={siteGlobal?.identity?.siteName}
        copyright={siteGlobal?.footer?.copyright}
        footerLinks={siteGlobal?.footer?.footerLinks}
      />
    </div>
  )
}
