# PACKAGE_SCRIPTS_SNIPPET.md

Voeg dit toe aan `package.json` scripts:

```json
{
  "scripts": {
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "check:arch": "ts-node scripts/check-architecture.ts",
    "generate:feature": "ts-node scripts/generate-component.ts"
  }
}
```

Aanbevolen dev deps:
- ts-node
- typescript
- vitest
