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

---

## Checkpoint: "light and dark" (Senior Care Copy & Light Mode Default)
- **Commit Hash**: `0a07f39` (Base Commit: `2200c19`)
- **Date**: 2026-08-18
- **Tag / Name**: `light and dark`
- **Description**:
  - **Light Mode as Default Theme**: Set Light Mode as default across `css/style.css`, `src/templates/header.html`, and `js/main.js`, while preserving dark mode toggle functionality.
  - **Senior Care & Assisted Living Referral Pipeline Copy**:
    - **Hero**: *"Stop Paying a Placement Agency For Every Referral. Build a Pipeline You Own."*
    - **Problem**: *"Every Empty Bed Is Costing You Money Right Now"* ($4,000 to $5,000 placement agency fee breakdown).
    - **System Pillars & 3-Step Engine**: B2B outreach to hospital discharge planners, geriatric care managers, case managers, and senior nurses.
    - **Interactive Calculator**: Customized for assisted living open rooms, monthly resident rates ($4,500/mo), and saved placement fees.
    - **Care Operator Testimonials & Stats Strip**: 35+ Care Facilities Scaled, $1.8M+ Saved Placement Fees, 3-4 Mo Avg Pipeline Maturity, 98% Retention Rate.
    - **Clean Punctuation**: Removed em-dashes (`—`) across all text for cleaner presentation.

### Restore Instructions:
When the user asks to revert or get back to the **"light and dark"** checkpoint, execute:
```bash
git checkout 0a07f39
# OR to reset main branch back to this checkpoint:
git reset --hard 0a07f39
```

