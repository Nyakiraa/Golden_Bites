-- Database schema for Golden Bites application
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Create users table (for user profiles)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS) for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can read their own profile"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policy to allow authenticated users to read other users' public profiles
CREATE POLICY "Authenticated users can read public profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create trigger to automatically update updated_at for users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create stalls table
CREATE TABLE IF NOT EXISTS stalls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on owner_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_stalls_owner_id ON stalls(owner_id);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_stalls_email ON stalls(email);

-- Enable Row Level Security (RLS)
ALTER TABLE stalls ENABLE ROW LEVEL SECURITY;

-- Create policy to allow stall owners to read their own stall
CREATE POLICY "Stall owners can read their own stall"
  ON stalls
  FOR SELECT
  USING (auth.uid() = owner_id);

-- Create policy to allow stall owners to update their own stall
CREATE POLICY "Stall owners can update their own stall"
  ON stalls
  FOR UPDATE
  USING (auth.uid() = owner_id);

-- Create policy to allow authenticated users to read all active stalls (for customers)
CREATE POLICY "Authenticated users can read active stalls"
  ON stalls
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create policy to allow users to insert their own stall record
CREATE POLICY "Users can insert their own stall"
  ON stalls
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_stalls_updated_at
  BEFORE UPDATE ON stalls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create admin table to link users to stalls
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stall_id UUID NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, stall_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- Create index on stall_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_stall_id ON admins(stall_id);

-- Enable Row Level Security (RLS) for admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own admin record
CREATE POLICY "Users can read their own admin record"
  ON admins
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow authenticated users to read admin records
CREATE POLICY "Authenticated users can read admin records"
  ON admins
  FOR SELECT
  TO authenticated
  USING (true);

-- Create trigger to automatically update updated_at for admins
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create foods/menu items table
CREATE TABLE IF NOT EXISTS foods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stall_id UUID NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT, -- e.g., "Main Course", "Dessert", "Beverage", etc.
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0, -- For ordering items in the menu
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on stall_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_foods_stall_id ON foods(stall_id);

-- Create index on is_available for filtering
CREATE INDEX IF NOT EXISTS idx_foods_is_available ON foods(is_available);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);

-- Enable Row Level Security (RLS) for foods
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access to available foods from active stalls
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

-- Also create a policy for authenticated users (ensures authenticated users can definitely see foods)
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

-- Create policy to allow admins to read all their foods
CREATE POLICY "Admins can read their own foods"
  ON foods
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.stall_id = foods.stall_id
      AND admins.user_id = auth.uid()
    )
  );

-- Create policy to allow admins to read foods referenced in their stall's orders
-- This ensures order history displays food details even if food was later deleted/unavailable
CREATE POLICY "Admins can read foods in their stall orders"
  ON foods
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM order_items
      INNER JOIN orders ON orders.id = order_items.order_id
      INNER JOIN admins ON admins.stall_id = orders.stall_id
      WHERE order_items.food_id = foods.id
      AND admins.user_id = auth.uid()
    )
  );

-- Create policy to allow admins to insert foods for their stall
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

-- Create policy to allow admins to update foods for their stall
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

-- Create policy to allow admins to delete foods for their stall
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

-- Create trigger to automatically update updated_at for foods
CREATE TRIGGER update_foods_updated_at
  BEFORE UPDATE ON foods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for public food information
CREATE OR REPLACE VIEW public_foods AS
SELECT 
  f.id,
  f.stall_id,
  s.name AS stall_name,
  f.name,
  f.description,
  f.price,
  f.image_url,
  f.category,
  f.is_available,
  f.display_order,
  f.created_at
FROM foods f
INNER JOIN stalls s ON f.stall_id = s.id
WHERE f.is_available = true AND s.is_active = true;

-- Optional: Create a view for public stall information (without sensitive data)
CREATE OR REPLACE VIEW public_stalls AS
SELECT 
  id,
  name,
  location,
  rating,
  total_reviews,
  is_active,
  created_at
FROM stalls
WHERE is_active = true;

-- Create orders table
-- This table stores order information for each order placed by users
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stall_id UUID NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE, -- e.g., "ORD-2024-001"
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'
  delivery_address TEXT,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  notes TEXT, -- Special instructions from customer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Create index on stall_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_stall_id ON orders(stall_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Create index on order_number for quick lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Enable Row Level Security (RLS) for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own orders
CREATE POLICY "Users can read their own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own orders
CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow admins to read orders for their stall
CREATE POLICY "Admins can read orders for their stall"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.stall_id = orders.stall_id
      AND admins.user_id = auth.uid()
    )
  );

-- Create policy to allow admins to update orders for their stall
CREATE POLICY "Admins can update orders for their stall"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.stall_id = orders.stall_id
      AND admins.user_id = auth.uid()
    )
  );

-- Create order_items table
-- This table stores individual items in each order
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL, -- Price at time of order (snapshot)
  subtotal DECIMAL(10, 2) NOT NULL, -- quantity * price
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Create index on food_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_items_food_id ON order_items(food_id);

-- Enable Row Level Security (RLS) for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read order items for their orders
CREATE POLICY "Users can read order items for their orders"
  ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create policy to allow users to insert order items for their orders
CREATE POLICY "Users can insert order items for their orders"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create policy to allow admins to read order items for their stall orders
CREATE POLICY "Admins can read order items for their stall orders"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      INNER JOIN admins ON admins.stall_id = orders.stall_id
      WHERE orders.id = order_items.order_id
      AND admins.user_id = auth.uid()
    )
  );

-- Create trigger to automatically update updated_at for orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

