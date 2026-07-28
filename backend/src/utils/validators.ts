import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const updateContactStatusSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid contact message ID') }),
  body: z.object({
    status: z.enum(['UNREAD', 'READ', 'REPLIED']),
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

const menuItemBody = z.object({
  name: z.string().min(2, 'Name is required'),
  nameAm: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionAm: z.string().optional().nullable(),
  price: z.string().min(1, 'Price is required'),
  tag: z.string().optional().nullable(),
  categoryId: z.string().uuid('Invalid category ID'),
  branchId: z.string().uuid().optional().nullable(),
  isAvailable: z.boolean().optional(),
  imageUrl: z.union([z.literal(''), z.string()]).optional().nullable(),
});

export const createEventBookingSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Name is required'),
    phone: z.string().min(10, 'A valid phone number is required'),
    email: z.string().email('A valid email is required for your confirmation'),
    serviceType: z.enum([
      'WEDDING',
      'ENGAGEMENT',
      'HALL_RENTAL',
      'CATERING',
      'CORPORATE',
      'BIRTHDAY',
      'VIP',
      'VVIP',
      'OTHER',
    ]),
    eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
    guestCount: z.number().int().min(1).max(5000).optional().nullable(),
    branchId: z.string().uuid('Invalid branch ID').optional().nullable(),
    message: z.string().max(1000).optional().nullable(),
  }),
});

export const updateEventBookingStatusSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid booking ID') }),
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']),
  }),
});

export const createMenuItemSchema = z.object({
  body: menuItemBody,
});

// PUT edits are partial — only the changed fields need to be sent.
export const updateMenuItemSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid menu item ID') }),
  body: menuItemBody.partial(),
});

const branchBody = z.object({
  name: z.string().min(2, 'Name is required'),
  nameAm: z.string().optional().nullable(),
  label: z.string().optional().nullable(),
  labelAm: z.string().optional().nullable(),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(10, 'Phone is required'),
  email: z.union([z.literal(''), z.string().email('Invalid email address')]).optional().nullable(),
  workingHours: z.string().optional().nullable(),
  workingHoursAm: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  noteAm: z.string().optional().nullable(),
  capacity: z.number().int().min(1).optional(),
});

export const createBranchSchema = z.object({
  body: branchBody,
});

// PUT edits are partial — only the changed fields need to be sent.
export const updateBranchSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid branch ID') }),
  body: branchBody.partial(),
});

// ─── Category Schemas ────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name is required').max(100),
    nameAm: z.string().max(100).optional().nullable(),
    order: z.number().int().min(0).optional(),
    parentId: z.string().uuid('Invalid parent category ID').optional().nullable(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid category ID') }),
  body: z.object({
    name: z.string().min(2, 'Category name is required').max(100).optional(),
    nameAm: z.string().max(100).optional().nullable(),
    order: z.number().int().min(0).optional(),
    parentId: z.string().uuid('Invalid parent category ID').optional().nullable(),
  }),
});

// ─── Gallery Item Schemas ─────────────────────────────────────────────────────

export const createGalleryItemSchema = z.object({
  body: z.object({
    imageUrl: z.string().min(1, 'An image URL is required'),
    title: z.string().max(200).optional().nullable(),
    titleAm: z.string().max(200).optional().nullable(),
    description: z.string().max(1000).optional().nullable(),
    descriptionAm: z.string().max(1000).optional().nullable(),
    thumbUrl: z.union([z.literal(''), z.string()]).optional().nullable(),
    span: z.string().max(100).optional(),
    group: z.enum(['MOMENTS', 'LIFE']).optional(),
    alt: z.string().max(200).optional().nullable(),
  }),
});

export const updateGalleryItemSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid gallery item ID') }),
  body: z.object({
    imageUrl: z.string().min(1, 'An image URL is required').optional(),
    title: z.string().max(200).optional().nullable(),
    titleAm: z.string().max(200).optional().nullable(),
    description: z.string().max(1000).optional().nullable(),
    descriptionAm: z.string().max(1000).optional().nullable(),
    thumbUrl: z.union([z.literal(''), z.string()]).optional().nullable(),
    span: z.string().max(100).optional(),
    group: z.enum(['MOMENTS', 'LIFE']).optional(),
    alt: z.string().max(200).optional().nullable(),
  }),
});

// ─── Testimonial Schemas ──────────────────────────────────────────────────────

const testimonialBody = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  role: z.string().max(160).optional().nullable(),
  roleAm: z.string().max(160).optional().nullable(),
  quote: z.string().min(4, 'Quote is required').max(1000),
  quoteAm: z.string().max(1000).optional().nullable(),
  imageUrl: z.union([z.literal(''), z.string()]).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const createTestimonialSchema = z.object({
  body: testimonialBody,
});

export const updateTestimonialSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid testimonial ID') }),
  body: testimonialBody.partial(),
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

