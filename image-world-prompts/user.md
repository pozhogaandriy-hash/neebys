# Context

## Operation

generate

## User Requirements

Build a new website direction for Gymfriends, an online gym clothing brand. Replace the previous informational brand-site feel completely. Make it feel much more like a premium online shop and product-led catalog for gymwear, still in a dark aggressive sport style inspired by top-tier brands like Nike or Adidas. The target audience is unisex. Primary product category to feature first: футболки. The homepage must feel like a real shop homepage with strong product focus: featured collections, product switcher tabs, new drops, best sellers, product cards, clear pricing presentation, size-selection cues, strong add-to-inquiry / leave-request CTAs, and catalog-first navigation. The main visitor goal is: знайти потріюну колекцію та придбати сподобавшийся товар. The primary conversion action should be: Залишити заявку. The site should function as a premium catalog/contact-led store, not a full checkout ecommerce flow. Required pages: Головна, Каталог, Контакти, Доставка й оплата. Include максимально круті переходи між сторінками. Design direction for this version: bold dark ecommerce flagship, immersive storefront hero, large product imagery, strong collection tabs, premium product grid, fashion-sport energy, clear shopping flow.

## Build Requirements

- Brand name: Gymfriends
- User wants a website for an online store for their gym clothing brand.
- User wants максимально круті переходи між сторінками.
- User wants on the first page a professional-style product switcher.
- User wants a cool style similar to Nike or Adidas.
- Brand direction selected by user: Агресивний sport
- Primary product category to feature first: Футболки
- User will send the logo later.
- Brand colors are not decided yet.
- Target audience selected by user: Унісекс
- Homepage sections selected by user: Нові дропи, Хіти продажу
- Site mood selected by user: Жорсткий і темний
- No brand social link provided yet.
- Primary visitor goal: знайти потріюну колекцію та придбати сподобавшийся товар
- Pages selected by user: Головна, Каталог, Контакти, Інше
- No contact details available yet.
- Primary conversion action selected by user: Залишити заявку
- Additional required page selected by user: Доставка й оплата
- Website should function as a premium catalog/contact-led store, not a full checkout ecommerce flow.

## User Uploaded Assets

(none)

## Logo Info

```json
{}
```

## Visual Specification

# Visual Design Spec

## 1. Global Visual System
The visual design language is highly editorial, minimalist, and restrained, embodying a "quiet luxury" aesthetic. It relies on abundant negative space, a muted and earthy photographic palette, and pristine geometric alignment. The UI is aggressively flat—there are zero rounded corners, zero drop shadows, and zero glassmorphism effects. Visual hierarchy and depth are achieved strictly through physical occlusion (elements physically overlapping one another), typographic scale and tracking, and subtle scroll-linked parallax motion. The interface acts as an invisible, structural frame for the high-end lifestyle photography.

## 2. Global Layout and Rhythm
*   **Containers:** The layout rhythm heavily alternates between a constrained, centered maximum-width container (approximately 1200px–1440px) and full-bleed 100vw edge-to-edge moments.
*   **Grids:** Predominantly utilizes strict 3-column and 4-column grids for standard product arrays and article lists. 
*   **Asymmetry & Overlap:** The strict grids are intentionally and aggressively broken in "editorial" sections via staggered, asymmetrical image pairings and floating text cards that overlap column boundaries and background boundaries.
*   **Spacing:** Vertical rhythm relies on massive padding between sections. Sections are separated by whitespace rather than background color shifts or horizontal rules.

## 3. Global Typography System
*   **Typeface:** A single, clean, geometric sans-serif family is used universally.
*   **Display & Headings:** Relies exclusively on `text-transform: uppercase` paired with extremely wide tracking (`letter-spacing: 0.1em` to `0.2em`).
*   **Body Copy:** Regular weight, sentence case, standard tracking, with a generous line height (approx. `1.6`).
*   **Hierarchy Strategy:** Contrast is created entirely through physical scale, casing variations, tracking width, and subtle color shifts (charcoal vs. medium grey). Heavy font weights and bolding are completely absent from the design system.

## 4. Global Color, Surface, and Effects
*   **Color Palette:** Functionally monochromatic. Surfaces are pure white (`#FFFFFF`) or very light off-white/grey (`#F4F4F4`) for product card backgrounds. Text is charcoal/almost-black (`#111111`) with secondary meta-text in medium grey (`#767676`).
*   **Surfaces:** Utterly flat and sharp. No gradients on UI elements.
*   **Depth:** Depth is created exclusively by placing solid, opaque white rectangular cards over full-bleed photographs, or via parallax scrolling. 
*   **Image Tones:** All warmth, mood, and chromatic saturation in the design comes from the photography, which features earthy, muted, and soft-lit treatments.

## 5. Global Motion Language
*   **Philosophy:** Restrained, slow-paced, product-like, and elegant. Motion exists to ease content into view or create subtle environmental depth. 
*   **Entrance Reveals:** As elements cross the bottom 10-15% of the viewport, they trigger a synchronized fade-in (0% to 100% opacity) and a gentle upward translation (approx. `30px`). 
*   **Easing & Timing:** Entrance motion uses a smooth `ease-out` curve, lasting roughly 600-800ms. 
*   **Parallax:** Full-bleed background images frequently utilize a linear, scrubbed-to-scroll parallax effect, translating vertically at a slower rate than the page scroll.
*   **Subtle Details:** Shoppable lifestyle images feature a slow, continuous pulsing/breathing animation on the circular hotspot tags.

## 6. Motion Adaptation Rules
*   **Entrance Synchronization:** Rows of product cards or text blocks should animate as grouped units or with an extremely tight micro-stagger. Avoid cascading, staggered text-line reveals that artificially delay reading. 
*   **Parallax Budget:** Parallax background images must be configured with enough vertical overflow (height buffer) to ensure they do not expose their top or bottom edges when scrolling rapidly on tall viewports.
*   **Viewport Completion:** Entrance animations must complete their vertical translation and opacity fade well before reaching the middle of the viewport so the user is never waiting on motion to read content.

## 7. Global Imagery and Iconography
*   **Framing & Crop:** Hard rectangular crops exclusively. Sharp 90-degree corners. 
*   **Iconography:** Extremely thin, minimalist line-art style. Stroke widths appear to be a strict 1px or 1.5px. Icons are un-filled and geometric (e.g., standard cart, minimal search magnifying glass, thin play button arrows).
*   **Relationship to Layout:** Images frequently serve as the structural anchor for a section, with text floating over them or breaking out of them.

## 8. Persistent Interface Layers
*   **Announcement Bar:** Thin, dark, full-width banner at the absolute top of the page.
*   **Global Header:** Transparent when the user is at the absolute top of the page (overlapping the hero image). 
    *   *Behavior:* Hides by translating up when scrolling down. Triggers a sticky reveal (dropping down into the viewport) when the user scrolls up. The sticky state has a solid white background and a 1px solid bottom border.

## 9. Section Inventory
1. Global Header & Announcement
2. Hero Statement
3. Tabbed Product Array
4. Full-Bleed Feature Spotlight
5. Mission Statement
6. 50/50 Category Mosaic
7. Scrolling Marquee
8. Standard Product Row
9. Video Teaser
10. Shoppable Editorial Split
11. Promo Countdown Banner
12. Editorial Split with Staggered Images
13. Interactive Color Comparison Slider
14. Parallax Background + Floating Content
15. Article Teaser Grid
16. Product Detail Split
17. Dark Brand Feature Block
18. Interactive Timeline Tab Block
19. Process Grid
20. Newsletter Capture
21. Social Media Mosaic
22. Value Proposition Row
23. Global Footer

## 10. Section-by-Section Detailed Spec

### Hero Statement
*   **Layout:** Full-bleed background image. Centered alignment.
*   **Distinctive Cues:** A large, fully transparent bounding box with a 1px solid white outline floats in the center. Inside is a large uppercase tracked-out statement, a smaller sub-headline, and a solid white sharp-cornered CTA button.
*   **Icon:** A small circular 1px icon with a downward-pointing arrow pulses gently at the very bottom edge of the viewport.

### Tabbed Product Array
*   **Layout:** Centered max-width container. Two small, centered uppercase text tabs act as a sub-navigation above a 4-column product grid.
*   **Product Card Structure:** 
    *   Image container: 4:5 portrait ratio, light grey background.
    *   Action Button: A small, white circular floating action button (FAB) with a 1px border and a 1px "+" icon sits perfectly inset on the bottom-right corner of the image container.
    *   Typography: Centered below the image. Small uppercase tracked title, followed by sentence-case grey price text.

### Full-Bleed Feature Spotlight
*   **Layout:** Edge-to-edge landscape lifestyle image. 
*   **Typography:** Text and a solid white CTA button are placed directly over the photographic background on the left-hand side, vertically centered.
*   **Adaptation Constraint:** Because text sits directly on an image, a subtle CSS gradient overlay or text-shadow must be implemented programmatically behind the text layer to ensure contrast if the client swaps in a light-toned image.

### 50/50 Category Mosaic
*   **Layout:** Full-width. Exactly a 50/50 vertical split.
*   **Structure:** The left half is a single, massive portrait image. The right half contains two stacked horizontal/landscape images.
*   **Typography:** Uppercase category titles float dead-center over each of the three images.

### Scrolling Marquee
*   **Motion Pattern: Continuous Loop**
    *   **Role:** High-energy visual break separating catalog sections.
    *   **Observed behavior:** An infinite, linear horizontal scroll of alternating oversized text and full-color product images.
    *   **Duration band:** Continuous, steady rate.
    *   **Adaptation constraints:** The injected images must be strictly constrained via CSS so their height perfectly matches the cap-height of the text. They cannot break the line height.
    *   **Failure risks:** If images use arbitrary aspect ratios without forced `height` and `width: auto` styling, the marquee layout will collapse.

### Promo Countdown Banner
*   **Layout:** Full-bleed image background.
*   **Structure:** Left-aligned text box and CTA button. On the right side, a live countdown timer floats over the image. 
*   **Typography:** The timer features oversized numbers stacked directly above small uppercase unit labels (DAYS, HOURS, MIN, SEC).

### Editorial Split with Staggered Images
*   **Layout:** 50/50 split container. One side holds a centered text block. The other side holds a staggered image composition.
*   **Distinctive Cues:** The image composition consists of an anchor image and a smaller secondary image that overlaps its bottom corner. 
*   **Implementation Clues:** Must be built using `position: relative` on the wrapper and absolute positioning or severe negative margins on the overlapping image. Do not flatten this into a standard CSS grid with gaps.

### Interactive Color Comparison Slider
*   **Layout:** Full-width block. Two identical photos showing different product colors, laid exactly on top of one another.
*   **Interactive Behavior:** A 1px vertical line divides them. In the center is a white circular thumb with chevron icons. Dragging the line left or right horizontally clips/masks the top image to reveal the bottom image.

### Parallax Background + Floating Content
*   **Motion Pattern: Scrubbed Parallax Depth**
    *   **Role:** Create physical depth without using shadows.
    *   **Observed behavior:** A massive background image translates vertically at a slower rate than the user's scroll. Floating over this background is a stark, solid white, sharp-cornered text card, and a portrait image that physically overlaps the white card.
    *   **Trigger:** Scrubbed scroll.
    *   **Portability note:** This is an illusion of complex motion created by simple CSS layering. The background image needs `background-attachment: fixed` or a simple translating parallax hook. The foreground elements (white card + portrait image) scroll natively with the DOM. Ensure the background image has at least 130% height of the section to prevent edges showing.

### Interactive Timeline Tab Block
*   **Layout:** A large lifestyle image on the left, a text block on the right. Below this content block is a horizontal row of years (e.g., 2013, 2014, 2015...).
*   **Interactive Behavior:** The years act as navigation tabs. Clicking a year swaps the image and text above it. A 1px underline indicates the active year.

## 11. Reusable Patterns and Motifs
*   **The Overlaid Text Card:** A stark white rectangular card with pure sharp corners, dark text, and no border. Used to anchor text heavily when overlapping complex parallax imagery.
*   **The Transparent Outline Box:** Used in the hero. A completely transparent box with a 1px white border.
*   **The Editorial Overlap:** Intentionally breaking column structures by absolutely positioning a smaller image over the corner of a larger image to create a scrapbook/editorial feel.
*   **The Sharp Action Button:** Solid fill (black or white), absolute sharp corners, uppercase tracked text. No visible drop shadow.
*   **The Floating Circular Action Tool:** A pure white circle with a 1px border. Used for the "+" quick-add product button, the play button, and the slider thumb. Always features an ultra-thin line-art icon inside.

## 12. Essential Traits to Preserve
*   The complete absence of border-radius (rounded corners).
*   The complete absence of drop shadows or elevation layers.
*   The strict typographic hierarchy (Caps + Wide Tracking vs. Sentence Case) without utilizing font weights.
*   The physical occlusion strategy (stacking white cards over edge-to-edge images) to create depth.
*   The subtle, 1px stroke weight for all icons and outlines.

## 13. Build Guardrails and Anti-Simplification Warnings
*   **WARNING - Element Geometry:** The coding LLM must not inject default framework styling like `rounded-md`, `rounded-lg`, or subtle button shadows. Every corner must be `border-radius: 0`.
*   **WARNING - Icon Weight:** Do not use standard bold or filled icon sets (like FontAwesome Solid or default Material Icons). Use a stroke-based library (like Lucide Light or Phosphor) set to `stroke-width: 1` or `1.5`.
*   **WARNING - Image Contrast:** For sections where white text sits directly on background images without a card (Hero, Feature Spotlight), the LLM must include a CSS scrim, gradient overlay, or `text-shadow` utility to ensure text remains legible if light images are uploaded.
*   **WARNING - Staggered Layouts:** Do not simplify the staggered image groupings into standard side-by-side flexbox or grid columns. The specific Z-index overlap and negative coordinate offset is crucial to the editorial aesthetic.

## 14. Redaction and Abstraction Notes
*   Literal brand names and founder names visible in the typography have been referenced generically or abstracted.
*   Specific product model names visible in titles and paragraphs have been abstracted.
*   Dates and years in the timeline are referenced descriptively.

## Current HTML

(none)

## Context HTML

(none)
