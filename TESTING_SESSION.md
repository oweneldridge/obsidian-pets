# Testing Session - Phase 3: All 20 Pets

**Date**: 2025-11-14
**Build**: v1.0.3 (61K main.js)
**Status**: Ready for testing

## Testing Instructions

### Step 1: Open Pet View in Obsidian

1. Look for the **dog icon 🐕** in the **left ribbon** (sidebar)
2. Click it to open the Pet View
3. The view should open in the right sidebar

**Alternative**: Press `Cmd+P` and type "Open Pet View"

### Step 2: Access Settings

1. Click the **gear icon ⚙️** in bottom left
2. Scroll down to **Community Plugins** section
3. Find **Vault Pets** in the list
4. Click on **Vault Pets** to open its settings

### Step 3: Quick Test - Try 5 New Pets

Let's test 5 different new pets to verify everything works:

#### Test 1: Snake (Simple Pet)
1. In settings, click **Pet Type** dropdown
2. Select **Snake**
3. **Expected**: Green snake appears and starts animating
4. Try throwing ball (Cmd+P → "Throw ball")
5. **Expected**: Snake chases and catches the ball

#### Test 2: Horse (Complex Multi-Color Pet)
1. Pet Type → **Horse**
2. Notice the **Pet Color** dropdown updates with **11 colors**!
3. Try these colors:
   - **black** (standard)
   - **magical** (special!)
   - **socks black** (unique pattern)
4. **Expected**: Horse changes color immediately, animations work
5. Wait for **stand** animation (horse stands upright)

#### Test 3: Rocky (Special No-Chase Behavior)
1. Pet Type → **Rocky**
2. **Expected**: Gray rock appears
3. Try throwing ball (Cmd+P → "Throw ball")
4. **Expected**: Rocky **IGNORES** the ball (doesn't chase it!)
5. This is correct behavior - rocks don't chase balls!

#### Test 4: Totoro (Wall Climbing Pet)
1. Pet Type → **Totoro**
2. **Expected**: Gray Totoro appears
3. Wait and watch (30-60 seconds)
4. **Expected**: Totoro should eventually:
   - Climb up the wall
   - Hang on the wall
   - Jump down
   - Land safely
5. This is unique - only Totoro can climb!

#### Test 5: Skeleton (Complex Multi-Color)
1. Pet Type → **Skeleton**
2. Notice **Pet Color** dropdown has **10 colors**!
3. Try these fun colors:
   - **pink** (pink skeleton!)
   - **warrior** (armored skeleton)
   - **blue** (spooky!)
4. **Expected**: Skeleton changes color, shows stand animation

### Step 4: Verify Settings Dropdown

1. Open Pet Type dropdown
2. **Expected**: Should see all 20 pets in alphabetical order:
   - Chicken, Clippy, Cockatiel, Crab, Deno
   - Dog, Fox, Horse, Mod, Morph
   - Panda, Rat, Rocky, Rubber Duck, Skeleton
   - Snail, Snake, Totoro, Turtle, Zappy

### Step 5: Test Visual Effects (Still Working?)

1. Settings → **Visual Effect** dropdown
2. Try each effect:
   - **Snow**: White particles falling with drift
   - **Stars** (switch to dark theme first): Twinkling stars
   - **Leaves**: Autumn leaves falling with rotation
3. **Expected**: Effects work with all 20 pet types

## Testing Checklist

### Basic Functionality
- [ ] Pet view opens successfully
- [ ] All 20 pets appear in dropdown (alphabetically)
- [ ] Pets spawn correctly when selected
- [ ] Animations play smoothly
- [ ] Color dropdown updates for multi-color pets

### Special Behaviors
- [ ] **Rocky**: Ignores thrown balls (canChase: false)
- [ ] **Totoro**: Climbs walls occasionally
- [ ] **Horse/Skeleton**: Show stand animation (not just idle)

### Multi-Color Pets (Quick Check)
- [ ] **Horse**: 11 colors available
- [ ] **Skeleton**: 10 colors available
- [ ] **Rat**: 3 colors (brown, gray, white)
- [ ] **Turtle**: 2 colors (green, orange)
- [ ] **Panda**: 2 colors (black, brown)
- [ ] **Cockatiel**: 2 colors (brown, gray)

### Visual Effects
- [ ] Snow works with new pets
- [ ] Stars work (dark theme)
- [ ] Leaves work with new pets
- [ ] Effects can be disabled

## Common Issues & Solutions

### Issue: Pet doesn't appear
**Check**:
1. Open DevTools (Cmd+Option+I)
2. Look for errors in Console tab
3. Check Network tab for failed image loads

**Common causes**:
- Media files not copied correctly
- Pet type not in factory

### Issue: Wrong colors showing
**Check**:
1. Console for color validation warnings
2. Verify color is in pet's possibleColors array

**Solution**: Try a different color or pet type

### Issue: Animations stuttering
**Check**:
1. System resources (Activity Monitor)
2. Number of pets on screen
3. Visual effects enabled?

**Solution**: Reduce pet size or disable effects

### Issue: Rocky chases ball (unexpected!)
**This is a bug** - Rocky should NOT chase balls. Check:
1. Console for "Rocky spawned" message
2. Verify canChase: false in rocky.ts

## Success Criteria

✅ **Critical**: All 20 pets spawn and animate
✅ **Critical**: Rocky doesn't chase balls
✅ **Critical**: No console errors
✅ **Important**: Multi-color pets show correct colors
✅ **Important**: Totoro climbs walls
✅ **Nice**: Stand animations work for Horse/Skeleton

## Notes & Observations

Use this section to record what you see:

### Working Well:
-

### Issues Found:
-

### Favorite Pets:
-

### Suggested Improvements:
-

---

## After Testing

If everything works:
1. ✅ Mark Phase 3 as **tested and verified**
2. 🎉 Celebrate - you now have 20 animated pets!
3. 📝 Document any issues found
4. 🚀 Consider Phase 4 features (multiple pets, interactions, etc.)

If issues found:
1. 📝 Document the issue in "Issues Found" section above
2. 🔍 Check console for error messages
3. 🛠️ Report back with details for fixing

---

**Ready to test!** Open Obsidian and let's see those pets in action! 🐾
