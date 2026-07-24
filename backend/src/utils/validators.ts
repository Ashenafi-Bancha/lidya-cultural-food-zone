import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const contactMessageSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  }),
});

export const createReservationSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be HH:MM'),
    partySize: z.number().int().min(1).max(50),
    branchId: z.string().uuid('Invalid branch ID'),
    specialRequest: z.string().max(500).optional().nullable(),
  }),
});

export const updateReservationStatusSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid reservation ID') }),
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']),
  }),
});

export const createMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().optional().nullable(),
    price: z.string().min(1, 'Price is required'),
    tag: z.string().optional().nullable(),
    categoryId: z.string().uuid('Invalid category ID'),
    branchId: z.string().uuid().optional().nullable(),
    isAvailable: z.boolean().optional(),
    imageUrl: z.union([z.literal(''), z.string()]).optional().nullable(),
  }),
});

export const createBranchSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    label: z.string().optional().nullable(),
    address: z.string().min(5, 'Address is required'),
    phone: z.string().min(10, 'Phone is required'),
    email: z.union([z.literal(''), z.string().email('Invalid email address')]).optional().nullable(),
    workingHours: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    capacity: z.number().int().min(1).optional(),
  }),
});

// ─── Category Schemas ────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name is required').max(100),
    order: z.number().int().min(0).optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid category ID') }),
  body: z.object({
    name: z.string().min(2, 'Category name is required').max(100).optional(),
    order: z.number().int().min(0).optional(),
  }),
});

// ─── Gallery Item Schemas ─────────────────────────────────────────────────────

export const createGalleryItemSchema = z.object({
  body: z.object({
    imageUrl: z.string().min(1, 'An image URL is required'),
    title: z.string().max(200).optional().nullable(),
    description: z.string().max(1000).optional().nullable(),
    thumbUrl: z.union([z.literal(''), z.string()]).optional().nullable(),
    span: z.string().max(100).optional(),
    alt: z.string().max(200).optional().nullable(),
  }),
});

export const updateGalleryItemSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid gallery item ID') }),
  body: z.object({
    imageUrl: z.string().min(1, 'An image URL is required').optional(),
    title: z.string().max(200).optional().nullable(),
    description: z.string().max(1000).optional().nullable(),
    thumbUrl: z.union([z.literal(''), z.string()]).optional().nullable(),
    span: z.string().max(100).optional(),
    alt: z.string().max(200).optional().nullable(),
  }),
});

// ─── Settings Schema ──────────────────────────────────────────────────────────

export const updateSettingsSchema = z.object({
  body: z
    .record(
      z.string().min(1, 'Setting key cannot be empty'),
      z.union([z.string(), z.number(), z.boolean()])
    )
    .refine((obj) => Object.keys(obj).length > 0, { message: 'At least one setting key is required' }),
});

