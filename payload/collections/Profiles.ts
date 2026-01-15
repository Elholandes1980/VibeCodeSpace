/**
 * payload/collections/Profiles.ts
 *
 * Profiles collection for user data linked to Clerk authentication.
 * Admin-only access for all operations.
 * Stores plan and role information for entitlements.
 *
 * Related:
 * - payload.config.ts
 * - docs/BUILD_INSTRUCTIONS.md (section 5: Auth & roles)
 */

import type { CollectionConfig } from 'payload'

export const Profiles: CollectionConfig = {
  slug: 'profiles',
  admin: {
    useAsTitle: 'displayName',
    description: 'User profiles linked to Clerk authentication',
    group: 'Admin',
  },
  access: {
    // Admin-only for all operations
    create: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'clerkUserId',
      type: 'text',
      label: 'Clerk User ID',
      admin: {
        description: 'ID from Clerk authentication (set automatically on signup)',
      },
      index: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      unique: true,
    },
    {
      name: 'displayName',
      type: 'text',
      label: 'Display Name',
      required: true,
    },
    {
      name: 'plan',
      type: 'select',
      label: 'Subscription Plan',
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Pro', value: 'pro' },
        { label: 'Studio', value: 'studio' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
      admin: {
        description: 'Subscription tier (synced from Stripe)',
      },
    },
    {
      name: 'roles',
      type: 'select',
      label: 'Roles',
      hasMany: true,
      defaultValue: ['member'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Partner', value: 'partner' },
        { label: 'Member', value: 'member' },
      ],
      admin: {
        description: 'User roles for access control',
      },
    },
  ],
  timestamps: true,
}
