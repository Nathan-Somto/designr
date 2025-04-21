import { auth } from "@designr/auth"
import { toNextJsHandler } from 'better-auth/next-js'
export const { POST, GET } = toNextJsHandler(auth);