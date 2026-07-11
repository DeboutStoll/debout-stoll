'use client';

import { FormEvent, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

type Status = 'idle' | 'sending' | 'ok' | 'error' | 'tooMany';

// Adhésion form — posts to /api/join (real backend + confirmation email),
// with honeypot anti-spam and inline success/error states.
export default function JoinForm() {
  const t = useTranslations('form');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          promotion: data.get('promotion'),
          city: data.get('city'),
          email: data.get('email'),
          message: data.get('message'),
          website: data.get('website'), // honeypot
          locale,
        }),
      });
      if (res.ok) {
        setStatus('ok');
        form.reset();
      } else if (res.status === 429) {
        setStatus('tooMany');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="join-form" id="adhesion" onSubmit={onSubmit} noValidate>
      <h3>{t('title')}</h3>
      <p className="fhint">{t('hint')}</p>

      <div className="frow">
        <label htmlFor="j-nom">{t('name')}</label>
        <input id="j-nom" name="name" type="text" required placeholder={t('namePh')} autoComplete="name" />
      </div>
      <div className="frow-2">
        <div className="frow">
          <label htmlFor="j-promo">{t('promo')}</label>
          <input id="j-promo" name="promotion" type="text" placeholder={t('promoPh')} />
        </div>
        <div className="frow">
          <label htmlFor="j-lieu">{t('city')}</label>
          <input id="j-lieu" name="city" type="text" placeholder={t('cityPh')} />
        </div>
      </div>
      <div className="frow">
        <label htmlFor="j-email">{t('email')}</label>
        <input id="j-email" name="email" type="email" required placeholder={t('emailPh')} autoComplete="email" />
      </div>
      <div className="frow">
        <label htmlFor="j-msg">{t('message')}</label>
        <textarea id="j-msg" name="message" placeholder={t('messagePh')} />
      </div>

      {/* Honeypot — hidden from humans, tempting to bots. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="j-website">Website</label>
        <input id="j-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="fbtn" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t('submitting') : t('submit')}
      </button>
      <p className="fnote">{t('note')}</p>

      {status === 'ok' && (
        <div className="form-msg ok" role="status">
          <strong>{t('successTitle')}</strong> {t('success')}
        </div>
      )}
      {status === 'error' && (
        <div className="form-msg err" role="alert">
          {t('error')}
        </div>
      )}
      {status === 'tooMany' && (
        <div className="form-msg err" role="alert">
          {t('tooMany')}
        </div>
      )}
    </form>
  );
}
