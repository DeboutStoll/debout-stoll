import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { activeSocials, social, socialMeta } from '@/content/social';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const base = `/${locale}`;

  return (
    <footer>
      <div className="wrap">
        <div className="crest">
          <Image
            src="/img/crest.png"
            alt="Écusson du Collège Stoll d'Akono"
            width={96}
            height={106}
          />
        </div>
        <p>{t('tagline')}</p>

        {activeSocials.length > 0 && (
          <div className="social-row">
            <span>{t('follow')}</span>
            {activeSocials.map((key) => (
              <a
                key={key}
                className="social-btn"
                href={social[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={socialMeta[key].label}
                title={socialMeta[key].label}
              >
                {socialMeta[key].glyph}
              </a>
            ))}
          </div>
        )}

        <div className="flinks">
          <a href={`${base}#rejoindre`}>{t('join')}</a>
          <Link href={`${base}/contribuer`}>{t('contribute')}</Link>
          <Link href={`${base}/credits`}>{t('credits')}</Link>
        </div>
        <p className="sig">{t('sig')}</p>
      </div>
    </footer>
  );
}
