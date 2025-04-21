import { auth } from './config';
export * as authTypes from 'better-auth/types'
export type Session = typeof auth.$Infer.Session;
export { auth };