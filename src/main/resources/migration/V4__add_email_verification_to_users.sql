ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_verification_code VARCHAR(6),
  ADD COLUMN IF NOT EXISTS email_verification_code_expires_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS email_verification_code_sent_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

