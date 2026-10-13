/**
 * Mago Labs feedback form: Google Sheet logger.
 *
 * Setup (5 minutes, one time):
 * 1. Create a new Google Sheet, e.g. "Mago Labs Client Feedback".
 * 2. Extensions > Apps Script. Delete what is there and paste this whole file.
 * 3. Change SECRET below to any long random word, and save.
 * 4. Deploy > New deployment > type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Click Deploy, allow the permissions, and copy the Web app URL.
 * 5. In Vercel > your project > Settings > Environment Variables, add:
 *      SHEETS_WEBHOOK_URL    = the Web app URL
 *      SHEETS_WEBHOOK_SECRET = the same SECRET word as below
 *    Then redeploy the project.
 *
 * Each submission adds one row to "Feedback" and one row per person to "Referrals".
 */

const SECRET = 'change-me-to-a-long-random-word';

const FEEDBACK_HEADERS = [
  'Submitted', 'Name', 'Role', 'Company', 'Email',
  'Overall', 'Quality', 'Communication', 'Timeliness', 'Value', 'Would recommend',
  'Liked most', 'Could do better', 'Testimonial', 'OK to publish', 'Photo in email', 'Referrals',
];

const REFERRAL_HEADERS = [
  'Submitted', 'Referred by', 'Referrer company', 'Name', 'Business', 'Phone', 'Email',
  'Connection', 'Might need', 'OK to mention referrer', 'Status', 'Notes',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) return json({ ok: false, error: 'unauthorised' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const fb = sheet(ss, 'Feedback', FEEDBACK_HEADERS);
    const ref = sheet(ss, 'Referrals', REFERRAL_HEADERS);
    const when = new Date(data.submittedAt || Date.now());
    const c = data.client || {}, r = data.ratings || {}, f = data.feedback || {}, t = data.testimonial || {};
    const referrals = data.referrals || [];

    fb.appendRow([
      when, c.name, c.role, c.company, c.email,
      r.overall, r.quality || '', r.communication || '', r.timeliness || '', r.value || '', f.recommendation,
      f.liked, f.improvements, t.text, t.text ? (t.permission ? 'Yes' : 'No') : '', t.hasPhoto ? 'Yes' : '',
      referrals.length,
    ]);

    referrals.forEach(function (x) {
      ref.appendRow([
        when, c.name, c.company, x.name, x.company, "'" + (x.phone || ''), x.email,
        x.relationship, (x.services || []).join(', '), x.mentionMe ? 'Yes' : 'No', 'New', '',
      ]);
    });

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function sheet(ss, name, headers) {
  let s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    s.appendRow(headers);
    s.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#FFC53D');
    s.setFrozenRows(1);
  }
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
