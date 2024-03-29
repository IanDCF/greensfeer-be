const { z } = require("zod");
exports.userLocationSchema = z.object({
  city: z.string().trim().nullable(),
  state_province: z.string().trim().nullable(),
  country: z.string().trim().nullable(),
});
exports.baseUserSchema = z.object({
  first_name: z.string().trim(),
  last_name: z.string().trim(),
  headline: z.string().trim().nullable(),
  role: z.string().trim().nullable(),
  notifications: z.boolean(),
  newsletter: z.boolean(),
});

exports.createUserSchema = exports.baseUserSchema.extend({
  email: z.string().trim().toLowerCase().email(),
  created_at: z.any(),
});

exports.updateUserSchema = z.object({
  first_name: z.string().trim(),
  last_name: z.string().trim(),
  headline: z.string().trim().nullable().optional(),
  role: z.string().trim(),
  profile_picture: z.string().url().nullable().optional(),
  profile_banner: z.string().url().nullable().optional(),
  linkedin: z.string().trim().nullable().optional(),
  location: z.string().trim(),
  about: z.string().trim().nullable().optional(),
  modified_at: z.any(),
});
