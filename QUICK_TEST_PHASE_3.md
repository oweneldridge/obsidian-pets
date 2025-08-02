# Quick Test Guide - Phase 3: All 20 Pets

**Build**: v1.0.3 (61K main.js)
**Status**: Deployed to `~/Documents/obsidian-notes/.obsidian/plugins/vault-pets/`

## Quick Start (5 minutes)

### 1. Open Obsidian
- Open your `obsidian-notes` vault
- Click dog icon 🐕 in left ribbon OR Cmd+P → "Open Pet View"

### 2. Test New Pets (Alphabetical Order)

**Simple Pets** (1 color, standard animations):
- [ ] **Chicken** ✅ (original)
- [ ] **Clippy** ✅ (original)
- [ ] **Cockatiel** 🆕 - Brown/Gray bird
- [ ] **Crab** ✅ (original)
- [ ] **Deno** 🆕 - Green dinosaur
- [ ] **Dog** ✅ (original)
- [ ] **Fox** ✅ (original)
- [ ] **Mod** 🆕 - Purple mod
- [ ] **Morph** 🆕 - Purple morph
- [ ] **Rubber Duck** 🆕 - Yellow duck
- [ ] **Snail** 🆕 - Brown snail
- [ ] **Snake** 🆕 - Green snake
- [ ] **Zappy** 🆕 - Yellow electric

**Multi-Color Pets**:
- [ ] **Panda** 🆕 - Black/Brown (has lie animation)
- [ ] **Rat** 🆕 - Brown/Gray/White
- [ ] **Turtle** 🆕 - Green/Orange (has lie animation)

**Complex Pets** (10+ colors):
- [ ] **Horse** 🆕 - 11 colors! (black, brown, white, magical, paint*, socks*, warrior)
- [ ] **Skeleton** 🆕 - 10 colors! (blue, brown, green, orange, pink, purple, red, warrior, white, yellow)

**Special Behavior Pets**:
- [ ] **Rocky** 🆕 - Gray rock (doesn't chase balls!)
- [ ] **Totoro** 🆕 - Gray (climbs walls!)

### 3. Quick Feature Tests

**Multi-Color Test** (Horse - 2 minutes):
1. Settings → Pet Type → Horse
2. Check Color dropdown updates with 11 options:
   - black, brown, white
   - magical, warrior
   - paint beige, paint black, paint brown
   - socks beige, socks black, socks brown
3. Try 2-3 different colors → pet respawns immediately

**Special Behavior Tests** (3 minutes):
1. **Rocky (No Ball Chase)**:
   - Spawn Rocky
   - Cmd+P → "Throw ball"
   - **Expected**: Rocky ignores the ball completely (canChase: false)

2. **Totoro (Wall Climbing)**:
   - Spawn Totoro
   - Wait for climb animation
   - **Expected**: Totoro climbs wall, hangs, jumps down, lands

3. **Horse/Skeleton (Stand Animation)**:
   - Spawn Horse or Skeleton
   - Wait for stand animation
   - **Expected**: Pet stands upright (different from idle)

### 4. Visual Effects Still Work?
- Settings → Visual Effect
- Try: Snow, Stars (dark theme), Leaves
- **Expected**: Effects work with all 20 pets

## Detailed Pet Roster

### Original 5 Pets (Phase 1) ✅
1. **Dog** - Brown/Black/White/Red/Akita (5 colors)
2. **Crab** - Red (1 color)
3. **Chicken** - White (1 color)
4. **Clippy** - Black/Red/Yellow/Green (4 colors)
5. **Fox** - Red/White (2 colors)

### New 15 Pets (Phase 3) 🆕

**Simple Pets** (6 animations):
6. **Snake** - Green (1 color)
7. **Snail** - Brown (1 color)
8. **Deno** - Green (1 color)
9. **Zappy** - Yellow (1 color)
10. **Morph** - Purple (1 color)
11. **Mod** - Purple (1 color)
12. **Rubber Duck** - Yellow (1 color)

**Rocky** (5 animations, NO ball chase):
13. **Rocky** - Gray (1 color) - **Special: Doesn't chase balls!**

**Multi-Color with Lie**:
14. **Turtle** - Green/Orange (2 colors)
15. **Panda** - Black/Brown (2 colors)

**Multi-Color Birds**:
16. **Cockatiel** - Brown/Gray (2 colors)
17. **Rat** - Brown/Gray/White (3 colors)

**Complex with Stand** (10+ colors):
18. **Horse** - 11 colors! (black, brown, white, magical, paintbeige, paintblack, paintbrown, socksbeige, socksblack, socksbrown, warrior)
19. **Skeleton** - 10 colors! (blue, brown, green, orange, pink, purple, red, warrior, white, yellow)

**Special Wall Climbing**:
20. **Totoro** - Gray (1 color) - **Special: Climbs walls!**

## Animation Cheat Sheet

**All Pets Have** (6 animations):
- idle (sitting)
- walk (left/right)
- walk_fast (left/right)
- run (left/right)
- swipe (quick paw swipe)
- with_ball (holding ball after chase)

**Turtle, Panda** (+1 animation):
- lie (lying down state)

**Horse, Skeleton** (+1 animation):
- stand (standing upright, directional: standRight/standLeft)
- Note: These pets cannot swipe!

**Rocky** (-1 animation):
- Missing: with_ball (doesn't chase balls!)

**Totoro** (+5 animations):
- wallclimb (climbing up wall)
- wallgrab (hanging on wall)
- jump (jumping off wall)
- land (landing after jump)
- fall_from_grab (falling from wall)
- Plus: lie animation

## Expected Behavior

### Normal Pets
1. Spawn with idle animation
2. Randomly walk/run left and right
3. Occasionally swipe
4. When ball thrown: chase → catch → idle with ball
5. Return to normal movement after ball

### Rocky (Special)
1. Same as normal EXCEPT:
2. When ball thrown: **ignores it completely**
3. No chase animation, no with_ball animation

### Totoro (Special)
1. All normal behaviors PLUS:
2. Occasionally climbs wall (climbWallLeft)
3. Hangs on wall (wallHangLeft)
4. Jumps down (jumpDownLeft)
5. Lands (land)
6. Returns to normal movement

### Horse/Skeleton (Special)
1. Cannot swipe (no swipe animation)
2. Has stand animation (stands upright occasionally)
3. Otherwise behaves normally

## If Something Breaks

### Browser Console (Cmd+Option+I)
**Good**:
```
[vault-pets] Pet view opened
[vault-pets] Spawning pet: horse, black
```

**Bad**:
```
❌ TypeError: Cannot read property 'possibleColors' of undefined
❌ Failed to create pet of type horse
❌ Animation file not found: media/horse/black/idle.gif
```

### Common Issues

1. **Pet doesn't appear**:
   - Check console for errors
   - Verify media files copied: `ls media/horse/` (should have 89 files)
   - Try different pet type

2. **Wrong colors showing**:
   - Check console for color validation warnings
   - Try reloading Obsidian

3. **Animations not working**:
   - Check media files exist
   - Verify pet type implemented in pets-factory.ts

4. **Ball behavior issues**:
   - Rocky should ignore ball (expected)
   - Others should chase (if not, check canChase in pet file)

## Success Criteria

✅ All 20 pets appear in dropdown (alphabetically)
✅ Each pet spawns with correct default color
✅ Multi-color pets show correct color options
✅ Rocky ignores thrown balls
✅ Totoro climbs walls
✅ Horse/Skeleton show stand animation
✅ All animations play smoothly
✅ Visual effects work with all pets
✅ No console errors

## Next Steps

If all tests pass:
1. Close and reopen Obsidian → pets should persist
2. Try adding multiple pets (+ icon)
3. Test with different sizes (nano, small, medium, large)
4. Try different themes (castle, forest, beach, winter)
5. Test with different effects (snow, stars, leaves)

---

**Ready to Test!** Open Obsidian and start exploring your 20-pet menagerie! 🐾
