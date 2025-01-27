-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON addresses;

-- Create new policies that don't rely on auth.uid()
CREATE POLICY "Enable read access for users" ON addresses FOR SELECT
    USING (true);

CREATE POLICY "Enable insert access for users" ON addresses FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update access for users" ON addresses FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete access for users" ON addresses FOR DELETE
    USING (true); 