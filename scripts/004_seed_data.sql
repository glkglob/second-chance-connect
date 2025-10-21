-- Note: This seed data is for development only
-- In production, users will be created through the signup flow

-- Insert sample services (these are public and don't require auth)
insert into public.services (name, category, contact_email, contact_phone, location, address, description, website_url) values
  ('Second Chance Housing', 'HOUSING', 'housing@secondchance.org', '555-0101', 'San Francisco, CA', '123 Hope St, San Francisco, CA 94102', 'Transitional housing assistance for individuals with criminal records', 'https://example.com/housing'),
  ('Career Skills Training', 'EDUCATION', 'education@skillsup.org', '555-0102', 'Oakland, CA', '456 Learn Ave, Oakland, CA 94601', 'Free job training and certification programs', 'https://example.com/education'),
  ('Community Health Center', 'HEALTH', 'health@community.org', '555-0103', 'San Jose, CA', '789 Wellness Blvd, San Jose, CA 95110', 'Affordable healthcare and mental health services', 'https://example.com/health'),
  ('Legal Aid Society', 'LEGAL', 'legal@legalaid.org', '555-0104', 'Sacramento, CA', '321 Justice Way, Sacramento, CA 95814', 'Free legal assistance for record expungement and rights restoration', 'https://example.com/legal'),
  ('Fresh Start Mentorship', 'OTHER', 'mentor@freshstart.org', '555-0105', 'Los Angeles, CA', '654 New Beginning Dr, Los Angeles, CA 90001', 'One-on-one mentorship and life coaching', 'https://example.com/mentorship')
on conflict do nothing;
