# Design System — HirePulse (corrected, from live product screenshots)

> This replaces the earlier placeholder DESIGN.md, which used generic
> indigo colors that don't match the real product. The values below are
> read visually off the actual screenshots. Hex codes are best-visual-
> estimates, not pixel-sampled — confirm exact values against your
> Tailwind config / globals.css and correct anything below if it's off.

## Overall Style
Clean, professional SaaS look. White / off-white background, a single
strong lime-green accent, black as the secondary/contrast color, and a
deep teal-green used for a small number of "premium" surfaces (the job
listing card, the interview video panel). Deliberately NOT a generic
"AI startup" look — no gradients, no glassmorphism, no bento grids, no
glowing orbs.

## Colors (verify exact hex in code)
- **Primary / brand green** — buttons ("Get Started", "Continue as
  Student", "Start Mock Interview"), active sidebar item, logo badge,
  badge pill: warm lime-olive green, approx `#8BC53F`
- **Secondary — black** — "Watch Demo" button, nav "Get Started"
  button, floating identity pill badges: near-black, approx `#0F0F0F`
- **Accent — deep teal-green** — job-listing floating card background,
  AI Mock Interview video panel background: approx `#0F2E22`
- **Background** — white `#FFFFFF`, and light gray `#F7F8FA` for
  dashboard/section backgrounds
- **Card surface** — white, soft shadow, rounded corners
- **Text primary** — near-black, approx `#111111`
- **Text secondary / muted** — mid gray, approx `#6B7280`
- **Status colors** — vary per metric, not one fixed "success" color:
  e.g. "Speech: Clear and steady" and "Posture: Straight posture" read
  green, "Eye Contact: Good eye contact" reads blue. Don't collapse
  these into a single status-green token — check the actual logic in
  code for how status color is chosen.
- **Alert / config-error banner** — soft red/pink background
  (approx `#FEE2E2`) with bold red text (approx `#B91C1C`), used for
  the "AI service not configured" message

## Typography
- Headings: bold, rounded geometric sans, large in the hero
  (~56–64px). Check the real `font-family` in the CSS before assuming
  it's Inter/Geist/Space Grotesk — it reads like a rounder, friendlier
  face than those defaults.
- Body / nav text: same family, regular/medium weight, gray for
  secondary copy.
- Dashboard stat numbers: large, bold, black (e.g. "82%", "5", "74%",
  "3").

## Buttons
- **Primary pill**: green background, black text, fully rounded,
  optional icon (arrow, rocket) — "Get Started", "Continue as
  Student", "Start Mock Interview"
- **Secondary pill**: black background, white text, fully rounded,
  optional icon (play) — "Watch Demo", nav "Get Started"
- **Circular icon buttons** (video call controls): dark/gray
  background, red icon = off/blocked, green icon = active

## Cards
- **Standard card**: white, rounded-2xl (~16–20px radius), soft drop
  shadow, ~24px padding
- **Feature card** (grid): white, icon in a small rounded icon-box
  (light gray/green tint), bold black title, gray description —
  currently laid out 4-across on desktop
- **Stat card** (dashboard): white, icon in a light rounded box, small
  gray uppercase label, large bold number
- **Premium/highlight card** (job posting, floating badges): deep
  teal-green background, white/light text, pill tags in a lighter tint
- **Floating identity card** (hero social-proof): white, rounded,
  avatar circle with initials, bold name, gray role/status line, small
  shadow, positioned absolutely over the hero

## Badges / Pills
- Light-green pill + sparkle icon for the hero category label
  ("AI-Powered Interview Coach")
- Black pill with avatar + name + role for floating social-proof
  ("Robert Williamson · Head of HRD")
- Green "Live" status pill
- Green "Ready" status pill on the AI interviewer card

## Iconography
- Simple line icons inside a muted rounded icon-box — not flat color
  illustrations, not an overload of sparkle/emoji icons

## Layout Patterns
- **Hero**: centered headline + subtext, two CTAs side by side,
  floating testimonial/job cards positioned around the hero, logo
  strip below ("You could be the next one in..")
- **Features**: centered heading (black text + one green highlighted
  word) + subtext, then a card grid
- **Auth / role select**: single option card (Student) with icon,
  checklist and green CTA — HR option removed from the product
- **Dashboard**: left sidebar nav (green highlight on the active item)
  + stat-card row + one large dark "AI Interview" feature card +
  secondary white cards (Calendar, Todo, Course Recommendations)
- **AI Mock Interview**: two-panel layout — dark video panel (left),
  white "AI Interviewer" status + conversation panel (right) — with a
  system alert banner above when a required service isn't configured

## What Must Stay Exactly As-Is
- The four-color system: lime-green, black, white/off-white, deep
  teal-green — no new brand colors
- Pill-shaped buttons throughout
- Rounded-card-with-soft-shadow visual language
- Current icon style (simple line icons in a muted box)

### Remember
DESIGN.md = HOW IT SHOULD LOOK AND FEEL — this file describes the
*existing* product. It is a constraint for future work, not a starting
point for a redesign.
