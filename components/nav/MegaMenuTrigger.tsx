/**
 * components/nav/MegaMenuTrigger.tsx
 *
 * Client component for mega menu open/close interaction.
 * Minimal client-side code for toggling menu visibility.
 * Handles keyboard navigation and accessibility.
 *
 * Related:
 * - components/nav/MegaMenuPanel.tsx
 * - components/site-header.tsx
 */

'use client'

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MegaMenuTriggerProps {
  label: string
  isActive?: boolean
  children: ReactNode
  className?: string
}

export function MegaMenuTrigger({
  label,
  isActive = false,
  children,
  className,
}: MegaMenuTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear any pending close timeout
  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [])

  // Open menu
  const openMenu = useCallback(() => {
    clearCloseTimeout()
    setIsOpen(true)
  }, [clearCloseTimeout])

  // Close menu with delay (allows moving to panel)
  const closeMenuWithDelay = useCallback(() => {
    clearCloseTimeout()
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }, [clearCloseTimeout])

  // Immediate close
  const closeMenu = useCallback(() => {
    clearCloseTimeout()
    setIsOpen(false)
  }, [clearCloseTimeout])

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeMenu()
        triggerRef.current?.focus()
      }
    },
    [isOpen, closeMenu]
  )

  // Handle click outside
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeMenu()
      }
    },
    [closeMenu]
  )

  // Set up event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      clearCloseTimeout()
    }
  }, [handleKeyDown, handleClickOutside, clearCloseTimeout])

  // Focus first link when opening
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const firstLink = panelRef.current.querySelector('a')
      if (firstLink) {
        // Small delay to ensure panel is visible
        setTimeout(() => firstLink.focus(), 50)
      }
    }
  }, [isOpen])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenuWithDelay}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onFocus={openMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors',
          isActive || isOpen
            ? 'text-[hsl(var(--accent))]'
            : 'text-muted-foreground hover:text-foreground',
          className
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
        {(isActive && !isOpen) && (
          <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[hsl(var(--accent))]" />
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          onMouseEnter={openMenu}
          onMouseLeave={closeMenuWithDelay}
          className={cn(
            'absolute left-1/2 top-full pt-2 -translate-x-1/2',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
          style={{ width: 'max-content', maxWidth: 'calc(100vw - 2rem)' }}
        >
          <div
            className={cn(
              'w-[800px] max-w-[calc(100vw-2rem)]',
              'rounded-2xl border border-border/50 bg-background shadow-xl',
              'overflow-hidden'
            )}
            role="menu"
            aria-label={`${label} menu`}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
