/**
 * app/(frontend)/(public)/[locale]/admin/intakes/AdminLoginForm.tsx
 *
 * Simple login form that sets admin_token cookie.
 * No actual auth - just token verification via server action.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/admin/intakes/page.tsx
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminLoginForm() {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        setError('Invalid token')
      }
    } catch {
      setError('Failed to verify token')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="token">Access Token</Label>
        <Input
          id="token"
          type="password"
          value={token}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
          placeholder="Enter admin token"
          required
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Login'}
      </Button>
    </form>
  )
}
