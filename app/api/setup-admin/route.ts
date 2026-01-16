/**
 * app/api/setup-admin/route.ts
 *
 * One-time setup endpoint to create admin user.
 * DELETE THIS FILE AFTER USE!
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Delete ALL existing users first
    const existing = await payload.find({ collection: 'users', limit: 100 })
    for (const user of existing.docs) {
      await payload.delete({ collection: 'users', id: user.id })
    }

    // Create fresh admin user
    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'david@solmatebusiness.com',
        password: 'admin123',
        role: 'admin',
        name: 'David',
      },
    })

    return NextResponse.json({
      success: true,
      email: user.email,
      password: 'admin123',
      message: 'User created! Login now at /admin/login'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
