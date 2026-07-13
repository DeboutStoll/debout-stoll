'use client';

import { useTranslations } from 'next-intl';
import { zohoForms } from '@/content/forms';
import ZohoEmbed from './ZohoEmbed';

// Adhésion — handled by a Zoho Form (submissions + confirmation email happen in
// Zoho, since a static host has no server). Set the URL in content/forms.ts.
export default function JoinForm() {
  const t = useTranslations('form');

  return (
    <div className="join-form" id="adhesion">
      <h3>{t('title')}</h3>
      <p className="fhint">{t('hint')}</p>
      <ZohoEmbed
        url={zohoForms.join}
        title={t('title')}
        notConfigured={t('hint')}
      />
      <p className="fnote">{t('note')}</p>
    </div>
  );
}
