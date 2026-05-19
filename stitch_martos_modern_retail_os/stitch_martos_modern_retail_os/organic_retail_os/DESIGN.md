---
name: Organic Retail OS
colors:
  surface: '#fff8f4'
  surface-dim: '#e8d7c5'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1e4'
  surface-container: '#fdebd8'
  surface-container-high: '#f7e5d3'
  surface-container-highest: '#f1e0cd'
  on-surface: '#231a0f'
  on-surface-variant: '#45483c'
  inverse-surface: '#392f22'
  inverse-on-surface: '#ffeedd'
  outline: '#75796b'
  outline-variant: '#c5c8b8'
  surface-tint: '#50652a'
  primary: '#3e5219'
  on-primary: '#ffffff'
  primary-container: '#556b2f'
  on-primary-container: '#d0eba1'
  inverse-primary: '#b6d088'
  secondary: '#566342'
  on-secondary: '#ffffff'
  secondary-container: '#d7e5bb'
  on-secondary-container: '#5a6745'
  tertiary: '#6b4323'
  on-tertiary: '#ffffff'
  tertiary-container: '#865a38'
  on-tertiary-container: '#ffdac2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2eca2'
  primary-fixed-dim: '#b6d088'
  on-primary-fixed: '#131f00'
  on-primary-fixed-variant: '#394d14'
  secondary-fixed: '#dae8be'
  secondary-fixed-dim: '#becca3'
  on-secondary-fixed: '#141f05'
  on-secondary-fixed-variant: '#3f4b2c'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#f4bb92'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#653d1e'
  background: '#fff8f4'
  on-background: '#231a0f'
  surface-variant: '#f1e0cd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  bento-gap: 24px
---

## Brand & Style

The design system for this retail operating system balances the precision of cloud-native infrastructure with the organic, warm aesthetic of modern Indian FMCG brands. It targets retailers and warehouse managers who value a "store-first" experience—where the software feels as premium and well-crafted as the artisanal products on the shelves.

The visual language is **Modern Corporate with a Tactile Edge**. It draws heavily from minimalism and contemporary "Apple-level" spaciousness, using generous whitespace and a "Bento-box" structural logic to organize complex retail data into digestible, beautiful modules. The emotional response should be one of calm efficiency, reliability, and warmth, moving away from cold, industrial SaaS aesthetics toward a sophisticated, earth-toned environment.

## Colors

The palette is rooted in an "Organic-Store" aesthetic, utilizing earthy tones to ground the digital interface.

- **Primary Olive (#556B2F):** Used for key actions, brand moments, and primary navigational states. It conveys growth and stability.
- **Secondary Sage (#A3B18A):** Used for subtle backgrounds, secondary badges, and success states.
- **Tertiary Earth Brown (#8B5E3C):** Used for accents, specialized alerts, or to signify natural/artisanal product categories.
- **Warm Cream & Beige (#F8F5F0 / #E6D5C3):** These form the foundation of the interface, replacing harsh whites with a softer, premium paper-like texture.
- **Functional Accents:** Pure White is reserved for high-priority cards and interactive inputs to ensure they "pop" against the warm background.

## Typography

The system utilizes a dual-font approach. **Plus Jakarta Sans** (a modern alternative to Poppins with better screen optimization) is used for headings to provide a friendly yet geometric character. **Inter** is utilized for all body copy and UI labels to ensure maximum legibility for data-heavy retail tasks like inventory management and order processing.

Headlines should use a "tight" letter spacing and optical kerning to maintain a premium editorial feel. Labels and small data points should use slightly increased letter spacing and a semi-bold weight for clarity in fast-paced retail environments.

## Layout & Spacing

This design system follows a **Fixed-Fluid Hybrid Grid**. Content is centered within a 1440px container on desktop with 64px outer margins to create a sense of exclusivity and focus. 

The layout relies on a **Bento Grid** philosophy:
- **Modular Blocks:** Information is grouped into distinct, rounded containers.
- **Rhythm:** An 8px base unit drives all padding and margins. 
- **Spaciousness:** Large gaps (24px) between modules prevent the density common in older retail software, reducing cognitive load.
- **Responsive Behavior:** On mobile, the grid collapses to a single column, with margins tightening to 20px and padding inside cards reducing to 16px to maximize screen real estate.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows** rather than heavy borders.

- **The Base:** The lowest level is the Warm Cream (#F8F5F0) background.
- **Surface Level:** Content sits on White (#FFFFFF) cards.
- **Shadow Profile:** Cards utilize a very soft, multi-layered shadow (e.g., `0px 4px 20px rgba(85, 107, 47, 0.05)`). The shadow is tinted with a hint of the Primary Olive to maintain the organic warmth.
- **Interaction:** Upon hover, cards should lift slightly using a more pronounced, diffused shadow, suggesting a tactile, physical interaction.

## Shapes

The shape language is defined by large, generous radii that echo organic product packaging. 

- **Primary Cards:** 24px corner radius.
- **Secondary Modules/Buttons:** 16px corner radius.
- **Pills/Chips:** Fully rounded (50vh) to contrast against the more structured rectangular cards.
- **Inputs:** 12px corner radius to balance utility with the overall soft aesthetic.

## Components

### Buttons
Buttons are soft and substantial. Primary buttons use the Olive Green with white text; secondary buttons use the Beige background with Earth Brown text. Avoid 1px borders; use subtle tonal shifts for hover states.

### Pill Category Filters
Used for rapid sorting (e.g., "In Stock", "High Demand"). These are fully rounded. Active states should be high-contrast (Olive/White), while inactive states should use the Soft Sage background with a 10% opacity.

### Bento Grid Sections
A collection of cards of varying sizes (1x1, 2x1, 2x2) that snap together. Use these for dashboards and product showcases. Every card must have a consistent 24px padding.

### Modern Tables
Retail data is presented in "borderless" tables. Use subtle horizontal dividers in Soft Sage (#A3B18A at 20% opacity). The header row should be in the Beige tone with Inter Bold labels.

### Product/Inventory Cards
Large-format cards that prioritize high-quality imagery. The bottom 30% of the card is reserved for a clean, white metadata area containing the item name, SKU, and a "soft-rounded" action button.

### Input Fields
Inputs are grounded in the Beige tone with a focus state that adds a 2px Olive Green inner stroke. Labels always sit above the field in Inter Semi-Bold.