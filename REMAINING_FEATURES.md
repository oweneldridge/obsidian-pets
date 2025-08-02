# Remaining Features to Implement

This document tracks features from vscode-pets that have not yet been implemented in obsidian-pets.

## Implementation Status

### ✅ Completed Features (14/14 from initial analysis)

1. ✅ **Friend/Companion System** - Pets seek friends and show hearts when they meet
2. ✅ **Individual Pet Deletion with Selection UI** - Enhanced modal with emoji and color
3. ✅ **Swipe Interaction on Mouseover** - Pets wave 👋 when hovered
4. ✅ **Dual Canvas Effect System** - Layered canvas for background/foreground effects
5. ✅ **Interactive Speech Bubbles on Hover** - Implemented via swipe interaction
6. ✅ **Enhanced State Persistence** - Friend relationships and positions saved/restored
7. ✅ **Color Theme Awareness** - Background/foreground adapt to Obsidian dark/light theme
8. ✅ **Window Resize Handler** - Canvas and pets reposition dynamically on view resize
9. ✅ **Random Spawn Positions** - Pets spawn at random safe positions (70% of container width)
10. ✅ **Cat Pet Type** - Full Cat implementation with climbing behavior (climbSpeed: 1.5, climbHeight: 100)
11. ✅ **Pet-Specific Climb Behaviors** - Totoro, Cat, and Squirrel all have working wall climbing sequences
12. ✅ **Bunny Pet Type** - Unique hopping behavior with stand states and duplicate transitions
13. ✅ **Squirrel Pet Type** - Advanced climbing with wallDig → wallNap → wallHang sequence (climbSpeed: 7, climbHeight: 150)
14. ✅ **All Missing Pet Types** - Now at 24 pet types (same as vscode-pets)

### 🎉 All High-Impact Features Complete!

**Pet Types:** obsidian-pets now has 24 pet types (same as vscode-pets)
- ✅ Cat - Climbing with climbSpeed: 1.5, climbHeight: 100
- ✅ Bunny - Unique hopping with stand states
- ✅ Squirrel - Advanced climbing with wallDig, wallNap states (climbSpeed: 7, climbHeight: 150)

### 🔄 Remaining Lower-Priority Features

## Medium Impact (Behavior Enhancements)

### 1. Pet Speed Variations
**Status:** Pending
**Priority:** Medium
**Impact:** Some pets should naturally move faster/slower than others

**Implementation Notes:**
- Currently all pets use same speed based on size only
- vscode-pets has PetSpeed enum and per-pet speed settings
- Should vary by pet type for personality (e.g., snail slow, zappy fast)

**Reference:**
```typescript
// BasePetType constructor sets speed based on size only
switch (this.petSize) {
    case PetSize.nano: this._speed = 1.0; break;
    case PetSize.small: this._speed = 1.5; break;
    case PetSize.medium: this._speed = 2.0; break;
    case PetSize.large: this._speed = 2.5; break;
}
```

## Lower Impact (Advanced Features)

### 2. Wall Digging State
**Status:** ✅ Implemented in Squirrel
**Priority:** Low (Complete for Squirrel)
**Impact:** Squirrel uses wallDigLeft in climbing sequence

**Implementation:**
- Squirrel: climbWallLeft → wallDigLeft → wallNap → wallHangLeft
- Could add to other climbing pets if desired

### 3. Wall Nap State
**Status:** ✅ Implemented in Squirrel
**Priority:** Low (Complete for Squirrel)
**Impact:** Squirrel naps while on wall

**Implementation:**
- Squirrel: wallDigLeft → wallNap → wallHangLeft
- Could add to Totoro or Cat if desired

### 4. Landing State
**Status:** State exists but unused
**Priority:** Low
**Impact:** Smooth landing animations after jumps/falls

**Implementation Notes:**
- `States.land` exists in states.ts
- Could improve jump-down transitions
- Would require proper animation assets

## Feature Comparison Summary

| Feature Category | vscode-pets | obsidian-pets | Status |
|-----------------|-------------|---------------|--------|
| Pet Types | 24 | 24 | ✅ Complete |
| Pet States | 18 | 18 | ✅ Complete |
| Ball Throwing | ✅ | ✅ | ✅ Complete |
| Friend System | ✅ | ✅ | ✅ Complete |
| Swipe Interaction | ✅ | ✅ | ✅ Complete |
| Speech Bubbles | ✅ | ✅ | ✅ Complete |
| Theme Backgrounds | ✅ | ✅ | ✅ Complete |
| Theme Foregrounds | ✅ | ✅ | ✅ Complete |
| Dual Canvas Effects | ✅ | ✅ | ✅ Complete |
| State Persistence | ✅ | ✅ | ✅ Complete |
| Resize Handler | ✅ | ✅ | ✅ Complete |
| Random Spawn | ✅ | ✅ | ✅ Complete |
| Wall Climbing | ✅ (3 pets) | ✅ (3 pets) | ✅ Complete |
| Wall Dig/Nap States | ✅ (1 pet) | ✅ (1 pet) | ✅ Complete |
| Speed Variations | ✅ | ❌ | ⏳ Pending |

## Implementation Order

Completed Implementation Order:

1. ✅ **Window Resize Handler** - Canvas and pet positioning updates dynamically
2. ✅ **Random Spawn Positions** - Pets spawn at varied safe positions
3. ✅ **Cat Pet Type with Climbing** - Full climbing behavior
4. ✅ **Bunny Pet Type** - Unique hopping behavior with stand states
5. ✅ **Squirrel Pet Type** - Advanced climbing with wallDig and wallNap states
6. ✅ **Wall Climbing Verification** - Totoro, Cat, and Squirrel all working
7. ✅ **Advanced Wall States** - Squirrel implements wallDig and wallNap

Optional Future Enhancements:

1. **Pet Speed Variations** - Per-pet speed multipliers (currently size-based only)
2. **Landing State Usage** - Smooth landing animations (state exists but unused)

## Notes

- All state definitions already exist in `src/states.ts`
- Media assets for all pets already copied from vscode-pets
- Main work is porting pet-specific behavior sequences
- Wall climbing requires proper boundary detection and floor awareness

---

**Last Updated:** 2025-01-14
**Next Review:** After implementing high-impact features
