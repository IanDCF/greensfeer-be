const { z, string } = require("zod")

exports.userLocationSchema = z.object({
    city: string().trim().optional().nullable(),
    state_province: string().trim().optional().nullable(),
    country: string().trim().optional().nullable(),
})
exports.baseUserSchema = z.object({
    first_name: z.string().trim().toLowerCase(),
    last_name: z.string().trim().toLowerCase(),
    email: z.string().trim().toLowerCase().email(),
    profile_picture: string().url().optional().nullable(),
    profile_banner: z.string().url().optional().nullable(),
    headline: string().trim().optional().nullable(),
    linkedin: string().trim().optional().nullable(),
    location: exports.userLocationSchema.optional().nullable(),
    about: string().trim().optional().nullable(),
    created_at: string().trim().optional().nullable()
});
exports.createUserSchema = baseUserSchema
exports.updateUserSchema = baseUserSchema


// exports.singleUserSchema = z.object({
//     id: z.string()
// })

// exports.updateUserSchema = z.object({
//     //Add needed variables
// })

// exports.deleteUserSchema = z.object({
//     id: z.string()
// })