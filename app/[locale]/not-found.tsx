import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function NotFound() {
  const locale = useLocale();
  const fr = locale !== 'en';
  return (
    <section style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <div className="wrap">
        <p className="eyebrow" style={{ marginBottom: 16 }}>404</p>
        <h1 className="sec-title" style={{ marginBottom: 18 }}>
          {fr ? 'Page introuvable' : 'Page not found'}
        </h1>
        <Link className="jbtn jbtn-primary" href={`/${locale}`}>
          {fr ? "Retour à l'accueil" : 'Back to home'}
        </Link>
      </div>
    </section>
  );
}
