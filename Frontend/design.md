# Frontend Design Specification: "Neon Ember" (Dark Mode Glassmorphism)

## 1. Design Philosophy & "Vibe"

This design language merges high-end fintech aesthetics with cyberpunk/AI neon sensibilities. The core vibe is "Liquid Glass over Neon Fire." It relies on extreme contrast: pitch-black backgrounds pierced by intense, layered reddish-orange glows, encapsulated within frosted glassmorphic containers.

**Key Principles:**

- **Depth through Illumination:** Elements aren't separated by standard borders, but by light emitting from behind or within them.
- **Controlled Intensity:** Glows are vibrant but not blinding; they use layered opacity to simulate real light diffusion.
- **Premium Restraint:** The background remains void-like (deep blacks) to allow the neon colors to command attention without overwhelming the user.

## 2. Color Palette (Red/Orange/Black Theme)

### Backgrounds (The Void)

- **Base Background:** `#050505` (Almost pitch black, essential for high contrast).
- **Surface Level 1 (Cards):** `rgba(20, 20, 20, 0.4)` (Translucent dark charcoal).
- **Surface Level 2 (Hover/Active):** `rgba(35, 30, 30, 0.6)`.

### Accents (The Fire)

- **Primary Neon (Red):** `#FF1E1E` (Used for critical actions, core glows, and active states).
- **Secondary Neon (Orange):** `#FF6B00` (Used for gradients, secondary highlights, and warming up the red).
- **Deep Crimson (Shadows):** `#8B0000` (Used for the outermost, diffused glow layers).

### Typography (The Data)

- **Primary Text:** `#FFFFFF` (Pure white for maximum readability on dark surfaces).
- **Secondary Text:** `#A1A1AA` (Cool gray for descriptions and metadata).
- **Accent Text:** Linear gradient from `#FF6B00` to `#FF1E1E` (For key metrics or hero headings).

## 3. Typography

- **Font Family:** `Inter`, `Geist`, or `SF Pro Display`. Sans-serif, highly legible, modern.
- **Weights:** - Headings: `600` (Semi-bold) or `700` (Bold) with tight tracking (`-0.02em`).
  - Body: `400` (Regular).
  - Metrics/Numbers: `500` (Medium) with tabular numerals.

## 4. Core Visual Effects (The "Secret Sauce")

### A. The "Liquid Glass" Effect (Glassmorphism)

Every card or container should utilize a combination of background blur, translucent background color, and a subtle inner border to simulate a glass edge catching the light.

- **Backdrop Blur:** `backdrop-filter: blur(16px);`
- **Background:** `background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);`
- **Glass Edge (Border):** `border: 1px solid rgba(255, 255, 255, 0.08);`
- **Inner Highlight (Inset Shadow):** `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);`

### B. The "Neon Ember" Glow (Layered Shadows)

Single drop shadows look cheap. To get the professional look from the references, use multi-layered box shadows with varying blur radii and opacities.

- **CSS Example for a Primary Button/Card:**
  `box-shadow: 0 0 10px rgba(255, 30, 30, 0.4), 0 0 40px rgba(255, 30, 30, 0.2), 0 0 80px rgba(255, 107, 0, 0.1);`

### C. Edge Illumination (Directional Glows)

Many reference images show cards glowing heavily from one specific edge (e.g., the bottom).

- **Implementation:** Use a radial gradient positioned absolutely at the bottom of the card, or a heavy directional box-shadow.
- **CSS Trick:** `box-shadow: 0px 30px 60px -20px rgba(255, 30, 30, 0.5);` (The negative spread `-20px` keeps the glow strictly focused at the bottom).

### D. Flow/Connection Lines (If building node-based UI)

- Use SVG paths with stroke.
- Apply CSS `filter: drop-shadow(0 0 8px rgba(255, 30, 30, 0.8));` to the SVG path to make the line glow like a neon tube.

## 5. UI Component Specifications

### 1. Hero/Feature Cards

- Dark glass background (`rgba(10,10,10, 0.5)`).
- Distinct bottom-edge neon red glow.
- Subtle inner top-edge white highlight.
- Smooth border radius (`16px` to `24px`).

### 2. Primary Buttons

- Solid or dense gradient background (`linear-gradient(to right, #FF1E1E, #FF6B00)`).
- Intense surrounding glow (layered box-shadow).
- Text: White, bold.
- **Hover State:** Increase scale by `1.05`, intensify the outer blur radius of the shadow.

### 3. Secondary/Ghost Buttons

- Transparent background.
- Border: `1px solid rgba(255, 30, 30, 0.5)`.
- Text: `#FF1E1E`.
- Subtle internal glow.

### 4. Background Accents

- Do not leave the deep background completely empty. Use massive, highly-diffused radial gradients placed off-center to create a smoky, ambient light environment.
- Example: A massive `800px` radial gradient, `10%` opacity red, centered at the top right of the viewport.

## 6. Development Prompting Tips (For AI/Claude/Cursor)

When asking an AI to code this, use this exact phrasing:

> "Build a UI using Tailwind CSS. The theme is 'Neon Ember Glassmorphism'. The background is `#050505`. All cards must use `backdrop-blur-xl`, a `bg-white/5` background, and a `border-white/10` border. Use custom arbitrary values for multi-layered box shadows to create intense `#FF1E1E` (red) to `#FF6B00` (orange) neon glows. Do not use flat colors for primary elements; use directional gradients and heavy drop-shadows. Ensure high contrast white text for primary data."
