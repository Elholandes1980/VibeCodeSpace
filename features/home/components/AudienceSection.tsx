/**
 * features/home/components/AudienceSection.tsx
 *
 * "Who It's For" section with three audience types.
 * Clean commercial clarity showing target users.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/page.tsx
 * - components/layout/Section.tsx
 */

import { Container, Section } from '@/components/layout'
import { User, Users, Wrench } from 'lucide-react'

interface Audience {
  icon: string
  title: string
  benefits: string[]
}

interface AudienceSectionProps {
  dictionary: {
    kicker: string
    title: string
    audiences: Audience[]
  }
}

const iconMap: Record<string, typeof User> = {
  builders: User,
  teams: Users,
  partners: Wrench,
}

export function AudienceSection({ dictionary }: AudienceSectionProps) {
  return (
    <Section background="alt">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <p className="kicker">{dictionary.kicker}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {dictionary.title}
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dictionary.audiences.map((audience) => {
            const Icon = iconMap[audience.icon]
            return (
              <div key={audience.icon} className="text-center sm:text-left">
                {/* Icon */}
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 sm:mx-0">
                  <Icon className="h-7 w-7 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold">{audience.title}</h3>

                {/* Benefits */}
                <ul className="mt-4 space-y-2">
                  {audience.benefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <svg
                        className="mt-1 h-4 w-4 flex-shrink-0 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
