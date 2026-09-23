# GS Google Business Manager SaaS

**GS Google Business Manager** adalah blueprint SaaS/agency platform untuk membantu bisnis melakukan onboarding, audit, pendampingan verifikasi, dan pengelolaan Google Business Profile (GBP) secara terstruktur.

> **Penting:** platform ini bukan produk Google, bukan alat untuk menjamin atau menjual "verifikasi Google Maps", dan tidak boleh mengklaim sebagai partner, sponsor, atau endorsed by Google. Verifikasi tetap diputuskan oleh Google. Gunakan hanya untuk profil yang dimiliki atau memang Anda berwenang mengelolanya.

---

## 1. Tujuan Project

Project ini dirancang sebagai fondasi produksi untuk:

- onboarding klien;
- audit kelengkapan Business Profile;
- pendampingan claim dan verification;
- pengelolaan profil untuk klien yang memberi otorisasi;
- pengelolaan multi-client dan multi-location;
- review management dengan persetujuan klien;
- media/profile management;
- laporan aktivitas;
- billing/subscription;
- dashboard agency;
- integrasi Gemini sebagai asisten internal, bukan sebagai pengganti otorisasi Google.

### Model bisnis yang direkomendasikan

Jangan menjual:

> "Pasti verified Google Maps."

Gunakan positioning:

> **Google Business Profile Setup, Verification Assistance & Management**

Produk dapat dibagi menjadi:

1. **Setup**
2. **Verification Assistance**
3. **Profile Management**
4. **Review Management**
5. **Multi-location Management**
6. **Agency SaaS**

---

# 2. Aturan Penting Google Business Profile API

Google Business Profile APIs mempunyai kebijakan khusus untuk agency dan third-party software.

Platform wajib:

- hanya mengelola listing yang dimiliki atau memang diotorisasi oleh pemilik bisnis;
- transparan terhadap perubahan yang dibuat;
- memperoleh otorisasi sebelum membalas review atau melakukan tindakan atas nama klien;
- menjaga kredensial klien;
- tidak meminta password Google;
- menyediakan cara bagi klien untuk menghentikan penggunaan layanan;
- mengikuti kebijakan Google Business Profile API;
- tidak menyamar sebagai Google.

### Peringatan arsitektur API

Google membatasi penggunaan API project pihak ketiga. Jangan membuat sistem yang secara otomatis memberikan akses programmatic ke banyak end-client melalui satu project API Anda dengan tujuan membuat mereka menghindari proses project API mereka sendiri.

Karena itu project ini membedakan:

### A. Agency-operated mode

Operator/agency mengelola listing klien yang memang telah memberikan otorisasi.

### B. Client-owned API mode

Jika suatu klien membutuhkan penggunaan Business Profile API secara langsung/programmatic melalui aplikasinya sendiri, klien harus menggunakan project/API access yang sesuai dengan kebijakan Google.

Jangan mengubah project ini menjadi "API reseller/proxy" yang menyembunyikan project API Anda dari end-client.

---

# 3. Alur Sistem

```text
CLIENT
  |
  v
Landing Page
  |
  v
Register / Login
  |
  v
Business Onboarding
  |
  +--> Business information
  |
  +--> Website
  |
  +--> Existing GBP?
  |
  +--> Authorization
  |
  v
Business Audit
  |
  +--> Profile found
  +--> Claim required
  +--> Verification required
  +--> Verified
  |
  v
Verification Assistance
  |
  +--> Show only Google-provided options
  +--> Client performs owner-required verification
  +--> Track status
  |
  v
Management
  |
  +--> Profile
  +--> Locations
  +--> Reviews
  +--> Media
  +--> Posts
  +--> Reports
  |
  v
Subscription
```

---

# 4. Arsitektur Produksi

```text
                         INTERNET
                            |
                            v
                    Vercel / Next.js
                            |
              +-------------+-------------+
              |                           |
              v                           v
        Web Dashboard                API Routes
              |                           |
              |                    +------+------+
              |                    |             |
              |                    v             v
              |                 Google       Gemini API
              |                 OAuth
              |                    |
              |                    v
              |             Business Profile APIs
              |
              v
        PostgreSQL
       (Supabase/Neon)
              |
              v
      Audit / Billing / Logs

Optional:
- Vercel Cron
- Sentry
- Resend
- Stripe/Midtrans
- Cloudflare
- Google Cloud Secret Manager
```

---

# 5. Recommended Technology Stack

## Frontend

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- Accessible component system
- Responsive dashboard
- Dark/light mode

## Backend

- Next.js server-side route handlers
- TypeScript
- Zod validation
- Google OAuth 2.0
- Google Business Profile APIs
- Gemini API

## Database

Recommended:

- PostgreSQL
- Supabase or Neon
- Drizzle ORM or Prisma

## Deployment

Recommended:

- Vercel for web/app
- PostgreSQL managed service
- Google Cloud for Google API project
- Optional Cloudflare for DNS/WAF

## Monitoring

- Sentry
- Vercel Logs
- Database audit logs

---

# 6. Environment Variables

Never commit secrets to GitHub.

Example:

```env
APP_URL=https://your-domain.com

DATABASE_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GEMINI_API_KEY=

SESSION_SECRET=

ENCRYPTION_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

RESEND_API_KEY=
```

Use `.env.example` in GitHub and keep real `.env.local` out of Git.

Gemini API keys must remain server-side. Never place the key inside browser JavaScript.

---

# 7. Google Cloud Setup

## Step 1 — Google Account

Create/use a Google Account intended for the business/agency operation.

Do not use a client's password.

## Step 2 — Business Profile

Have a verified and active Business Profile that satisfies Google's current API-access requirements.

## Step 3 — Google Cloud Project

Create a dedicated project, for example:

```text
GS Google Business Manager
```

## Step 4 — Organization Account

Create the appropriate Google Business Profile Organization Account.

## Step 5 — Request API Access

Request Business Profile API access using the official Google process.

Keep the project number and approval information documented.

## Step 6 — Enable APIs

Enable only the APIs actually required by the application.

## Step 7 — OAuth

Create a Web Application OAuth client.

Configure:

- authorized JavaScript origins;
- authorized redirect URIs;
- OAuth consent screen;
- production domain;
- privacy policy;
- terms of service.

Required Business Profile scope:

```text
https://www.googleapis.com/auth/business.manage
```

Do not request unnecessary scopes.

---

# 8. OAuth Flow

```text
User
 |
 | Click "Hubungkan Google Business Profile"
 v
GS SaaS
 |
 | redirect
 v
Google OAuth
 |
 | user signs in
 | user grants consent
 v
Callback
 |
 v
Server
 |
 +--> validate state
 +--> exchange code
 +--> encrypt refresh token
 +--> store account relationship
 |
 v
Dashboard
```

Never expose:

- client secret;
- refresh token;
- session signing secret;
- Gemini API key;

to browser code.

---

# 9. Verification Flow

Verification is not a guaranteed automated action.

```text
Business Location
      |
      v
Check Voice of Merchant / verification state
      |
      +--> already verified
      |       |
      |       v
      |    Management
      |
      +--> verification required
              |
              v
       Fetch available options
              |
              v
       Show options returned by Google
              |
              v
      Owner initiates required action
              |
              v
          Pending
              |
              v
        Check status
              |
              +--> Verified
              |
              +--> Pending
              |
              +--> Needs action
```

Do not create fake SMS/email/video verification methods.

Do not promise a verification result.

Do not upload fake evidence.

Do not fabricate business information.

---

# 10. Dashboard UI

Recommended navigation:

```text
Dashboard
|
+-- Overview
|
+-- Clients
|    +-- All Clients
|    +-- Add Client
|
+-- Locations
|    +-- All Locations
|    +-- Verification
|
+-- Business Profile
|    +-- Information
|    +-- Categories
|    +-- Hours
|    +-- Services
|
+-- Content
|    +-- Posts
|    +-- Photos
|    +-- Media
|
+-- Reviews
|    +-- Inbox
|    +-- Draft Reply
|    +-- Approval Queue
|
+-- Reports
|
+-- Billing
|
+-- Team
|
+-- Audit Log
|
+-- Settings
```

---

# 11. Client Onboarding UI

### Screen 1 — Welcome

```text
Selamat datang di GS Business Manager

[ Tambah Bisnis ]
```

### Screen 2 — Business Data

```text
Nama bisnis
Kategori
Alamat
Telepon
Website
Email
```

### Screen 3 — Existing Profile

```text
Apakah bisnis Anda sudah memiliki
Google Business Profile?

[ Ya ]
[ Belum tahu ]
[ Belum ]
```

### Screen 4 — Authorization

```text
Hubungkan Google Business Profile

[ Hubungkan dengan Google ]
```

### Screen 5 — Audit

```text
Profile Status
Verification Status
Business Information
Website
Phone
Category
Hours
Media
```

### Screen 6 — Action Plan

```text
Yang perlu dilakukan:

[!] Verifikasi bisnis
[!] Tambahkan foto
[✓] Website
[!] Lengkapi jam buka

[ Mulai Pendampingan ]
```

---

# 12. Review Management

Jangan membuat bot yang otomatis membalas semua review tanpa persetujuan.

Model aman:

```text
Google Review
      |
      v
GS Dashboard
      |
      v
Gemini Draft
      |
      v
Human Approval
      |
      v
Google API
```

UI:

```text
Review:
"Pelayanannya sangat bagus."

AI Draft:
"Terima kasih atas ulasan positifnya..."

[ Edit ]
[ Tolak ]
[ Setujui & Kirim ]
```

Sistem harus menyimpan:

- siapa yang menyetujui;
- kapan;
- review ID;
- draft;
- versi final;
- status pengiriman.

---

# 13. Gemini AI

Gemini digunakan sebagai assistant, bukan sebagai otoritas Google.

Use cases:

- membuat draft reply;
- merapikan deskripsi bisnis;
- membuat post draft;
- membuat FAQ;
- membuat checklist;
- menganalisis data yang memang boleh diproses;
- membantu operator.

Contoh:

```text
Input:
Review pelanggan

Gemini:
Generate 3 draft responses

Operator:
Select / Edit

Google:
Publish after explicit approval
```

AI tidak boleh:

- memalsukan bukti;
- membuat alamat palsu;
- membuat bisnis palsu;
- menjanjikan verifikasi;
- mengotomatisasi tindakan terlarang;
- menggantikan consent owner.

---

# 14. Database Model

Minimal:

```text
users
organizations
clients
locations
google_accounts
oauth_connections
subscriptions
verification_cases
reviews
review_drafts
media
posts
audit_logs
notifications
```

Relasi sederhana:

```text
Organization
 |
 +-- Users
 |
 +-- Clients
       |
       +-- Locations
              |
              +-- Google Connection
              |
              +-- Verification Case
              |
              +-- Reviews
              |
              +-- Media
              |
              +-- Posts
```

---

# 15. Audit Log

Semua tindakan penting dicatat:

```text
timestamp
actor
organization
client
location
action
resource
before
after
consent
result
error
```

Contoh:

```text
2026-09-23 10:15
operator@agency
Client: ABC Resto
Location: Jakarta
ACTION: UPDATE_HOURS
CONSENT: YES
RESULT: SUCCESS
```

---

# 16. Security

Wajib:

- HTTPS;
- secure cookies;
- CSRF/state protection;
- OAuth state validation;
- PKCE bila sesuai flow;
- encrypted token storage;
- least privilege;
- rate limiting;
- input validation;
- server-side secrets;
- audit logging;
- dependency updates;
- database backups;
- error monitoring.

Jangan:

```text
client_secret = "..."
GEMINI_API_KEY = "..."
refresh_token = "..."
```

di source code.

---

# 17. GitHub Structure

Recommended:

```text
gs-google-business-manager/
|
+-- app/
|   +-- dashboard/
|   +-- clients/
|   +-- locations/
|   +-- verification/
|   +-- reviews/
|   +-- reports/
|   +-- settings/
|
+-- components/
|
+-- lib/
|   +-- google/
|   +-- gemini/
|   +-- auth/
|   +-- db/
|   +-- security/
|
+-- prisma/ or drizzle/
|
+-- public/
|
+-- docs/
|   +-- architecture.md
|   +-- onboarding.md
|   +-- google-cloud.md
|   +-- oauth.md
|   +-- verification.md
|   +-- production.md
|
+-- .env.example
+-- .gitignore
+-- LICENSE
+-- README.md
+-- GEMINI_STUDIO_PROMPT.md
+-- package.json
```

---

# 18. Git Workflow

Recommended branches:

```text
main
develop
feature/*
fix/*
release/*
```

Production:

```text
feature
   |
   v
develop
   |
   v
staging
   |
   v
main
   |
   v
Vercel Production
```

Never put secrets into commits.

---

# 19. Deployment Vercel

## Initial setup

1. Push repository to GitHub.
2. Open Vercel.
3. Import repository.
4. Select framework automatically.
5. Configure environment variables.
6. Deploy.
7. Configure custom domain.
8. Configure OAuth redirect URI to production URL.
9. Test login.
10. Test database.
11. Test Google OAuth.
12. Test API with an authorized test account.
13. Enable monitoring.

Recommended environments:

```text
Local
  ↓
Preview
  ↓
Staging
  ↓
Production
```

---

# 20. Update System

Because source code berada di GitHub:

```text
Developer
   |
   v
Git push
   |
   v
GitHub
   |
   v
Vercel
   |
   v
Preview deployment
   |
   v
Test
   |
   v
Production
```

Rollback:

```text
Vercel
  |
  +-- Deployment A
  +-- Deployment B
  +-- Deployment C
```

Pilih deployment stabil untuk rollback.

---

# 21. Gemini Studio Development Workflow

Gunakan Google AI Studio untuk membangun kode awal dan iterasi.

Jangan memberikan prompt:

> "Buat SaaS Google Maps verification."

Prompt tersebut terlalu umum.

Gunakan prompt proyek yang terdapat pada:

```text
GEMINI_STUDIO_PROMPT.md
```

AI harus bekerja bertahap:

```text
Phase 1
Architecture

Phase 2
Database

Phase 3
Authentication

Phase 4
Google OAuth

Phase 5
GBP API adapters

Phase 6
Verification workflow

Phase 7
Gemini assistant

Phase 8
Dashboard

Phase 9
Billing

Phase 10
Security

Phase 11
Testing

Phase 12
Production
```

Jangan meminta AI menghasilkan seluruh sistem dalam satu file.

---

# 22. Definition of Done

Sistem dianggap siap production jika:

- [ ] Login berfungsi
- [ ] Database berfungsi
- [ ] Organization/tenant isolation berfungsi
- [ ] OAuth state aman
- [ ] Google OAuth berfungsi
- [ ] Token terenkripsi
- [ ] GBP API approval sudah diperoleh
- [ ] API adapters menggunakan endpoint resmi
- [ ] Verification state benar
- [ ] Consent tercatat
- [ ] Audit log aktif
- [ ] Review approval workflow aktif
- [ ] Gemini server-side
- [ ] Secrets tidak masuk Git
- [ ] Error handling aktif
- [ ] Rate limit aktif
- [ ] Backup database aktif
- [ ] Privacy Policy tersedia
- [ ] Terms of Service tersedia
- [ ] Google branding mengikuti aturan
- [ ] Client disconnect tersedia
- [ ] Deployment Preview berhasil
- [ ] Production deployment berhasil
- [ ] Demo account siap jika diminta Google

---

# 23. Client Disconnect

Google mewajibkan third-party menyediakan cara yang mudah bagi end-client untuk berhenti menggunakan API.

Flow:

```text
Settings
   |
   v
Disconnect Google Business Profile
   |
   v
Confirm
   |
   v
Revoke / remove permissions
   |
   v
Remove stored tokens
   |
   v
Remove relationship
   |
   v
Audit log
```

Jangan membuat client terjebak dalam sistem.

---

# 24. Billing

Billing bukan bagian dari Google API.

Gunakan provider terpisah, misalnya:

- Stripe;
- Midtrans;
- Xendit.

Model:

```text
Client
 |
 v
Plan
 |
 +-- Setup
 +-- Verification Assistance
 +-- Management
 +-- Agency
 |
 v
Payment
 |
 v
Subscription
 |
 v
Feature Entitlement
```

---

# 25. Data Retention

Jangan mengarsipkan seluruh konten Google Business Profile tanpa memahami kebijakan Google.

Untuk data yang berasal dari GBP API:

- simpan hanya yang diperlukan;
- simpan secara aman;
- ikuti batas retensi dan kebijakan Google;
- jangan membuat database mirror Google;
- jangan menjual data Google;
- jangan menggabungkan data untuk tujuan yang dilarang.

---

# 26. Legal / Business Positioning

Website sebaiknya mencantumkan:

> GS Google Business Manager adalah layanan pihak ketiga untuk membantu pemilik bisnis mengelola Google Business Profile. GS tidak dimiliki, dioperasikan, disponsori, atau didukung oleh Google.

Jangan menggunakan:

- Google Certified Partner;
- Google Official Verification Service;
- Google Authorized Verification Center;

kecuali benar-benar memiliki hak resmi untuk menggunakan klaim tersebut.

---

# 27. Production Checklist

```text
[ ] Domain
[ ] Vercel
[ ] GitHub
[ ] PostgreSQL
[ ] Google Cloud Project
[ ] GBP API Access
[ ] OAuth consent
[ ] OAuth credentials
[ ] Gemini API
[ ] Secret management
[ ] Email
[ ] Billing
[ ] Privacy Policy
[ ] Terms
[ ] Monitoring
[ ] Backup
[ ] Audit log
[ ] Client disconnect
[ ] Demo account
[ ] Security test
[ ] Production test
```

---

# 28. Official Documentation

Google Business Profile API:

https://developers.google.com/my-business/

Prerequisites:

https://developers.google.com/my-business/content/prereqs

API policies:

https://developers.google.com/my-business/content/policies

Basic setup:

https://developers.google.com/my-business/content/basic-setup

OAuth:

https://developers.google.com/my-business/content/implement-oauth

Verification:

https://developers.google.com/my-business/content/manage-verification

Google Business Profile Help:

https://support.google.com/business/

Google AI Studio:

https://aistudio.google.com/

Gemini API:

https://ai.google.dev/gemini-api/docs

Vercel:

https://vercel.com/

GitHub:

https://github.com/

---

# 29. Status

**Project:** GS Google Business Manager SaaS  
**Type:** Agency / SaaS platform  
**Version:** 0.1.0-alpha  
**Status:** Architecture / Production Preparation

Do not mark the project `production-ready` until Google API approval, OAuth, security, consent, retention, billing, monitoring, and policy compliance have been tested.

---

## License

See [`LICENSE`](./LICENSE).

This repository is source-available and proprietary unless the owner explicitly publishes a different license.

Copyright © 2026 Achmad / PT. Media Online Nusantara.
