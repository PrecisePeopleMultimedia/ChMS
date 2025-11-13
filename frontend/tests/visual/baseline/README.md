# Visual Regression Baseline Tests

**Purpose**: Capture baseline screenshots of the current UI BEFORE design system migration.

**⚠️ CRITICAL**: 
- Run these tests ONCE before starting Phase 1 migration
- DO NOT update these screenshots during migration
- These are the baseline for comparison with new implementation

## Running Baseline Tests

```bash
# Run all baseline tests
npm run test:e2e -- tests/visual/baseline

# Run specific baseline test
npm run test:e2e -- tests/visual/baseline/pages/dashboard.baseline.spec.ts
```

## Baseline Screenshots Location

Screenshots will be stored in:
- `tests/visual/baseline/screenshots/` (Playwright default)

## Updating Baselines

**DO NOT** update baseline screenshots during migration. These represent the "before" state.

To update baselines (only if current UI changes significantly):
```bash
npm run test:e2e -- tests/visual/baseline --update-snapshots
```

## Comparison with New Implementation

After implementing new design system:
1. Run visual regression tests comparing new implementation with baseline
2. Use side-by-side comparison tool
3. Verify pixel-perfect match with React prototype

## Test Structure

- `pages/` - Full page screenshots
- `components/` - Component-level screenshots
- `layouts/` - Layout screenshots
- `interactions/` - Interactive state screenshots

