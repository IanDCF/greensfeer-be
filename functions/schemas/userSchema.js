const { z } = require("zod")
exports.userSchema = z.object({
    first_name: z.string().trim().toLowerCase(),
    last_name: z.string().trim().toLowerCase(),
    email: z.string().trim().toLowerCase().email(),
    created_at: z.string()
});

