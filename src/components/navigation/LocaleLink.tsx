'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
  locale?: string;
};

/**
 * Locale-aware Link component that automatically prefixes href with current locale
 * Usage: <LocaleLink href="/education">Education</LocaleLink>
 * Result: /zh/education or /en/education based on current locale
 */
export default function LocaleLink({ href, locale, ...props }: LocaleLinkProps) {
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = locale || pathname.split('/')[1] || 'zh';

  // Don't prefix if href is external or already has locale
  const isExternal = href.startsWith('http') || href.startsWith('//');
  const hasLocale = href.startsWith('/zh/') || href.startsWith('/en/');

  let localizedHref = href;

  if (!isExternal && !hasLocale) {
    // Add locale prefix
    localizedHref = `/${currentLocale}${href.startsWith('/') ? href : `/${href}`}`;
  }

  return <Link href={localizedHref} {...props} />;
}
