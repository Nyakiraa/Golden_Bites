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

-- Create function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_order_number TEXT;
  order_count INTEGER;
BEGIN
  -- Get count of orders today
  SELECT COUNT(*) INTO order_count
  FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Generate order number: ORD-YYYYMMDD-XXX
  new_order_number := 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD((order_count + 1)::TEXT, 3, '0');
  
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

