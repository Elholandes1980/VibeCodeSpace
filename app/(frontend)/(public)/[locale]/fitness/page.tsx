/**
 * app/(frontend)/(public)/[locale]/fitness/page.tsx
 *
 * Fitness app page with 3D exercise demonstrations.
 * iOS-style mobile-first design with animated mannequin.
 *
 * Related:
 * - features/fitness/components/FitnessApp.tsx
 * - features/fitness/index.ts
 */

import { validateLocale } from '@/lib/i18n';
import { FitnessApp } from '@/features/fitness';

import type { Metadata } from 'next';

interface FitnessPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FitnessPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = validateLocale(localeParam);
  const isNl = locale === 'nl';

  return {
    title: isNl ? 'FitVibe 3D - Fitness Oefeningen' : 'FitVibe 3D - Fitness Exercises',
    description: isNl
      ? 'Interactieve 3D fitness oefeningen met geanimeerde demonstraties'
      : 'Interactive 3D fitness exercises with animated demonstrations',
  };
}

export default async function FitnessPage({ params }: FitnessPageProps) {
  const { locale: localeParam } = await params;
  const locale = validateLocale(localeParam);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0c1d] via-[#1a1a2e] to-[#16213e]">
      {/* iOS-style safe area and status bar simulation */}
      <div className="max-w-md mx-auto h-screen flex flex-col overflow-hidden relative">
        {/* iOS status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <span className="text-white/60 text-xs font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white" fillOpacity="0.6">
              <rect x="0" y="8" width="3" height="4" rx="0.5" />
              <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
              <rect x="9" y="2" width="3" height="10" rx="0.5" />
              <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
            </svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke="white" strokeOpacity="0.35" />
              <rect x="2" y="2" width="16" height="8" rx="1" fill="#00cec9" />
              <rect x="22.5" y="3.5" width="1.5" height="5" rx="0.5" fill="white" fillOpacity="0.35" />
            </svg>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          <FitnessApp locale={locale} />
        </div>

        {/* iOS-style home indicator */}
        <div className="flex justify-center pb-2 pt-1">
          <div className="w-32 h-1 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}
