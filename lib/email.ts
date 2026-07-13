/**
 * Transactional email.
 * • If RESEND_API_KEY is set → sends via Resend.
 * • Otherwise → logs to the server console (development: no external service).
 */

const FROM = process.env.EMAIL_FROM || 'Debout Stoll <contact@debout-stoll.com>';
const NOTIFY = process.env.EMAIL_NOTIFY || 'contact@debout-stoll.com';
const hasResend = !!process.env.RESEND_API_KEY;

async function send(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  if (!hasResend) {
    // Dev fallback — makes the flow observable without any credentials.
    console.info(`[email:dev] → ${opts.to} — ${opts.subject}`);
    return { delivered: false as const };
  }
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY as string);
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  });
  return { delivered: true as const };
}

const shell = (title: string, body: string) => `
  <div style="font-family:Georgia,serif;background:#0f0c0a;color:#e9e0d2;padding:32px;border-radius:8px">
    <h1 style="color:#c9a24b;font-size:20px;margin:0 0 16px">${title}</h1>
    ${body}
    <p style="margin-top:28px;font-size:12px;color:#b6a894;letter-spacing:.1em">
      DEBOUT, STOLL ! · Réseau des anciens du Collège Stoll d'Akono
    </p>
  </div>`;

export async function sendMembershipConfirmation(member: {
  name: string;
  email: string;
  locale: string;
}) {
  const fr = member.locale !== 'en';
  const subject = fr
    ? 'Bienvenue dans le réseau des anciens — Collège Stoll d’Akono'
    : 'Welcome to the alumni network — Collège Stoll d’Akono';
  const body = fr
    ? `<p>Bonjour ${member.name},</p><p>Votre adhésion au réseau des anciens du Collège Stoll d'Akono est bien enregistrée. Merci de porter Stoll avec nous.</p><p><em>« Ceux que Stoll a formés doivent porter Stoll. »</em></p>`
    : `<p>Hello ${member.name},</p><p>Your membership of the Collège Stoll d'Akono alumni network is recorded. Thank you for carrying Stoll with us.</p><p><em>“Those Stoll formed must carry Stoll.”</em></p>`;
  return send({ to: member.email, subject, html: shell('Debout, Stoll !', body) });
}

export async function notifyNewMember(member: {
  name: string;
  email: string;
  promotion?: string;
  city?: string;
}) {
  return send({
    to: NOTIFY,
    subject: `Nouvelle adhésion — ${member.name}`,
    replyTo: member.email,
    html: shell(
      'Nouvelle adhésion',
      `<p><b>${member.name}</b> (${member.email})</p><p>Promotion : ${member.promotion || '—'} · Lieu : ${member.city || '—'}</p>`,
    ),
  });
}

export async function notifyNewContribution(c: {
  name: string;
  email: string;
  kind: string;
  title: string;
}) {
  return send({
    to: NOTIFY,
    subject: `Contribution mémoire — ${c.title}`,
    replyTo: c.email,
    html: shell(
      'Nouvelle contribution (à modérer)',
      `<p><b>${c.name}</b> (${c.email})</p><p>Type : ${c.kind}</p><p>Sujet : ${c.title}</p>`,
    ),
  });
}
