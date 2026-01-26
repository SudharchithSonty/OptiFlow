# Authentication Flows - Digital Operations Assistant

## Overview

Three complete authentication screens with tablet-first (1024×768) and desktop-responsive (1440×900) design:

1. **AUTH-01: Login** - Email + Password authentication
2. **AUTH-02: OTP Verify** - 6-digit verification code
3. **AUTH-03: Forgot Password** - Multi-step password reset

All screens include comprehensive error states, loading states, and disabled states.

---

## AUTH-01: Login Page

**Route:** `/auth/login`

### Features

#### Core Functionality
- Email input with validation
- Password input with show/hide toggle
- Remember me checkbox
- Forgot password link
- Form validation (disabled submit until valid)
- Demo credentials display

#### States Implemented

**1. Default State**
- Empty form
- Submit button disabled (gray)
- All inputs enabled
- No error messages

**2. Loading State**
- Submit button shows spinner + "Signing in..."
- All inputs disabled (gray background)
- Submit button disabled
- Loading indicator visible

**3. Invalid Credentials State**
- Red error banner with alert icon
- Error message: "Invalid email or password. Please try again."
- Input borders turn red
- Focus ring color changes to red
- Submit button re-enabled after fixing

**4. Form Validation**
- Submit disabled when email or password empty
- Email format validation (basic)
- Visual feedback on focus
- Clear error on input change

### Demo Credentials

```
Owner:      owner@company.com / owner123
Planner:    planner@company.com / planner123
Supervisor: supervisor@company.com / supervisor123
```

### User Flow

```
1. User enters email
2. User enters password
3. (Optional) Toggle "Remember me"
4. Click "Sign In"
   ↓
5a. Valid credentials → Navigate to OTP page
5b. Invalid credentials → Show error, stay on page
```

### Visual Design

**Tablet (1024×768)**
- Centered card (max-width: 28rem)
- Large touch-friendly inputs (48px height)
- Prominent submit button
- Bottom demo credentials box

**Desktop (1440×900)**
- Same centered layout
- Slightly larger padding
- Consistent with tablet design

---

## AUTH-02: OTP Verify Page

**Route:** `/auth/otp`

### Features

#### Core Functionality
- 6 individual digit inputs
- Auto-focus next input on entry
- Auto-focus previous on backspace
- Paste support (Ctrl/Cmd+V)
- 60-second resend timer
- Resend button (enabled after timer expires)
- Back to login link

#### States Implemented

**1. Default State**
- 6 empty input boxes
- Submit button disabled
- Timer counting down from 60s
- Resend button disabled

**2. Entering Code State**
- Inputs fill one by one
- Blue border on filled inputs
- Auto-advance to next input
- Submit enables when all 6 filled

**3. Loading State**
- Submit button shows spinner + "Verifying..."
- All inputs disabled
- Gray background on inputs

**4. Invalid Code State**
- Red error banner: "Invalid verification code. Please try again."
- Input borders turn red
- OTP cleared automatically
- Focus returns to first input
- Submit button re-enabled

**5. Expired Code State**
- Red error banner: "This verification code has expired. Please request a new one."
- Input borders turn red
- "Request a new code" link in error
- Can also use resend button

**6. Success State**
- Green success banner: "Verification successful!"
- Brief pause (1 second)
- Navigate to dashboard

**7. Resend State**
- Timer reaches 0:00
- "Resend code in 0:00" → "Resend verification code"
- Button turns blue and clickable
- On click: timer resets to 60s, inputs clear
- Green success: "Verification code resent successfully!"

### Demo OTP Codes

```
Valid:   123456
Expired: 999999
Invalid: Any other 6-digit code
```

### User Flow

```
1. Arrive from login (email passed in state)
2. See email address displayed
3. Enter 6-digit code
   ↓
4a. Valid code → Success message → Navigate to app
4b. Invalid code → Error, clear, try again
4c. Expired code → Error, show resend option
   ↓
5. If needed: Wait for timer or click resend
```

### Special Features

**Auto-Paste**
- Press Ctrl/Cmd+V in any input
- Automatically fills all 6 digits
- Focuses on last filled digit

**Keyboard Navigation**
- Tab: Move forward
- Shift+Tab: Move backward
- Backspace on empty: Jump to previous
- Arrow keys: Navigate between inputs

### Visual Design

**Tablet (1024×768)**
- 6 input boxes (48×56px each)
- 8px gap between inputs
- Large, centered layout
- Clear timer display

**Desktop (1440×900)**
- 6 input boxes (56×64px each)
- Slightly larger for precision
- Same centered design

---

## AUTH-03: Forgot Password Page

**Route:** `/auth/forgot-password`

### Features

#### Multi-Step Flow

**Step 1: Enter Email**
- Email input with validation
- Send verification code button
- Back to login link

**Step 2: Verify OTP**
- Same as OTP Verify page
- 6-digit code entry
- Resend timer (60s)

**Step 3: Reset Password**
- New password input
- Confirm password input
- Password strength validation (min 8 chars)
- Match validation
- Reset button

**Step 4: Success**
- Success icon and message
- "Back to Login" button

#### States Implemented

**Step 1 States:**
- Default (empty email)
- Loading (sending code)
- Error (email not found)
- Disabled submit (invalid email)

**Step 2 States:**
- Default (empty OTP)
- Entering code
- Loading (verifying)
- Invalid code
- Expired code
- Resend available
- Resend loading

**Step 3 States:**
- Default (empty passwords)
- Password too short error
- Passwords don't match error
- Loading (resetting)
- Disabled submit (invalid)

**Step 4 State:**
- Success confirmation

### Demo Flow

```
Valid emails:
- owner@company.com
- planner@company.com
- supervisor@company.com

Valid OTP: 123456
Expired OTP: 999999
```

### User Flow

```
Step 1: Email
  ↓
  Enter email → Click "Send Verification Code"
  ↓
  Valid email → Step 2
  Invalid email → Error message
  
Step 2: OTP
  ↓
  Enter 6-digit code → Click "Verify Code"
  ↓
  Valid code → Step 3
  Invalid/Expired → Error, can resend
  
Step 3: New Password
  ↓
  Enter password (8+ chars) → Confirm password
  ↓
  Passwords match → Click "Reset Password"
  ↓
  Success → Step 4
  
Step 4: Success
  ↓
  Click "Back to Login" → Login page
```

### Password Validation Rules

1. **Minimum Length:** 8 characters
2. **Match Required:** New password must equal confirm password
3. **Visual Feedback:**
   - Red text if too short
   - Red text if don't match
   - Submit disabled until both valid

### Visual Design

**All Steps:**
- Consistent header with icon
- Step-specific title and description
- Back button (except success)
- Centered card layout
- Smooth transitions between steps

**Tablet/Desktop:**
- Same responsive design as Login
- Max-width: 28rem
- Touch-friendly inputs
- Clear visual hierarchy

---

## Design System

### Colors

**States:**
- Default: Gray borders (#d1d5db)
- Focus: Blue ring (#3b82f6)
- Error: Red borders & background (#ef4444, #fef2f2)
- Success: Green background (#10b981, #f0fdf4)
- Disabled: Gray background (#f9fafb)

**Buttons:**
- Primary: Blue (#3b82f6)
- Disabled: Gray (#d1d5db)
- Loading: Same as primary with spinner

**Text:**
- Headings: Gray 900 (#111827)
- Body: Gray 600 (#4b5563)
- Error: Red 800 (#991b1b)
- Success: Green 800 (#166534)

### Typography

**H1 (Titles):**
- Size: Default (system)
- Weight: Medium
- Color: Gray 900

**Body:**
- Size: Default
- Weight: Normal
- Color: Gray 600

**Labels:**
- Size: Small (0.875rem)
- Weight: Medium
- Color: Gray 700

**Input Text:**
- Size: Default
- Weight: Normal
- Color: Gray 900

### Spacing

**Margins:**
- Header to card: 2rem (mb-8)
- Between inputs: 1rem (mb-4)
- Button spacing: 1.5rem (mb-6)

**Padding:**
- Card: 1.5rem mobile, 2rem desktop
- Inputs: 0.75rem vertical, 1rem horizontal
- Buttons: 0.75rem vertical, 1rem horizontal

**Gaps:**
- Icon to text: 0.75rem (gap-3)
- OTP inputs: 0.5rem (gap-2)

### Interactive States

**Hover:**
- Buttons: Darker shade
- Links: Darker text color
- Inputs: No change (focus handles interaction)

**Focus:**
- Ring: 2px blue outline
- Border: Blue color
- Clear indication

**Active:**
- Buttons: Even darker shade
- Brief visual feedback

**Disabled:**
- Opacity: 50% for icons
- Background: Gray (#f9fafb)
- Cursor: not-allowed
- No hover effects

---

## Accessibility

### Keyboard Navigation
- Tab through all interactive elements
- Enter to submit forms
- Escape to close (if applicable)
- Arrow keys in OTP inputs

### Screen Readers
- Semantic HTML (form, input, button, label)
- ARIA labels on icons
- Error messages announced
- Loading states announced

### Visual
- High contrast text
- Color + text for states (not color alone)
- Clear focus indicators
- Minimum 48px touch targets

### Form Labels
- All inputs have associated labels
- Labels visible (not placeholder-only)
- Error messages linked to inputs

---

## Routes & Navigation

```
/auth/login
  ├─→ /auth/otp (on successful login)
  └─→ /auth/forgot-password (forgot password link)

/auth/otp
  ├─→ / (on successful verification)
  └─→ /auth/login (back button)

/auth/forgot-password
  ├─→ /auth/forgot-password (multi-step, same route)
  └─→ /auth/login (back button, success button)
```

### State Passing

**Login → OTP:**
```javascript
navigate('/auth/otp', { 
  state: { 
    email: 'user@company.com',
    role: 'planner' 
  } 
});
```

**OTP → Dashboard:**
```javascript
navigate('/', { 
  replace: true,
  state: { role: 'planner' } 
});
```

---

## Error Messages

### Login
```
"Invalid email or password. Please try again."
```

### OTP
```
"Invalid verification code. Please try again."
"This verification code has expired. Please request a new one."
```

### Forgot Password
```
Step 1: "No account found with this email address."
Step 2: "Invalid verification code. Please try again."
Step 2: "This verification code has expired. Please request a new one."
Step 3: "Password must be at least 8 characters"
Step 3: "Passwords do not match"
```

---

## Success Messages

### OTP
```
"Verification successful!"
"Verification code resent successfully!"
```

### Forgot Password
```
"Password reset successful!"
```

---

## Testing Checklist

### Login Page
- [ ] Email validation works
- [ ] Password show/hide toggles
- [ ] Remember me checkbox toggles
- [ ] Submit disabled when empty
- [ ] Loading state displays
- [ ] Invalid credentials show error
- [ ] Valid credentials navigate to OTP
- [ ] Forgot password link works
- [ ] Demo credentials visible

### OTP Page
- [ ] 6 inputs render correctly
- [ ] Auto-focus on first input
- [ ] Auto-advance on entry
- [ ] Backspace moves to previous
- [ ] Paste fills all inputs
- [ ] Submit disabled until complete
- [ ] Valid OTP navigates to app
- [ ] Invalid OTP shows error
- [ ] Expired OTP shows error
- [ ] Timer counts down
- [ ] Resend enables after timer
- [ ] Resend resets timer
- [ ] Back button works

### Forgot Password Page
- [ ] Step 1: Email validation
- [ ] Step 1: Invalid email error
- [ ] Step 1: Valid email advances
- [ ] Step 2: OTP entry works
- [ ] Step 2: Timer and resend work
- [ ] Step 3: Password validation
- [ ] Step 3: Match validation
- [ ] Step 3: Valid passwords advance
- [ ] Step 4: Success message
- [ ] Step 4: Back to login works
- [ ] Back button on each step
- [ ] Visual transitions smooth

---

## Mobile Considerations

### Touch Targets
- Minimum 48×48px for all buttons
- Adequate spacing between inputs
- Large submit buttons

### Input Types
- `type="email"` for email inputs
- `inputMode="numeric"` for OTP
- `type="password"` for passwords

### Viewport
- Responsive down to 320px
- Scrollable if content overflows
- Fixed positioning for modals

---

This authentication system provides a complete, production-ready user experience with comprehensive error handling and state management.
