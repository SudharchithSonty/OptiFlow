# Authentication Visual Reference

## Color Palette

### Primary Colors
```css
Blue Primary:   #3b82f6  (bg-blue-600)
Blue Hover:     #2563eb  (bg-blue-700)
Blue Active:    #1d4ed8  (bg-blue-800)
Blue Light:     #dbeafe  (bg-blue-50)
Blue Border:    #60a5fa  (border-blue-500)
```

### State Colors
```css
/* Error States */
Red Primary:    #ef4444  (bg-red-600)
Red Light:      #fef2f2  (bg-red-50)
Red Border:     #fca5a5  (border-red-300)
Red Text:       #991b1b  (text-red-800)

/* Success States */
Green Primary:  #10b981  (bg-green-600)
Green Light:    #f0fdf4  (bg-green-50)
Green Border:   #86efac  (border-green-200)
Green Text:     #166534  (text-green-800)

/* Neutral/Disabled */
Gray Light:     #f9fafb  (bg-gray-50)
Gray Border:    #d1d5db  (border-gray-300)
Gray Text:      #6b7280  (text-gray-500)
Gray Disabled:  #9ca3af  (text-gray-400)
```

### Gradients
```css
Background: linear-gradient(to bottom right, #eff6ff, #e0e7ff)
/* from-blue-50 to-indigo-100 */
```

---

## Component Measurements

### Input Fields
```
Height: 48px (py-3 = 12px top + 12px bottom + text height)
Padding: 12px vertical, 16px horizontal
Icon Left: 12px from left edge (pl-11 accounts for icon + spacing)
Icon Right: 12px from right edge
Border: 1px
Border Radius: 8px (rounded-lg)
Focus Ring: 2px
```

### OTP Input Boxes
```
Tablet:
  Width: 48px
  Height: 56px
  Gap: 8px between boxes
  
Desktop:
  Width: 56px
  Height: 64px
  Gap: 8px between boxes

Font Size: 1.25rem (text-xl)
Border: 2px
Border Radius: 8px
```

### Buttons
```
Primary Button:
  Height: 48px (py-3)
  Padding: 12px vertical, 16px horizontal
  Border Radius: 8px
  Font Weight: Medium
  Min Width: 100%

Text Button/Link:
  No background
  Underline on hover
  Color: Blue 600
  Font Size: 0.875rem (text-sm)
```

### Card Container
```
Max Width: 448px (max-w-md)
Padding: 24px mobile, 32px desktop (p-6 lg:p-8)
Border Radius: 16px (rounded-2xl)
Shadow: Extra large (shadow-xl)
Background: White
```

### Icons
```
Size: 20px × 20px (w-5 h-5)
Input Icons: 20px
Button Icons: 20px
Success/Error Icons: 20px
Large Icons (logo): 32px × 32px (w-8 h-8)
```

---

## Typography Scale

### Headings
```css
H1 (Page Title):
  Font Size: Default (from globals.css)
  Font Weight: Medium (500)
  Line Height: 1.5
  Color: Gray 900 (#111827)
  Margin Bottom: 8px

H2 (Subtitle):
  Font Size: Default
  Font Weight: Normal (400)
  Color: Gray 600 (#4b5563)
```

### Body Text
```css
Body (Default):
  Font Size: 16px (base)
  Font Weight: Normal (400)
  Line Height: 1.5
  Color: Gray 600 (#4b5563)

Small Text:
  Font Size: 14px (text-sm)
  Font Weight: Normal (400)
  Color: Gray 600 (#4b5563)

Extra Small:
  Font Size: 12px (text-xs)
  Font Weight: Normal (400)
  Color: Gray 500 (#6b7280)
```

### Labels
```css
Input Labels:
  Font Size: 14px (text-sm)
  Font Weight: Medium (500)
  Color: Gray 700 (#374151)
  Margin Bottom: 8px
```

### Monospace (Demo Credentials)
```css
Font Family: monospace (font-mono)
Font Size: 12px (text-xs)
Line Height: 1.25
Color: Blue 800 (#1e40af)
```

---

## Spacing System

### Vertical Spacing
```
Logo to Title: 16px (mb-4)
Title to Subtitle: 8px (mb-2)
Subtitle to Card: 32px (mb-8)

Input to Input: 16px (mb-4)
Input to Action: 24px (mb-6)
Card to Footer: 24px (mt-6)

Error Banner: 24px bottom (mb-6)
Success Banner: 24px bottom (mb-6)
```

### Horizontal Spacing
```
Icon to Text: 12px (gap-3)
OTP Boxes: 8px gap (gap-2)
Button Icon to Text: 8px (gap-2)

Screen Edge Padding: 16px (p-4)
```

### Internal Padding
```
Card: 24px mobile (p-6), 32px desktop (p-8)
Input: 12px vertical, 16px horizontal
Button: 12px vertical, 16px horizontal
Banner: 16px all sides (p-4)
Demo Box: 16px all sides (p-4)
```

---

## State Transitions

### Default → Focus
```css
Transition: border-color 200ms, box-shadow 200ms
Border: gray-300 → blue-500
Ring: none → 2px blue-500 at 50% opacity
Duration: 200ms
Easing: ease-in-out
```

### Default → Loading
```css
Transition: background-color 200ms
Background: white → gray-50 (inputs)
Background: blue-600 → blue-600 (button, no change)
Cursor: default → not-allowed
Icon: none → spinner (rotate animation)
Spinner: 360deg rotation, 1s duration, linear, infinite
```

### Default → Error
```css
Transition: border-color 200ms, background-color 200ms
Border: gray-300 → red-300
Ring: blue-500 → red-500 (on focus)
Banner: slide-in from top, 200ms
Duration: 200ms
```

### Error → Default (Clear)
```css
Transition: border-color 200ms
Border: red-300 → gray-300
Banner: fade-out, 200ms
On Type: Immediate error clear
```

### OTP Fill Animation
```css
Border: gray-300 → blue-500
Transition: 150ms ease-in-out
Focus: Immediate ring appearance
Auto-advance: Next input focus after 10ms delay
```

---

## Layout Breakpoints

### Mobile (< 640px)
```css
Card Padding: 24px (p-6)
Input Height: 48px
OTP Box Size: 48×56px
Font adjustments: None (same as base)
```

### Tablet (640px - 1199px)
```css
Card Padding: 32px (lg:p-8)
Input Height: 48px
OTP Box Size: 48×56px
Same as mobile, just more breathing room
```

### Desktop (≥ 1200px)
```css
Card Padding: 32px (lg:p-8)
Input Height: 48px
OTP Box Size: 56×64px
Larger OTP boxes for precision
```

---

## Component States Visual Map

### Input Field States

```
┌─────────────────────────────────────┐
│ DEFAULT                             │
│ • Border: 1px gray-300              │
│ • Background: white                 │
│ • Text: gray-900                    │
│ • Placeholder: gray-400             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ FOCUS                               │
│ • Border: 1px blue-500              │
│ • Ring: 2px blue-500 (50% opacity) │
│ • Background: white                 │
│ • Cursor: text                      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ERROR                               │
│ • Border: 1px red-300               │
│ • Ring: 2px red-500 (on focus)     │
│ • Background: white                 │
│ • Associated error text below       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ DISABLED/LOADING                    │
│ • Border: 1px gray-300              │
│ • Background: gray-50               │
│ • Cursor: not-allowed               │
│ • Text: gray-500                    │
└─────────────────────────────────────┘
```

### Button States

```
┌─────────────────────────────────────┐
│ DEFAULT (Enabled)                   │
│ • Background: blue-600              │
│ • Text: white                       │
│ • Border: none                      │
│ • Cursor: pointer                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ HOVER                               │
│ • Background: blue-700              │
│ • Text: white                       │
│ • Transition: 200ms                 │
│ • Cursor: pointer                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ACTIVE (Click)                      │
│ • Background: blue-800              │
│ • Text: white                       │
│ • Brief visual feedback             │
│ • Cursor: pointer                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ DISABLED                            │
│ • Background: gray-300              │
│ • Text: gray-500                    │
│ • Border: none                      │
│ • Cursor: not-allowed               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ LOADING                             │
│ • Background: blue-600 (unchanged)  │
│ • Icon: Spinner (rotating)          │
│ • Text: "Verifying..." etc.         │
│ • Cursor: not-allowed               │
└─────────────────────────────────────┘
```

### OTP Input States

```
┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
│   │ │   │ │   │ │   │ │   │ │   │  EMPTY
└───┘ └───┘ └───┘ └───┘ └───┘ └───┘
Gray borders, first input focused

┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
│ 1 │ │ 2 │ │ 3 │ │   │ │   │ │   │  FILLING
└───┘ └───┘ └───┘ └───┘ └───┘ └───┘
Blue borders on filled, gray on empty

┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
│ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │  COMPLETE
└───┘ └───┘ └───┘ └───┘ └───┘ └───┘
All blue borders, submit enabled

┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
│ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │  ERROR
└───┘ └───┘ └───┘ └───┘ └───┘ └───┘
All red borders, error banner above
```

---

## Banner/Alert States

### Error Banner
```
┌──────────────────────────────────────┐
│ ⚠  Invalid email or password.        │
│    Please try again.                 │
└──────────────────────────────────────┘

Background: red-50 (#fef2f2)
Border: 1px red-200
Padding: 16px
Border Radius: 8px
Icon: AlertCircle, red-600
Text: red-800
```

### Success Banner
```
┌──────────────────────────────────────┐
│ ✓  Verification successful!          │
└──────────────────────────────────────┘

Background: green-50 (#f0fdf4)
Border: 1px green-200
Padding: 16px
Border Radius: 8px
Icon: CheckCircle2, green-600
Text: green-800
```

### Info Banner (Demo Credentials)
```
┌──────────────────────────────────────┐
│ Demo Credentials:                    │
│ owner@company.com / owner123         │
│ planner@company.com / planner123     │
│ supervisor@company.com / supervisor123│
└──────────────────────────────────────┘

Background: blue-50 (#eff6ff)
Border: 1px blue-200
Padding: 16px
Border Radius: 8px
Text: blue-900 (title), blue-800 (content)
Font: monospace for credentials
```

---

## Icon Positioning

### Input Icon (Left)
```
┌─────────────────────────────────────┐
│ 📧  you@company.com                 │
└─────────────────────────────────────┘
    ↑
    12px from left edge
    Centered vertically
    20×20px size
```

### Input Icon (Right - Password Toggle)
```
┌─────────────────────────────────────┐
│ ••••••••                         👁  │
└─────────────────────────────────────┘
                                    ↑
                    12px from right edge
                    Centered vertically
                    Clickable area: 40×40px
```

### Button Icon
```
┌─────────────────────────────────────┐
│    ⟳  Signing in...                 │
└─────────────────────────────────────┘
     ↑
     Icon + 8px gap + Text
     All centered horizontally
```

---

## Loading Spinner

### Specifications
```css
Size: 20×20px (w-5 h-5)
Border Width: 2px
Border Color: currentColor (transparent on 3 sides)
Animation: spin 1s linear infinite
Color: Inherits from parent (white in blue button)

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Usage Locations
- Login submit button (white on blue)
- OTP verify button (white on blue)
- Forgot password buttons (white on blue)
- Resend button area (blue on white, briefly)

---

## Focus Ring Details

```css
Ring Width: 2px
Ring Offset: 0px (touching the border)
Ring Color: Blue-500 (#3b82f6) at 50% opacity
Ring Style: Solid

/* Applied on focus */
outline: 2px solid rgba(59, 130, 246, 0.5);
outline-offset: 0px;
```

**Note:** Tailwind's `focus:ring-2` utility handles this automatically

---

## Animation Timings

```css
/* Transitions */
Color Change:        200ms ease-in-out
Border Change:       200ms ease-in-out
Background Change:   200ms ease-in-out
Opacity Change:      150ms ease-in-out

/* Animations */
Spinner Rotation:    1000ms linear infinite
Banner Slide-in:     200ms ease-out
Banner Fade-out:     150ms ease-in
OTP Auto-advance:    10ms delay (imperceptible)

/* Hover */
Button Hover:        200ms ease-in-out
Link Hover:          150ms ease-in-out
```

---

## Accessibility Indicators

### Keyboard Focus
- Blue ring (2px, 50% opacity)
- Clear contrast against background
- Visible on all interactive elements

### Screen Reader Text
```html
<button>
  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
  <span>Signing in...</span>
  <span class="sr-only">Loading, please wait</span>
</button>
```

### ARIA Labels
```html
<!-- Error message linked to input -->
<input 
  aria-invalid="true" 
  aria-describedby="email-error"
/>
<p id="email-error">Invalid email address</p>
```

---

## Z-Index Layers

```
Base Layer:         0  (inputs, cards)
Header/Navigation:  10 (if needed)
Overlays:          40  (modals, if added later)
Tooltips:          50  (if added later)
```

---

## Print Styles

Not applicable for auth screens (should redirect if printing attempted)

---

## Dark Mode (Future Enhancement)

Currently not implemented, but color tokens are prepared:
- Use `dark:` prefix for future dark mode variants
- All colors defined in globals.css support dark mode
- Would need to add dark mode toggle and state management

---

This visual reference ensures consistent implementation across all authentication screens with precise measurements and state behaviors.
