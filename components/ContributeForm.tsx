'use client';

import { FormEvent, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

type Status = 'idle' | 'sending' | 'ok' | 'error';

// Contribution mémoire — photo + testimony → moderation queue.
export default function ContributeForm() {
  const t = useTranslations('contribute');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set('locale', locale);
    setStatus('sending');
    try {
      const res = await fetch('/api/contribute', { method: 'POST', body: data });
      if (res.ok) {
        setStatus('ok');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="join-form" onSubmit={onSubmit} noValidate>
      <div className="frow">
        <label htmlFor="c-name">{t('name')}</label>
        <input id="c-name" name="name" type="text" required placeholder={t('namePh')} autoComplete="name" />
      </div>
      <div className="frow">
        <label htmlFor="c-email">{t('email')}</label>
        <input id="c-email" name="email" type="email" required placeholder={t('emailPh')} autoComplete="email" />
      </div>
      <div className="frow">
        <label htmlFor="c-kind">{t('kind')}</label>
        <select id="c-kind" name="kind" defaultValue="photo">
          <option value="photo">{t('kindPhoto')}</option>
          <option value="testimony">{t('kindTestimony')}</option>
          <option value="figure">{t('kindFigure')}</option>
        </select>
      </div>
      <div className="frow">
        <label htmlFor="c-title">{t('title2')}</label>
        <input id="c-title" name="title" type="text" required placeholder={t('title2Ph')} />
      </div>
      <div className="frow">
        <label htmlFor="c-story">{t('story')}</label>
        <textarea id="c-story" name="story" placeholder={t('storyPh')} style={{ minHeight: 120 }} />
      </div>
      <div className="frow">
        <label htmlFor="c-file">{t('file')}</label>
        <input id="c-file" name="file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" />
        <p className="fnote" style={{ textAlign: 'left', marginTop: 6 }}>
          {t('fileHint')}
        </p>
      </div>

      <div className="frow" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <input id="c-consent" name="consent" type="checkbox" required style={{ width: 'auto', marginTop: 4 }} />
        <label htmlFor="c-consent" style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: 'var(--bone-dim)' }}>
          {t('consent')}
        </label>
      </div>

      {/* Honeypot */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
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
    </form>
  );
}
