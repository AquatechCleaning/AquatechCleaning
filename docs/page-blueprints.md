# Page Blueprints (Template-Locked)

These are the approved UI blueprints for all new routes. Pages must be composed from template primitives/sections and must not invent one-off styling.

## 1) Marketing Landing
- Shell: `TemplateShell`
- Structure: `HeroA` -> `StatsA` -> `FeatureGridA` -> `TestimonialsA` -> `CTA_A`
- Primitives: `Container`, `Section`, `Button`, `Badge`

## 2) Services Listing
- Shell: `TemplateShell`
- Structure: `PageHeader` -> `FeatureGridA` -> `ProcessTimelineA` -> `CTA_A`
- Primitives: `Card`, `Button`, `Badge`

## 3) Quote / Appointment Form
- Shell: `TemplateShell`
- Structure: `PageHeader` -> appointment-style `Section` + `Card` blocks
- Primitives: `Input`, `Select`, `Textarea`, `Button`, `Badge`
- Keep all form logic/API flow unchanged.

## 4) Contact Page
- Shell: `TemplateShell`
- Structure: `PageHeader` -> two-column `Card` layout (form + contact details) -> `CTA_A`
- Primitives: `Input`, `Textarea`, `Button`, `Card`

## 5) Gallery / Portfolio
- Shell: `TemplateShell`
- Structure: `PageHeader` -> grid cards -> modal/lightbox area
- Primitives: `Container`, `Section`, `Card`, `Badge`

## 6) Content Detail (Blog/Case Study)
- Shell: `TemplateShell`
- Structure: `PageHeader` -> content column + sidebar `Card` -> `CTA_A`
- Primitives: `Container`, `Section`, `Badge`, `Button`

## 7) FAQ Page
- Shell: `TemplateShell`
- Structure: `PageHeader` -> `FAQA` -> `CTA_A`
- Primitives: `Section`, `Button`

## 8) Dashboard / Admin-like Surface
- Shell: route-specific (admin layout can bypass TemplateShell)
- Structure: top heading + card grid + data tables
- Primitives: `Card`, `Badge`, `Button`
- Maintain existing admin/business flows.

## 9) Settings Page
- Shell: route-specific (or `TemplateShell` for public settings)
- Structure: `PageHeader` -> stacked `Card` forms
- Primitives: `Input`, `Select`, `Textarea`, `Button`

## 10) Legal / Policy Page
- Shell: `TemplateShell`
- Structure: `PageHeader` -> long-form `Card` content
- Primitives: `Container`, `Card`, `Badge`

