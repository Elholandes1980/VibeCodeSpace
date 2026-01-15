/**
 * scripts/check-architecture.ts
 *
 * Architecture enforcement script that validates:
 * - File size limits (warn 300-500, error >500 lines)
 * - Required file header comments for TS/TSX files
 *
 * Run with: pnpm check:arch
 *
 * Related:
 * - docs/ARCHITECTURE-GUIDELINES.md
 * - docs/BUILD_INSTRUCTIONS.md
 */

import * as fs from 'fs'
import * as path from 'path'

const WARN_THRESHOLD = 300
const ERROR_THRESHOLD = 500

const DIRS_TO_CHECK = ['app', 'components', 'features', 'lib', 'payload']
const EXTENSIONS = ['.ts', '.tsx']
const IGNORE_PATTERNS = ['.d.ts', 'node_modules', '.next', '.git']

interface FileIssue {
  file: string
  type: 'error' | 'warning'
  message: string
}

function countLines(filePath: string): number {
  const content = fs.readFileSync(filePath, 'utf-8')
  return content.split('\n').length
}

function hasHeaderComment(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8')
  const trimmed = content.trimStart()
  // Accept JSDoc (/**), single-line (//), or block (/*) comments
  return trimmed.startsWith('/**') || trimmed.startsWith('//') || trimmed.startsWith('/*')
}

function shouldIgnore(filePath: string): boolean {
  return IGNORE_PATTERNS.some((pattern) => filePath.includes(pattern))
}

function walkDir(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (shouldIgnore(fullPath)) continue

    if (entry.isDirectory()) {
      walkDir(fullPath, files)
    } else if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      if (!entry.name.endsWith('.d.ts')) {
        files.push(fullPath)
      }
    }
  }

  return files
}

function checkFile(filePath: string): FileIssue[] {
  const issues: FileIssue[] = []
  const lineCount = countLines(filePath)
  const relativePath = path.relative(process.cwd(), filePath)

  if (lineCount > ERROR_THRESHOLD) {
    issues.push({
      file: relativePath,
      type: 'error',
      message: `File has ${lineCount} lines (max ${ERROR_THRESHOLD}). Split required.`,
    })
  } else if (lineCount > WARN_THRESHOLD) {
    issues.push({
      file: relativePath,
      type: 'warning',
      message: `File has ${lineCount} lines (recommended max ${WARN_THRESHOLD}).`,
    })
  }

  if (!hasHeaderComment(filePath)) {
    issues.push({
      file: relativePath,
      type: 'warning',
      message: 'Missing required file header comment.',
    })
  }

  return issues
}

function main() {
  console.log('🔍 Checking architecture...\n')

  const allFiles: string[] = []

  for (const dir of DIRS_TO_CHECK) {
    const dirPath = path.join(process.cwd(), dir)
    walkDir(dirPath, allFiles)
  }

  const allIssues: FileIssue[] = []

  for (const file of allFiles) {
    const issues = checkFile(file)
    allIssues.push(...issues)
  }

  const errors = allIssues.filter((i) => i.type === 'error')
  const warnings = allIssues.filter((i) => i.type === 'warning')

  if (warnings.length > 0) {
    console.log('⚠️  Warnings:')
    for (const warning of warnings) {
      console.log(`   ${warning.file}: ${warning.message}`)
    }
    console.log('')
  }

  if (errors.length > 0) {
    console.log('❌ Errors:')
    for (const error of errors) {
      console.log(`   ${error.file}: ${error.message}`)
    }
    console.log('')
  }

  console.log(`📊 Summary: ${allFiles.length} files checked`)
  console.log(`   ${errors.length} errors, ${warnings.length} warnings`)

  if (errors.length > 0) {
    process.exit(1)
  }

  console.log('\n✅ Architecture check passed!')
}

main()
