-- Note: This seed data is for development only
-- In production, users will be created through the signup flow

-- Insert sample services (these are public and don't require auth)
insert into public.services (name, category, contact_email, contact_phone, location, address, description, website_url) values
  ('Apex Trust', 'EDUCATION', 'info@apextrust.com', '01744 612 898', 'St Helens, UK', 'Apex Trust, Unit 10, Merton Bank Road, St Helens, WA9 1HZ', 'Provides skills training and works with employers to overcome barriers to employment for individuals with criminal records.', 'https://www.apextrust.com/'),
  ('Bounce Back', 'HOUSING', 'info@bouncebackproject.com', '020 8799 3838', 'London, UK', 'Unit 5, 214-218 Horn Lane, London, W3 6PL', 'A charity and social enterprise focused on training and employment for ex-offenders, particularly in the construction sector.', 'https://www.bouncebackproject.com/'),
  ('Clean Sheet', 'EMPLOYMENT', 'info@cleansheet.org.uk', '0300 123 3045', 'Remote, UK', 'Remote', 'A registered charity that provides remote employment support for men and women with convictions for up to three years.', 'https://cleansheet.org.uk/'),
  ('Nacro', 'LEGAL', 'helpline@nacro.org.uk', '0300 123 1999', 'Nationwide, UK', 'Nacro, Walkden House, 16-17 Devonshire Square, London, EC2M 4SQ', 'Provides a dedicated Resettlement Plus Helpline offering information and advice to ex-offenders, serving prisoners, their families, and supporting organizations.', 'https://www.nacro.org.uk/'),
  ('Working Chance', 'EMPLOYMENT', 'info@workingchance.org', '020 7278 1535', 'London, UK', 'Working Chance, 5th Floor, 1-3 Berry Street, London, EC1V 0AA', 'The UK''s only employment charity specifically for women with convictions, helping them transition into employment.', 'https://www.workingchance.org/')
on conflict do nothing;