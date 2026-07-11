import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

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
