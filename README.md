# Mago Labs client feedback form

A six step feedback, testimonial and referral form for Mago Labs clients (React + Vite, deployed on Vercel).
Each submission is emailed to Burhan through Resend and, optionally, logged to a Google Sheet.

## Flow

1. About you (name, business, role, email)
2. Rating (overall stars, would you recommend, optional detail stars)
3. In your words (liked most, could do better)
4. Testimonial (text, optional photo or logo, permission to publish)
5. Referrals (two cards ready, memory prompts, gentle nudge before skipping)
6. Review and send, then a thank you screen with a Google review prompt and a share button

## Personal links

Prefill the client's details by adding them to the link:

```
https://feedback.magolabs.in/?name=Rahul%20Shah&company=Modi%20Foods&email=rahul@example.com
```

Supported: `name`, `company`, `role`, `email`. Spaces become `%20`.

## Environment variables (Vercel > Settings > Environment Variables)

| Variable | Required | What it does |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Sends the submission email |
| `FEEDBACK_TO_EMAIL` | No | Defaults to burhan@magolabs.in |
| `FEEDBACK_FROM_EMAIL` | Recommended | A sender on a domain verified in Resend, e.g. `Mago Labs <feedback@magolabs.in>` |
| `SHEETS_WEBHOOK_URL` | No | Google Apps Script web app URL, see `google-sheets/apps-script.gs` |
| `SHEETS_WEBHOOK_SECRET` | With the above | Must match `SECRET` in the Apps Script |

## Spam protection

Hidden honeypot field, a minimum fill time, and a limit of 5 submissions per connection every 10 minutes.
Bots get a fake success and nothing is sent.

## Google review link

Set in `src/components/SuccessScreen.tsx` (`GOOGLE_REVIEW_URL`).
Everyone sees the review option (Google does not allow showing it only to happy clients); 4 and 5 star clients see it front and centre.

## Local development

```
npm install
npm run dev
```

Put the variables above in a `.env` file for local testing.
