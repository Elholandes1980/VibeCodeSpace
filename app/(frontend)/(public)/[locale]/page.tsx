/**
 * app/(frontend)/(public)/[locale]/page.tsx
 *
 * Homepage - redirects to the fitness app.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/fitness/page.tsx
 */

import { redirect } from 'next/navigation';
import { validateLocale } from '@/lib/i18n';

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = validateLocale(localeParam);
  redirect(`/${locale}/fitness`);
}
