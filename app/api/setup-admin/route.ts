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

    // Check if users exist
    const existing = await payload.find({ collection: 'users', limit: 1 })
    if (existing.totalDocs > 0) {
      return NextResponse.json({ error: 'Users already exist', count: existing.totalDocs })
    }

    // Create admin user
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
      message: 'Login with email: david@solmatebusiness.com, password: admin123'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
