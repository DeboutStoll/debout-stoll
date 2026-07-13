'use client';

import { useTranslations } from 'next-intl';
import { zohoForms } from '@/content/forms';
import ZohoEmbed from './ZohoEmbed';

// Contribution mémoire — handled by a Zoho Form (photo/testimony upload +
// moderation happen in Zoho). Set the URL in content/forms.ts.
export default function ContributeForm() {
  const t = useTranslations('contribute');

  return (
    <div className="join-form">
      <ZohoEmbed
        url={zohoForms.contribute}
        title={t('title2')}
        notConfigured={t('note')}
        minHeight={860}
      />
      <p className="fnote">{t('note')}</p>
    </div>
  );
}
