/**
 * payload/collections/index.ts
 *
 * Barrel export for all Payload collections.
 * Organized by purpose: Admin, Content.
 *
 * Related:
 * - payload.config.ts
 */

// Admin collections
export { Profiles } from './Profiles'

// Content collections (CMS-managed)
export { Media } from './Media'
export { Tags } from './Tags'
export { ToolCategories } from './ToolCategories'
export { Tools } from './Tools'
export { Cases } from './Cases'
export { PulseItems } from './PulseItems'
