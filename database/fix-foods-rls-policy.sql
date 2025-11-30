-- Fix RLS policies for foods table to allow admins to insert/update/delete
-- Run this SQL in your Supabase SQL Editor

-- Drop existing policies that check owner_id
DROP POLICY IF EXISTS "Stall owners can insert foods for their stall" ON foods;
DROP POLICY IF EXISTS "Stall owners can update their own foods" ON foods;
DROP POLICY IF EXISTS "Stall owners can delete their own foods" ON foods;

-- Create new policy to allow admins to insert foods for their stall
CREATE POLICY "Admins can insert foods for their stall"
  ON foods
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.stall_id = foods.stall_id
      AND admins.user_id = auth.uid()
    )
  );

-- Create new policy to allow admins to update foods for their stall
CREATE POLICY "Admins can update foods for their stall"
  ON foods
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.stall_id = foods.stall_id
      AND admins.user_id = auth.uid()
    )
  );

-- Create new policy to allow admins to delete foods for their stall
CREATE POLICY "Admins can delete foods for their stall"
  ON foods
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.stall_id = foods.stall_id
      AND admins.user_id = auth.uid()
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
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'foods'
ORDER BY policyname;


