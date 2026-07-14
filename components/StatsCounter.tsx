import { useTranslations } from 'next-intl';
import { facebookMembers } from '@/content/social';

// Historical figures + the Facebook group's membership. The member count is a
// static number kept in content/social.ts (updated by hand from the group);
// the tile is hidden while it is 0. No backend, no polling.
export default function StatsCounter() {
  const t = useTranslations('rejoindre');

  return (
    <div className="join-stats">
      <div className="jstat">
        <b>1&nbsp;500</b>
        <small>{t('statToday2004')}</small>
      </div>
      <div className="jstat">
        <b>&lt;&nbsp;200</b>
        <small>{t('statTodayNow')}</small>
      </div>
      {facebookMembers > 0 && (
        <div className="jstat live">
          <b>{facebookMembers.toLocaleString('fr-FR')}</b>
          <small>{t('statMembers')}</small>
        </div>
      )}
    </div>
  );
}
