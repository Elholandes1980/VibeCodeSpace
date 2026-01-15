/**
 * components/nav/MegaMenuPanel.tsx
 *
 * Server component for mega menu content layout.
 * Renders categories, use cases, comparisons, and featured tool.
 * Premium Webflow-inspired design with calm aesthetics.
 *
 * Related:
 * - components/nav/MegaMenuTrigger.tsx
 * - lib/cms/navigation.ts
 */

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { ToolsMegaMenuData } from '@/lib/cms/navigation'

interface MegaMenuPanelProps {
  data: ToolsMegaMenuData
  locale: string
  allToolsLabel?: string
  allToolsHref?: string
}

export function MegaMenuPanel({
  data,
  locale,
  allToolsLabel = 'Alle tools bekijken',
  allToolsHref,
}: MegaMenuPanelProps) {
  const toolsHref = allToolsHref || `/${locale}/tools`
  const hasUseCases = data.useCaseLinks.length > 0
  const hasCompare = data.compareLinks.length > 0
  const hasFeatured = data.showFeatured && data.featuredTool

  return (
    <div className="p-6">
      {/* Main Grid */}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: hasFeatured
            ? 'minmax(200px, 1.5fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(180px, 1fr)'
            : 'minmax(200px, 1.5fr) minmax(150px, 1fr) minmax(150px, 1fr)',
        }}
      >
        {/* Column A: Core Categories */}
        <div className="space-y-5">
          {data.coreSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.heading}
              </h3>
              <ul className="space-y-0.5">
                {section.categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={category.href}
                      className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                      role="menuitem"
                    >
                      {category.icon && (
                        <CategoryIcon name={category.icon} />
                      )}
                      <span className="group-hover:text-[hsl(var(--accent))]">
                        {category.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Column B: Use Cases */}
        {hasUseCases && (
          <div>
            <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {data.useCasesHeading}
            </h3>
            <ul className="space-y-0.5">
              {data.useCaseLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                    role="menuitem"
                  >
                    <span className="mt-0.5 text-muted-foreground group-hover:text-[hsl(var(--accent))]">
                      →
                    </span>
                    <span className="group-hover:text-[hsl(var(--accent))]">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Column C: Compare & Guides */}
        {hasCompare && (
          <div>
            <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {data.compareHeading}
            </h3>
            <ul className="space-y-0.5">
              {data.compareLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                    role="menuitem"
                  >
                    <span className="group-hover:text-[hsl(var(--accent))]">
                      {link.label}
                    </span>
                    {link.badge && (
                      <span className="rounded-full bg-[hsl(var(--accent)_/_0.1)] px-2 py-0.5 text-xs font-medium text-[hsl(var(--accent))]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Column D: Featured Tool */}
        {hasFeatured && data.featuredTool && (
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--accent))]">
              <Sparkles className="h-3 w-3" />
              {data.featuredLabel}
            </div>

            {/* Tool Logo */}
            {data.featuredTool.logo && (
              <div className="mb-3 h-10 w-10 overflow-hidden rounded-lg bg-background">
                <img
                  src={data.featuredTool.logo.url}
                  alt={data.featuredTool.logo.alt}
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            {/* Tool Name */}
            <h4 className="font-semibold text-foreground">
              {data.featuredTool.name}
            </h4>

            {/* Description */}
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {data.featuredDescription || data.featuredTool.shortOneLiner}
            </p>

            {/* CTA */}
            <Link
              href={data.featuredTool.href}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--accent))] hover:underline"
              role="menuitem"
            >
              {data.featuredCtaLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
        <Link
          href={toolsHref}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-[hsl(var(--accent))]"
          role="menuitem"
        >
          {allToolsLabel} →
        </Link>

        {data.footerLinks.length > 0 && (
          <div className="flex items-center gap-4">
            {data.footerLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                role="menuitem"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// === Helper Component for Dynamic Icons ===

interface CategoryIconProps {
  name: string
}

function CategoryIcon({ name }: CategoryIconProps) {
  // Map common icon names to simple SVG representations
  // In production, you could use a dynamic icon library
  const iconMap: Record<string, string> = {
    code: '⌨️',
    sparkles: '✨',
    video: '🎬',
    bot: '🤖',
    zap: '⚡',
    globe: '🌐',
    terminal: '💻',
    brain: '🧠',
    image: '🖼️',
    mic: '🎤',
    workflow: '📊',
    default: '•',
  }

  return (
    <span className="text-sm" aria-hidden="true">
      {iconMap[name] || iconMap.default}
    </span>
  )
}
