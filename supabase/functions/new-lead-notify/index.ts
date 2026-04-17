/**
 * New Lead Email Notification via Gmail SMTP
 *
 * Secrets:
 *   GMAIL_USER, GMAIL_APP_PASSWORD, NOTIFY_EMAILS (comma-separated)
 *
 * Deploy: supabase functions deploy new-lead-notify --project-ref irpesrcijcdwyjxxwpyb
 */

import nodemailer from 'npm:nodemailer@6';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return resp({ error: 'Method not allowed' }, 405);
  }

  // Verify request is from Supabase (database webhook) or authorized caller
  const authHeader = req.headers.get('authorization');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const webhookSecret = Deno.env.get('LEAD_NOTIFY_SECRET');
  const providedSecret = req.headers.get('x-webhook-secret');

  const isServiceRole = authHeader && serviceKey && authHeader === `Bearer ${serviceKey}`;
  const isWebhookAuth = webhookSecret && providedSecret && providedSecret === webhookSecret;

  if (!isServiceRole && !isWebhookAuth) {
    console.error('[lead-notify] Unauthorized request');
    return resp({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = await req.json();
    const r = payload.record ?? payload;

    const isTest = (r.notes || '').includes('[TEST]');
    if (isTest) {
      console.info('[lead-notify] Skipped test lead:', r.contact_email);
      return resp({ ok: true, skipped: 'test' });
    }

    const meta = r.metadata ?? {};
    const isContactForm = r.contact_role === 'contact_form';
    const schoolName = escapeHtml(r.school_name || 'Sin colegio');
    const contactName = escapeHtml(r.contact_name || 'Sin nombre');
    const contactEmail = escapeHtml(r.contact_email || '');
    const contactPhone = escapeHtml(r.contact_phone || '');
    const contactRole = isContactForm ? 'Formulario de contacto' : escapeHtml(r.contact_role || '');
    const source = r.contact_source || 'directo';
    const visitorId = r.visitor_id || '';
    const notes = escapeHtml((r.notes || '').replace('[TEST]', '').trim());

    const device = meta.device || '—';
    const os = meta.os || '—';
    const browser = meta.browser || '—';
    const screen = meta.screen || '—';
    const language = meta.language || '—';
    const referrer = meta.referrer || 'directo';
    const timezone = meta.timezone || '—';
    const pageUrl = meta.url || '—';

    const now = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago', dateStyle: 'long', timeStyle: 'short' });

    const subject = isContactForm
      ? `💬 Nuevo lead (Contacto): ${contactName}`
      : `🎯 Nuevo lead: ${contactName} — ${schoolName}`;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

  <!-- Header -->
  <div style="background:#0f172a;padding:24px 28px;text-align:center;">
    <div style="margin-bottom:8px;">
      <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;">
        <span style="color:#ffffff;">Etho</span><span style="color:#2563EB;">z</span>
      </span>
    </div>
    <div style="display:inline-block;background:${isContactForm ? '#2563EB' : '#16a34a'};color:#fff;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;padding:4px 12px;border-radius:100px;">
      Nuevo Lead${isContactForm ? ' — Contacto' : ''}
    </div>
  </div>

  <!-- Priority info -->
  <div style="padding:24px 28px 0;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:0 0 16px;">
          <p style="margin:0 0 2px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;font-weight:600;">Contacto</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:#0f172a;">${contactName}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#64748b;">${contactRole}</p>
        </td>
      </tr>
    </table>

    <!-- Quick actions -->
    <div style="margin-bottom:20px;">
      ${contactPhone ? `<a href="https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${contactName}, soy del equipo de Ethoz. Recibimos tu solicitud${!isContactForm ? ` para ${schoolName}` : ''}. ¿Tienes unos minutos para conversar?`)}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;margin-right:8px;">💬 WhatsApp</a>` : ''}
      <a href="mailto:${contactEmail}?subject=${encodeURIComponent(`Re: Ethoz${!isContactForm ? ` para ${schoolName}` : ''}`)}" style="display:inline-block;background:#2563EB;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">✉️ Email</a>
    </div>
  </div>

  <!-- Contact details -->
  <div style="padding:0 28px;">
    <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <div style="background:#f8fafc;padding:10px 16px;border-bottom:1px solid #e2e8f0;">
        <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;">Datos de contacto</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        ${row('Email', `<a href="mailto:${contactEmail}" style="color:#2563EB;text-decoration:none;">${contactEmail}</a>`)}
        ${contactPhone ? row('Teléfono', `<a href="tel:${contactPhone}" style="color:#0f172a;text-decoration:none;">${contactPhone}</a>`) : ''}
        ${row('Fuente', sourceLabel(source))}
      </table>
    </div>
  </div>

  <!-- School info (demo form only) -->
  ${!isContactForm ? `
  <div style="padding:16px 28px 0;">
    <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <div style="background:#f8fafc;padding:10px 16px;border-bottom:1px solid #e2e8f0;">
        <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;">Colegio</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        ${row('Nombre', `<strong>${schoolName}</strong>`)}
        ${r.school_rbd ? row('RBD', String(r.school_rbd)) : ''}
        ${r.school_commune ? row('Comuna', r.school_commune) : ''}
      </table>
    </div>
  </div>` : ''}

  <!-- Message (contact form) -->
  ${notes ? `
  <div style="padding:16px 28px 0;">
    <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <div style="background:#f8fafc;padding:10px 16px;border-bottom:1px solid #e2e8f0;">
        <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;">Mensaje</p>
      </div>
      <div style="padding:12px 16px;font-size:13px;color:#334155;line-height:1.6;">${notes}</div>
    </div>
  </div>` : ''}

  <!-- Device & session info -->
  <div style="padding:16px 28px 0;">
    <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <div style="background:#f8fafc;padding:10px 16px;border-bottom:1px solid #e2e8f0;">
        <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;">Dispositivo y sesión</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;color:#64748b;">
        ${miniRow('Dispositivo', `${device} · ${os} · ${browser}`)}
        ${miniRow('Pantalla', screen)}
        ${miniRow('Idioma', language)}
        ${miniRow('Zona horaria', timezone)}
        ${miniRow('Referrer', referrer === 'directo' ? 'Acceso directo' : referrer)}
        ${miniRow('Página', pageUrl)}
        ${visitorId ? miniRow('Visitor ID', `<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:11px;">${visitorId}</code>`) : ''}
      </table>
    </div>
  </div>

  <!-- Footer -->
  <div style="padding:20px 28px;text-align:center;">
    <p style="margin:0 0 8px;font-size:11px;color:#94a3b8;">${now}</p>
    <p style="font-size:11px;color:#94a3b8;">Ver en panel de administración</p>
  </div>

</div>
</body></html>`;

    // Send via Gmail SMTP
    const gmailUser = Deno.env.get('GMAIL_USER');
    const gmailPass = Deno.env.get('GMAIL_APP_PASSWORD');
    const notifyEmails = (Deno.env.get('NOTIFY_EMAILS') || gmailUser || '').split(',').map(e => e.trim()).filter(Boolean);

    if (!gmailUser || !gmailPass || !notifyEmails.length) {
      console.error('[lead-notify] Gmail not configured');
      console.info('[lead-notify] Lead:', contactName, contactEmail, schoolName);
      return resp({ ok: true, warning: 'no email credentials' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"Ethoz Leads" <${gmailUser}>`,
      to: notifyEmails.join(', '),
      replyTo: contactEmail,
      subject,
      html,
    });

    console.info(`[lead-notify] Sent for ${contactEmail} → ${notifyEmails.join(', ')}`);
    return resp({ ok: true, lead: contactEmail, notified: notifyEmails });
  } catch (err) {
    console.error('[lead-notify] Error:', err);
    return resp({ error: 'Notification failed' }, 500);
  }
});

// ── Helpers ──

function resp(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 16px;border-bottom:1px solid #f1f5f9;color:#64748b;width:100px;vertical-align:top;">${label}</td>
    <td style="padding:10px 16px;border-bottom:1px solid #f1f5f9;color:#0f172a;">${value}</td>
  </tr>`;
}

function miniRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 16px;border-bottom:1px solid #f8fafc;color:#94a3b8;width:100px;font-size:11px;">${label}</td>
    <td style="padding:6px 16px;border-bottom:1px solid #f8fafc;color:#64748b;font-size:12px;">${value}</td>
  </tr>`;
}

function sourceLabel(source: string): string {
  const labels: Record<string, string> = {
    google: '🔍 Google',
    referido: '🤝 Referido',
    'redes-sociales': '📱 Redes sociales',
    evento: '🎪 Evento',
    mineduc: '🏛️ MINEDUC',
    otro: 'Otro',
    directo: 'Acceso directo',
    contact_page: '📝 Página de contacto',
  };
  return labels[source] || source;
}
