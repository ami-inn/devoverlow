import { handlers } from "@/auth" // Referring to the auth.ts we just created
export const { GET, POST } = handlers


// ... represent in the folder structure that there might be other files or folders present
// it will match all routes under /api/auth/ such as /api/auth/signin, /api/auth/signout, etc.