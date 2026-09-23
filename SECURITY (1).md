# Security Policy

## Secrets

Never commit:

- Google OAuth client secrets
- Google refresh/access tokens
- Gemini API keys
- database passwords
- session secrets
- encryption keys
- payment secrets

Use environment variables locally and Vercel/Secret Manager in production.

## Reporting a Vulnerability

Do not publish exploitable vulnerabilities in a public issue.

Contact the repository owner privately with:

- affected component;
- reproduction steps;
- impact;
- suggested mitigation.

## Google Account Security

Never request or store a customer's Google password.

OAuth authorization must be used where applicable.

## Data

Business Profile data must be handled according to Google's current
Business Profile API policies and the application's privacy policy.
