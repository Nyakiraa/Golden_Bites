-- Fix RLS policy to allow all users (authenticated and unauthenticated) to view food images
-- Run this SQL in your Supabase SQL Editor

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can read available foods from active stalls" ON foods;

-- Create a new policy that explicitly allows public access to available foods
-- This ensures all users can see food items and their images regardless of who added them
CREATE POLICY "Public can read available foods from active stalls"
  ON foods
  FOR SELECT
  TO public
  USING (
    is_available = true AND
    EXISTS (
      SELECT 1 FROM stalls
      WHERE stalls.id = foods.stall_id
      AND stalls.is_active = true
    )
  );

-- Also create a policy for authenticated users (in case they need additional access)
-- This is redundant but ensures authenticated users can definitely see foods
CREATE POLICY "Authenticated users can read available foods from active stalls"
  ON foods
  FOR SELECT
  TO authenticated
  USING (
    is_available = true AND
    EXISTS (
      SELECT 1 FROM stalls
      WHERE stalls.id = foods.stall_id
      AND stalls.is_active = true
    )
  );

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'foods'
ORDER BY policyname;

