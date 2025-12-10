# Cocina Grill & Restaurant Setup Guide

## Stall Details
- **Name**: Cocina Grill & Restaurant
- **Description**: Cocina Grill & Resto
- **Email**: cocina@gmail.com
- **User ID**: d83c66a2-884e-4916-af7a-7e998cdcfeb3
- **Location**: Bonoan Building, Ateneo de Naga University
- **Role**: Admin

## Menu Items (13 items)

### Noodles (2 items)
- Sotanghon - ₱40
- Palabok - ₱40

### Main Dishes (5 items)
- Pork Tapa w/ Rice + juice - ₱75
- Pork Adobo w/ Rice + juice - ₱75
- Cordon Bleu w/ Rice + juice - ₱75
- Fried Chicken w/ Rice + juice - ₱75
- Menudo w/ Rice + juice - ₱75

### Breakfast (6 items)
- Java Rice + Egg - ₱40
- Java Rice + Sausage - ₱60
- Java Rice + Skinless - ₱40
- Java Rice + Torta - ₱50
- Java Rice + TenderJuicy Hotdog - ₱45
- Java Rice + Maling - ₱40

## Setup Steps

1. **Create Stall**: Run `insert-cocina-stall.sql` in Supabase SQL Editor
2. **Add Menu Items**: Run `insert-cocina-foods.sql` in Supabase SQL Editor
3. **Make Admin**: Run `link-cocina-admin.sql` in Supabase SQL Editor

## Notes
- User profile already exists in the system
- All SQL files use the existing user ID
- Menu items are organized by category
