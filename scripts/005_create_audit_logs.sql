-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  action VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  resource_type VARCHAR(50),
  resource_id UUID,
  changes JSONB,
  status VARCHAR(20),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies
-- Admins can view all logs
CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can view their own logs (optional, maybe only admins should see)
-- CREATE POLICY "Users can view their own audit logs" ON audit_logs
--   FOR SELECT
--   USING (auth.uid() = user_id);

-- Only system/service role can insert (handled via API logic usually, but here we allow authenticated users to insert via the server action context if needed, 
-- but typically audit logs are created by the server with service role or the user's transaction. 
-- Since we use createClient() which uses the user's session, we need to allow insert.)
CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
