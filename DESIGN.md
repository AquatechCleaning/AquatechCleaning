# UI Design System

## Principles
- Preserve all existing product logic and flows.
- Use an 8pt spacing rhythm.
- Favor clean surfaces, subtle borders, and soft depth.
- Keep interactions fast and unobtrusive.

## Tokens
- Background: `#f8fafc`
- Foreground: `#0f172a`
- Surface: `#ffffff`
- Border: `#d2d5c6`
- Primary: `#055178`
- Navy: `#02203d`
- Accent: `#f0a935`

## Radius
- Small: `8px`
- Medium: `12px`
- Large: `16px`

## Shadows
- Soft: `0 4px 18px rgba(2, 32, 61, 0.06)`
- Medium: `0 10px 30px rgba(2, 32, 61, 0.1)`

## Typography
- Kicker: uppercase, compact tracking, primary color
- Title: bold, navy, responsive scale
- Body: slate tones, comfortable line-height

## Reusable Classes
- Layout: `.ui-shell`, `.ui-container`, `.ui-page`
- Content: `.ui-kicker`, `.ui-title`, `.ui-subtitle`
- Surfaces: `.ui-card`, `.ui-card-hover`
- Form: `.ui-input`
- Actions: `.ui-btn`, `.ui-btn-primary`, `.ui-btn-secondary`
- Data tables: `.ui-table`

## Interaction Rules
- All controls keep visible focus outlines.
- Buttons and links use subtle hover/press transitions.
- Card hover elevation only where it improves scanability.
- No decorative heavy gradients or neon styles.

## Usage Guidance
- Use `.ui-card` for form sections, summaries, admin blocks.
- Use `.ui-input` for all form fields to keep density consistent.
- Use `.ui-btn-primary` for conversion CTA, `.ui-btn-secondary` for utility actions.
- Use `.ui-table` with compact headers and hover row feedback for admin data.
