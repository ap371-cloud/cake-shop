---
name: Artisan Editorial Patisserie
colors:
  surface: '#fff8f6'
  surface-dim: '#ecd5cd'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#ffe9e2'
  surface-container-high: '#fbe3db'
  surface-container-highest: '#f5ded6'
  on-surface: '#251914'
  on-surface-variant: '#53433f'
  inverse-surface: '#3b2d28'
  inverse-on-surface: '#ffede7'
  outline: '#85736e'
  outline-variant: '#d8c2bc'
  surface-tint: '#8b4e3c'
  primary: '#532213'
  on-primary: '#ffffff'
  primary-container: '#6f3827'
  on-primary-container: '#f0a38c'
  inverse-primary: '#ffb59f'
  secondary: '#78592a'
  on-secondary: '#ffffff'
  secondary-container: '#fed399'
  on-secondary-container: '#785a2a'
  tertiary: '#3a2f26'
  on-tertiary: '#ffffff'
  tertiary-container: '#51453c'
  on-tertiary-container: '#c4b3a7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59f'
  on-primary-fixed: '#370d02'
  on-primary-fixed-variant: '#6e3726'
  secondary-fixed: '#ffddb1'
  secondary-fixed-dim: '#e9c087'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#5d4214'
  tertiary-fixed: '#f2dfd2'
  tertiary-fixed-dim: '#d5c3b7'
  on-tertiary-fixed: '#231a12'
  on-tertiary-fixed-variant: '#51443b'
  background: '#fff8f6'
  on-background: '#251914'
  surface-variant: '#f5ded6'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 34px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Playfair Display
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
  price-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  price-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the sensory warmth of a luxury French-inspired patisserie merged with the tactile elegance of a high-end food quarterly. It creates an atmosphere of unhurried indulgence, artisanal craft, and culinary precision. The UI feels sunlit, fragrant, and grounded—prioritizing mouth-watering macro photography, generous negative space, and refined typographic contrast.

The aesthetic marries **warm editorial minimalism** with **tactile warmth**:
- **Editorial Poise:** High-contrast serif headlines paired with methodical, modern metadata evoke boutique menus and luxury cookbooks.
- **Sensory Warmth:** Butter-soft creams, velvety chocolate undertones, and toasted beige framing abandon sterile tech tropes in favor of an organic, bakery-counter warmth.
- **Micro-Delight:** Understated gold accents provide quiet luxury, reserved exclusively for badges of craft, special finishes, and checkout micro-moments.

## Colors

The palette is rooted in the elemental ingredients of pastry: roasted cocoa, churned butter, browned sugar, and unbleached parchment. Pure stark white and harsh digital grays are strictly avoided across all foundational surfaces.

### Surface Architecture
- **Base Canvas:** `#FFF9F1` (Warm Cream). The foundational background for the entire application, simulating heavy unbleached cotton paper.
- **Elevated Surfaces & Cards:** `#FFFFFF` (Pure White). Used for product tiles, bottom sheets, and interactive dialogue surfaces to lift them gently from the cream canvas.
- **Tonal Dividers & Soft Fills:** `#F1E4D5` (Soft Beige). Used for subtle hairline borders, segmented control tracks, and table rules.
- **Tonal Accents & Highlight Tints:** `#F8E5D8` (Light Peach). Applied behind active selection states, celebratory callouts, and dietary pill backgrounds.

### Typography & Content
- **Primary Text:** `#30231E` (Espresso Black). Deep roasted tone providing rich legibility while softening the stark contrast of jet black.
- **Secondary / Supporting Text:** `#78685F` (Toasted Taupe). Calibrated for ingredient breakdowns, metadata, and dietary labels.
- **Deep Accent:** `#42251D` (Dark Truffle). Used for hover states on primary actions and heavy mastheads.

### Accents & Semantic Signals
- **Artisan Accent:** `#C6A06A` (Muted Gold). Reserved for chef's picks, signature collections, rating stars, and gilded micro-borders.
- **Dietary Affirmative (Eggless / Pure Veg):** `#3D7954` (Sage Basil Green). Used on verified food safety markers and positive status chips.
- **Dietary Indicator (Contains Egg):** `#6F3827` (Cocoa Brown). Framed inside traditional square glyphs.
- **Semantic Alert:** `#B83D35` (Wild Berry Red). Crisp, organic crimson for validation errors, out-of-stock states, and urgent alerts.

## Typography

The typography establishes an intentional tension between editorial romance and operational clarity.

- **Editorial Headings (`Playfair Display`):** Reserved for product names, section mastheads, promotional storytelling, and celebratory empty states. Employs tighter line heights and slight negative tracking on large scales to preserve visual density.
- **Operational Copy & Metadata (`Inter`):** Drives descriptions, ingredient matrices, customization controls, button text, and timestamps. Its neutral geometry balances the ornate character of the display font.
- **Financial & Quantity Data (`Inter` with tabular figures):** Price tags, weight indicators, calorie counts, and currency glyphs (₹) utilize `Inter` in semi-bold and bold weights with tabular numeral settings (`font-variant-numeric: tabular-nums`) to guarantee alignment across order summaries.

## Layout & Spacing

The layout is built upon an 8-point base spatial rhythm designed to produce an open, magazine-like canvas that gives bakery photography ample room to breathe.

### Grid Systems
- **Desktop (≥ 1024px):** 12-column fluid grid. Max content width of `1280px` centered. Outer margins set to `margin` (`3rem`), column gutters to `gutter` (`1.5rem`). Product grids arrange strictly in 3 or 4 columns.
- **Tablet (768px – 1023px):** 8-column grid with `2rem` outer margins and `1.25rem` gutters. Product grids collapse gracefully to 2 columns.
- **Mobile (< 768px):** 4-column layout with `margin-mobile` (`1.25rem`) gutters and safe areas. Horizontal snap carousels bleed past screen margins by utilizing negative margin balancing with internal edge padding.

### Sectional Rhythm
- Sections are bounded by expansive vertical breathing room (`space-xl` to `4rem`), preventing visual clutter.
- Related controls and atomic pairings adhere to tight relationships (`space-xs` and `space-sm`), while content chunks within cards utilize `space-md`.

## Elevation & Depth

Visual depth avoids cool, synthetic dropshadows. Instead, elevation mirrors soft, diffused natural light cast across a bakery marble counter.

### Ambient Shadow Hierarchy
- **Level 0 (Flat / Recessed):** No shadow. Framed with delicate 1px borders in `#F1E4D5` over `#FFF9F1`. Applied to input wrappers, inactive filter chips, and step track backdrops.
- **Level 1 (Card Resting):** Surface `#FFFFFF`. Shadow: `0px 4px 16px -2px rgba(66, 37, 29, 0.05), 0px 1px 4px 0px rgba(66, 37, 29, 0.03)`. Perimeter border: `1px solid #F1E4D5`. Applied to catalog pastry tiles and cart item blocks.
- **Level 2 (Interactive Floating / Hover):** Surface `#FFFFFF`. Shadow: `0px 12px 28px -4px rgba(66, 37, 29, 0.09), 0px 4px 10px -1px rgba(66, 37, 29, 0.04)`. Applied to hover states, sticky bag banners, and dropdown menus.
- **Level 3 (Modal & Sheet Overlay):** Surface `#FFFFFF`. Shadow: `0px 24px 48px -8px rgba(66, 37, 29, 0.16)`. Applied to customization drawers, dietary detail popups, and cake delivery scheduling modals.
- **Scrim Backdrop:** `rgba(48, 35, 30, 0.45)` with a `4px` blur filter for ambient focus shifts.

## Shapes

The shape system employs generous roundedness (`roundedness: 2`), reflecting the organic contours of proving loaves, smooth ganache, and rounded cake molds.

- **Base Radius (8px / `0.5rem`):** Small elements, image thumbnails, quantity steppers, dietary indicators, input fields.
- **Medium Radius (12px / `0.75rem`):** Interactive cards, order summary blocks, bottom sheet top perimeters.
- **Large Radius (16px / `1rem`):** Primary hero cards, curation showcases, delivery tracker modules.
- **Full Pill (`9999px`):** Customization pills, status chips, CTA buttons, and floating navigation bars.

## Components

### Buttons & CTAs
- **Primary Action:** Solid `#6F3827` background, `#FFFFFF` text, pill-shaped (`9999px`), `14px` bold tracking. Resting state has no shadow; active state shifts to `#42251D`. Minimum touch height `48px`.
- **Secondary Action:** Transparent background with `1.5px` border in `#6F3827`, text `#6F3827`. Hover fills with `#F8E5D8`.
- **Artisan / Gold Action:** `#C6A06A` fill, `#30231E` text. Used exclusively for bespoke custom cake consultations or premier memberships.

### Product & Bakery Cards
- Built on `#FFFFFF` with Level 1 warm shadow and `1px` `#F1E4D5` border.
- **Media Container:** Fixed 1:1 or 4:5 aspect ratio with subtle zoom on hover (`scale(1.03)` over `400ms ease-out`).
- **Dietary Marker Placement:** Absolute positioned at top-left of image: `8px` offset. A crisp square (`16x16px`) with a `1px` border housing a centered `6px` solid circle (Sage Green for Eggless, Cocoa Brown for Contains Egg).
- **Price & Add Button:** Price set in `Inter 16px Semibold` alongside an organic "+ Add" pill button that animates into a `- 1 +` stepper upon selection.

### Customization Pills & Chips
- **Dietary / Filter Pills:** Pill-shaped with `8px 16px` padding. Unselected: `#FFF9F1` fill, `#78685F` text, `1px solid #F1E4D5`. Selected: `#6F3827` fill, `#FFFFFF` text, border `#6F3827`.
- **Tier & Flavor Selection Chips:** Modular selection tiles featuring flavor name, swatch/icon, and price increment (`+ ₹150`). Features a subtle scale transition and a `2px` gold ring (`#C6A06A`) on active state.

### Input Fields & Steppers
- **Text Inputs:** Height `48px`, background `#FFFFFF`, border `1px solid #F1E4D5`, radius `8px`. Active focus state changes border to `#6F3827` with a soft `0 0 0 3px rgba(111, 56, 39, 0.12)` halo. Floating label transitions smoothly in `#78685F`.
- **Quantity Steppers:** Pill-shaped capsule (`#F8E5D8`) containing brown icon triggers (`#6F3827`) and tabular center numerals.

### Timeline & Order Step Trackers
- Vertical and horizontal paths linked via `2px` dotted lines in `#F1E4D5`. Completed segments transition to solid `#6F3827`.
- Nodes render as `24px` circles: past steps display a check icon in `#6F3827`; the active step pulses with an outer ring in `#F8E5D8` enclosing a `#6F3827` center; future steps display a hollow ring in `#F1E4D5`.

### Navigation Architecture
- **Sticky Navigation:** Floating glass bar at top or bottom anchored with `rgba(255, 249, 241, 0.88)` background blur (`12px`). Houses brand wordmark in `Playfair Display`, curated taxonomy links, and a gold-accented pastry bag drawer trigger displaying total count and live total price.