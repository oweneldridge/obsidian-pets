# ESLint Configuration - Obsidian Plugin Standards

This ESLint configuration enforces the same standards as ObsidianReviewBot to ensure plugin submissions pass automated review.

## Configured Rules

### 1. Console Usage
**Rule**: `no-console`
- ✅ Allowed: `console.warn()`, `console.error()`, `console.debug()`
- ❌ Forbidden: `console.log()`, `console.info()`, etc.

**Why**: Production plugins should use appropriate log levels for debugging.

### 2. Type Safety

#### Explicit Any
**Rule**: `@typescript-eslint/no-explicit-any`
- ❌ Forbidden: `let foo: any`
- ✅ Required: Use specific types or `unknown`

#### Unsafe Type Operations
**Rules**:
- `@typescript-eslint/no-unsafe-assignment`
- `@typescript-eslint/no-unsafe-member-access`
- `@typescript-eslint/no-unsafe-call`
- `@typescript-eslint/no-unsafe-return`

**Why**: Prevents runtime type errors by ensuring type safety throughout the codebase.

### 3. Promise Handling

#### Floating Promises
**Rule**: `@typescript-eslint/no-floating-promises`
- ❌ Forbidden: Promises without `.then()`, `.catch()`, or `await`
- ✅ Required: `await promise()` or `void promise()` for fire-and-forget

#### Misused Promises
**Rule**: `@typescript-eslint/no-misused-promises`
- ❌ Forbidden: Async functions where void-returning functions expected
- ✅ Required: Proper async/void type matching

#### Require Await
**Rule**: `@typescript-eslint/require-await`
- ❌ Forbidden: `async` functions with no `await` expressions
- ✅ Required: Remove `async` keyword if not using await

### 4. Enum Safety
**Rule**: `@typescript-eslint/no-unsafe-enum-comparison`
- ❌ Forbidden: Comparing strings to enum values
- ✅ Required: Use enum types in function signatures

### 5. Unnecessary Constructs

#### Type Assertions
**Rule**: `@typescript-eslint/no-unnecessary-type-assertion`
- ❌ Forbidden: Type assertions that don't change the type
- ✅ Required: Remove redundant assertions

#### Await Thenable
**Rule**: `@typescript-eslint/await-thenable`
- ❌ Forbidden: `await` on non-Promise values
- ✅ Required: Only await Promises

### 6. ESLint Directives
**Rule**: `eslint-comments/require-description`
- ❌ Forbidden: `// eslint-disable-next-line` without description
- ✅ Required: `// Reason why rule is disabled`

## Running Lint

```bash
npm run lint        # Check for errors
npm run lint:fix    # Auto-fix where possible
```

## Build Verification

The ESLint check runs automatically before each build:

```bash
npm run build       # Includes lint check
```

## Standards Alignment

This configuration matches ObsidianReviewBot's automated review criteria:
- Type safety enforcement
- Promise handling requirements
- Console usage restrictions
- Code quality standards

All rules align with Obsidian plugin submission requirements for automated approval.
