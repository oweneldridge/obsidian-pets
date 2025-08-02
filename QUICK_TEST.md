# Quick Test Guide - 2 Minutes

## Setup Complete ✅
- Plugin installed in: `~/Documents/obsidian-notes/.obsidian/plugins/vault-pets/`
- New build (30K) with state machine: **Ready to test**

## Quick Start

1. **Open Obsidian** → Open your `obsidian-notes` vault

2. **Enable Plugin** (if needed):
   - Settings → Community Plugins → Toggle "Vault Pets" ON
   - Click "Reload" if prompted

3. **Open Pet View**:
   - Click dog icon 🐕 in left ribbon
   - OR: Cmd+P → "Open Pet View"

4. **What You Should See**:
   - ✅ Pet appears in right sidebar
   - ✅ Pet animates (sits, walks, runs, lies down)
   - ✅ Pet is Clippy (black paperclip) by default

## Quick Tests (60 seconds)

### Test 1: Animations Working?
- Watch pet for 30 seconds
- **Expected**: Pet changes states, moves around

### Test 2: Throw Ball
- Click circle icon (or Cmd+P → "Throw ball")
- **Expected**: Ball appears, pet chases it

### Test 3: Change Pet Type
- Settings → Vault Pets → Pet Type → "Dog"
- **Expected**: Dog appears with 5 color options

### Test 4: Add Multiple Pets
- Click plus icon → Choose a different pet
- **Expected**: Multiple pets animate together

### Test 5: Visual Effects
- Settings → Vault Pets → Visual Effect
- Try: Snow, Stars (dark theme), Leaves
- **Expected**: Particle effects appear and animate smoothly

## DevTools Check (Optional)

Press **Cmd+Option+I** (Mac) or **Ctrl+Shift+I** (Windows)

✅ **Good**: No red errors
⚠️ **OK**: Warnings about "rubber-duck" or "rocky" (old pets)
❌ **Bad**: Red TypeError messages

## If Everything Works

All tests pass? → Move to Phase 2: Visual Effects System!

## If Something Breaks

1. Copy error from DevTools Console
2. Check what test failed
3. Report back with details

---

**Full test details**: See `TEST_RESULTS.md` for comprehensive testing
