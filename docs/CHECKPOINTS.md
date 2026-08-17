# Craftsflow Repository Checkpoints

## Checkpoint: "Team"
- **Commit Hash**: `e0e5174` (Reference: `e0e5157`)
- **Date**: 2026-08-18
- **Tag / Name**: `Team`
- **Description**: 
  - Home page simplified team section (CEO Spotlight with Muhammad Arman's photo and "Meet Our Full Team →" button).
  - Global Light & Dark mode switcher with `localStorage` persistence and anti-FOUC initialization.
  - Dedicated Team page (`src/pages/team.html` -> `/team/`).
  - Enhanced About page with healthcare & senior care origin story (solving \$4k–\$5k placement agency fee problem).
  - Downloaded high-res team photos saved in `images/team/`.

### Restore Instructions:
When the user asks to revert or get back to the **"Team"** checkpoint, execute:
```bash
git checkout e0e5174
# OR to reset main branch back to this checkpoint:
git reset --hard e0e5174
```
