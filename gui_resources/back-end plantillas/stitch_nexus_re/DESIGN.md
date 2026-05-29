---
name: Luminous Estate CRM
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#b7c8e1'
  on-secondary: '#213145'
  secondary-container: '#3a4a5f'
  on-secondary-container: '#a9bad3'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  data-table:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
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
  container-padding: 2rem
  gutter: 1.5rem
  card-gap: 1rem
  section-margin: 3rem
  sidebar-width: 280px
---

## Brand & Style

The design system is engineered for high-performance real estate professionals who require a sophisticated, data-rich environment that doesn't sacrifice aesthetic clarity. The brand personality is **Elite, Transparent, and Fluid**. 

The visual direction follows a refined **Glassmorphism** style. It leverages high-quality translucency to create a sense of depth and modernism, suggesting a "look through the data" philosophy. By combining frosted glass panels with a crisp, professional color palette, the system transforms standard CRM functionality into a premium workspace experience. It balances the high-contrast needs of a back-end tool with the ethereal beauty of modern architectural visualization.

## Colors

This design system utilizes a **sophisticated dark mode** as its default state to reduce eye strain during prolonged data management tasks. 

- **Primary Blue:** A vibrant, professional blue used for primary actions and highlights.
- **Surface Neutrals:** A deep slate palette ranging from `#0F172A` for backgrounds to semi-transparent whites for glass overlays.
- **Functional Accents:** High-chroma Emerald (Active), Amber (Pending), and Rose (Sold) ensure critical property statuses are immediately identifiable within dense tables.
- **Glass Tinting:** Borders on glass components use a subtle linear gradient of `white/10%` to `white/5%` to simulate light catching on the edge of a pane.

## Typography

The typography system prioritizes legibility within complex dashboard structures. 

**Plus Jakarta Sans** provides a modern, slightly rounded geometric feel that softens the technical nature of a CRM. For technical metadata and property IDs, **JetBrains Mono** is used in small caps to differentiate system-generated data from user content.

On mobile devices, `display-lg` should scale down to `32px` to maintain visual hierarchy without breaking container boundaries. All data tables should strictly use the `data-table` role to maximize information density while maintaining a comfortable vertical rhythm.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for the main content area, anchored by a fixed-width glass sidebar.

- **Dashboard Rhythm:** Content is organized into modular "Glass Tiles." 
- **Breakpoints:**
  - **Desktop (1280px+):** Sidebar is expanded; 3-column widget layout.
  - **Tablet (768px - 1279px):** Sidebar collapses to icons; 2-column widget layout; gutters reduce to 1rem.
  - **Mobile (<767px):** Single column stack; sidebar becomes a bottom navigation bar or hamburger menu.
- **Information Density:** Spacing is tighter than a consumer-facing app to allow for "at-a-glance" monitoring of multiple listings.

## Elevation & Depth

Depth is communicated through **Background Blurs (Backdrop-filter)** rather than traditional drop shadows.

- **Level 1 (Base):** Deep Slate background with a subtle radial gradient.
- **Level 2 (Panels):** White at 5% opacity, backdrop-blur of 12px. Used for main content areas and cards.
- **Level 3 (Modals/Popovers):** White at 10% opacity, backdrop-blur of 20px. Includes a 1px solid white/20% border to "lift" the element.
- **Interactive States:** When hovering over a glass card, the opacity increases by 3% and the backdrop-blur increases, creating a "focusing" effect on the content underneath.

## Shapes

The shape language is consistently **Rounded**, reflecting the premium and friendly nature of modern architecture. 

Standard components (Cards, Inputs) use a `0.5rem` radius. Larger layout containers (Main Dashboard Area) use `1.5rem` to create a soft "frame" for the content. Status badges and action buttons use a fully rounded "pill" shape to distinguish them from structural data containers.

## Components

### Data Tables
Tables are the heart of the CRM. Use transparent rows with a 1px bottom border (`white/5%`). The header row should have a slightly higher opacity (10%) to anchor the columns.

### Status Badges
Badges use a subtle glass fill tinted with the status color (e.g., Active uses `10B981` at 15% opacity) with high-contrast text and a solid 2px left-border indicator.

### Action Buttons
- **Primary:** Solid blue with a soft white inner glow at the top edge.
- **Secondary:** Glass-textured with a white/20% border. Text is white.

### Glass Inputs
Inputs are translucent fields with a `backdrop-filter: blur(4px)`. On focus, the border color transitions to the primary professional blue with a faint outer glow.

### Sidebar Navigation
The sidebar should use a vertical stack of icons and labels. Active states are indicated by a "glass pill" background highlight and a primary color vertical bar on the leading edge.