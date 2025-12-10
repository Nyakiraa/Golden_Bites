# Noodle House Setup Guide

## Stall Details
- **Name**: Noodle House
- **Email**: noodles@gmail.com
- **User ID**: a3b759df-c9fe-4b63-aed0-c1978ca00623
- **Location**: Bonoan Building, Ateneo de Naga University
- **Role**: Admin

## Menu Items (31 items)

### Fried Noodles (6 items)
- Fried Noodles - ₱40
- Sharksfin Siomai - ₱58
- Pork Siomai - ₱55
- Beef Siomai - ₱55
- Wanton Siomai - ₱58
- Beef Teriyaki - ₱60

### Rice Meals (8 items)
- Fried Rice w/ Siomai - ₱53
- Fried Rice w/ Beef Teriyaki - ₱63
- Plain Rice w/ Siomai - ₱43
- Plain Rice w/ Beef Teriyaki - ₱53
- Tapsilog - ₱70
- Hotsilog - ₱60
- Longsilog - ₱60
- Hamsilog - ₱60

### Rice meals + Black Gulaman Combo (4 items)
- Fried Rice w/ Siomai + Black Gulaman Combo - ₱68
- Fried Rice w/ Beef Teriyaki + Black Gulaman Combo - ₱78
- Plain Rice w/ Siomai + Black Gulaman Combo - ₱58
- Plain Rice w/ Beef Teriyaki + Black Gulaman Combo - ₱68

### Siomai 5pcs (4 items)
- Beef Siomai 5pcs - ₱33
- Pork Siomai 5pcs - ₱33
- Chicken Siomai 5pcs - ₱33
- Japanese Siomai 5pcs - ₱35

### Others (2 items)
- Adobo / BolaBola - ₱30
- Asado Siopao - ₱28

### Graham Bars (6 items)
- Graham Bars - Cookies and Cream - ₱30
- Graham Bars - Mango Flavor - ₱30
- Graham Bars - Matcha Oreo - ₱30
- Graham Bars - Choco Mallows - ₱30
- Graham Bars - Strawberry - ₱30
- Graham Bars - Ube Mallows - ₱30

## Setup Steps

1. **Create Stall**: Run `insert-noodlehouse-stall.sql` in Supabase SQL Editor
2. **Add Menu Items**: Run `insert-noodlehouse-foods.sql` in Supabase SQL Editor
3. **Link Admin**: Run `link-noodlehouse-admin.sql` in Supabase SQL Editor

## Notes
- User profile already exists in the system
- All SQL files use the existing user ID
- Menu items are organized by category
