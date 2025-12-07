# Level Up Landing Page - Design Guidelines

## Design Approach
**Reference-Based:** Gaming/social platforms with emphasis on engagement mechanics. Drawing inspiration from Discord's dark theme, Duolingo's gamification, and modern fintech gradients (Stripe, Cash App). The design prioritizes visual excitement and social competition.

## Core Design Principles
1. **High-Energy Gamification:** Bold gradients, vibrant accents, and competitive UI elements
2. **Dark-First Theme:** Deep backgrounds that make colorful elements pop
3. **Social Proof Integration:** Showcase active challenges, user stats, and real-time engagement
4. **Frictionless Conversion:** Clear CTAs with gradient treatments

## Typography

**Font Stack:** System UI fonts (SF Pro Text, system-ui)

**Hierarchy:**
- Hero Title: 40px (desktop) / 32px (mobile), weight 800, tight letter-spacing (0.03em)
- Section Titles: 20px, weight 700
- Card Titles: 14px, weight 600
- Body Text: 13-15px, weight 400
- Meta/Labels: 11-12px, muted color

**Special Treatment:** Gradient text overlay for hero title keywords using the brand gradient

## Layout System

**Spacing Units:** Tailwind utilities focused on 8px base - primarily use p-4, p-5, p-6, m-8, gap-4, gap-8

**Container:** Max-width 1120px, centered with side padding of 16px

**Grid Patterns:**
- Hero: 2-column (1.25fr + 1fr) on desktop, stack on mobile
- Features: 3-column grid on desktop, single column on mobile
- Stats/Meta: Flexible wrap with minimum 120px per item

## Component Library

### Navigation
- Horizontal flex layout with brand left, nav links right
- Pill-style CTA button with gradient background and border
- Links in muted color (#b3b3c2) with hover state to white

### Hero Section
**Layout:** Split design - content left, interactive preview card right

**Components:**
- Eyebrow badge: Small uppercase label with accent border
- Gradient headline with keyword highlights
- Subtitle in muted text (max-width 520px)
- Meta pills: Inline flex badges showing stats (users, challenges, etc.)
- Dual CTA: Primary gradient button + Ghost outline button
- Beta/disclaimer text below CTAs

**Hero Card:** Live preview mockup showing:
- Simulated feed items with challenge cards
- XP badges and stat displays
- Engagement metrics
- Gradient overlay backgrounds
- Multiple nested components to demonstrate platform richness

### Cards & Content Blocks
**Base Card:**
- Background: Dark card color (#101018)
- Border: 1px subtle border (#262633)
- Radius: 18px (large) for main cards, 12-14px for nested elements
- Padding: 14-20px depending on card size
- Shadow: Deep soft shadow (0 12px 30px rgba(0,0,0,0.5))

**Pill Badges:**
- Full rounded corners (999px)
- Used for tags, XP amounts, status indicators
- Subtle backgrounds with accent borders

### Buttons
**Primary:** Gradient background (orange → pink → purple), white text, full rounded, 10px vertical padding
**Ghost:** Transparent with border, backdrop slightly tinted, 9px vertical padding
**Sizing:** 14px font, inline-flex with 8px gap for icons

### Feature Grid
3-column layout (desktop) showcasing:
- Icon or label at top
- Clear title
- Descriptive text in muted color
- Consistent card treatment

### Statistics Display
Flex row of stat cards with:
- Label above value
- Compact 11px font
- Dark nested background
- Minimum width enforcement (120px)

## Color Palette

**Backgrounds:**
- Primary: #050509 (near-black)
- Card: #101018 (dark purple-tinted)
- Radial gradient overlay: #15152b → #050509

**Accents:**
- Primary Orange: #ff7a3c
- Pink: #ff3c7d  
- Purple: #6c5ce7
- Cyan: #00d4ff
- Yellow: #ffe66e

**Text:**
- Primary: #f5f5f7 (off-white)
- Muted: #b3b3c2 (gray)

**Gradients:**
- Brand: Linear 110deg from yellow → orange → pink → purple
- Buttons: 120deg from orange → pink → purple
- Card overlays: Radial gradients with accent colors at low opacity (0.14-0.32)

## Images

**Hero Section:** NO large hero image - uses interactive preview card instead showing the app interface

**Optional Enhancement Images:**
- User avatars in testimonial/stat areas (small, circular)
- Challenge category icons (fitness, learning, creativity)
- Achievement badges/trophies as decorative elements

**Image Treatment:** If used, apply subtle borders and integrate with dark theme, avoid full-bleed photos

## Sections Architecture

1. **Header:** Navigation with brand identity
2. **Hero:** Two-column split with content + preview card
3. **Features Grid:** 3-column showcase of core mechanics (challenges, voting, rewards)
4. **How It Works:** Two-column or list-based flow explanation
5. **Community Stats:** Flex row of key metrics in card format
6. **Categories/Challenges:** Grid of challenge types with chips
7. **Footer:** Links, social, legal - compact single row on desktop

## Responsive Behavior
- Desktop: Full multi-column layouts, 1120px max container
- Tablet (≤840px): Hero stacks, navigation wraps, 2-column grids reduce to 1
- Mobile: All single column, reduced spacing, flexible text sizing

## Animations & Interactions
**Minimal approach** - focus on:
- Smooth hover states on cards (subtle brightness increase)
- Button hover with slight transform
- Link color transitions
- NO complex scroll animations or page transitions