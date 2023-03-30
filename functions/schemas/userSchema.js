const { z } = require("zod")
const {
  Timestamp,
} = require("firebase-admin/firestore");
exports.userLocationSchema = z.object({
  city: z.string().trim().nullable(),
  state_province: z.string().trim().nullable(),
  country: z.string().trim().nullable(),
});
exports.baseUserSchema = z.object({
  first_name: z.string().trim().toLowerCase(),
  last_name: z.string().trim().toLowerCase(),
});

exports.createUserSchema = exports.baseUserSchema.extend({
  email: z.string().trim().toLowerCase().email(),
  created_at: z.instanceof(Timestamp)
});

exports.updateUserSchema = exports.baseUserSchema.extend({
  role: z.string().trim().nullable(),
  profile_picture: z.string().url().nullable(),
  profile_banner: z.string().url().nullable(),
  headline: z.string().trim().nullable(),
  linkedin: z.string().trim().nullable(),
  location: exports.userLocationSchema,
  about: z.string().trim().nullable(),
  modified_at: z.any()
});