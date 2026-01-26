# Authentication Quick Start Guide

## 🚀 Getting Started

### Access the Auth Demo
Navigate to: **`/auth/demo`**

This landing page shows all three authentication screens with:
- Feature highlights
- Demo credentials
- Test cases
- Quick access buttons

---

## 📱 Three Auth Screens

### 1. Login Page (`/auth/login`)

**Test Flow:**
```
1. Navigate to /auth/login
2. Enter: planner@company.com / planner123
3. Click "Sign In"
4. → Redirects to /auth/otp
```

**All States:**
- ✅ Empty form (button disabled)
- ✅ Valid input (button enabled)
- ✅ Loading (spinner + "Signing in...")
- ✅ Invalid credentials (red error banner)
- ✅ Password show/hide toggle
- ✅ Remember me checkbox

---

### 2. OTP Verify (`/auth/otp`)

**Test Flow:**
```
1. Arrive from login (or navigate directly)
2. Enter: 1 2 3 4 5 6
3. Click "Verify Code"
4. → Success, redirects to main app
```

**All States:**
- ✅ Empty inputs (button disabled)
- ✅ Filling (auto-advance)
- ✅ Complete (button enabled)
- ✅ Loading (spinner + "Verifying...")
- ✅ Invalid code (red error, cleared)
- ✅ Expired code (red error, resend option)
- ✅ Success (green banner, brief pause)
- ✅ Resend timer (60s countdown)

**Special Features:**
- Auto-advance on digit entry
- Backspace goes to previous input
- Paste support (Ctrl/Cmd+V)
- Timer countdown (1:00 → 0:00)

---

### 3. Forgot Password (`/auth/forgot-password`)

**Test Flow:**
```
Step 1: Enter owner@company.com
Step 2: Enter OTP 123456
Step 3: Enter password (8+ chars, matching)
Step 4: Success! Back to login
```

**All States:**
- ✅ Step 1: Email validation
- ✅ Step 2: OTP verification (same as OTP page)
- ✅ Step 3: Password validation
- ✅ Step 4: Success confirmation
- ✅ Back button on each step
- ✅ Smooth transitions between steps

---

## 🧪 Test Credentials

### Valid Login
```
owner@company.com / owner123
planner@company.com / planner123
supervisor@company.com / supervisor123
```

### OTP Codes
```
Valid:   123456  → Success, navigate to app
Expired: 999999  → Error: "code has expired"
Invalid: 111111  → Error: "invalid code"
```

### Password Reset
```
Valid emails:
- owner@company.com
- planner@company.com
- supervisor@company.com

Other emails → "No account found"
```

---

## ⚡ Quick Tests

### Login - Invalid Credentials
```
Email:    wrong@test.com
Password: wrongpass
Result:   Red error banner
```

### Login - Valid Credentials
```
Email:    planner@company.com
Password: planner123
Result:   Navigate to OTP page
```

### OTP - Valid Code
```
Code:   1 2 3 4 5 6
Result: Green success, navigate to app
```

### OTP - Invalid Code
```
Code:   1 1 1 1 1 1
Result: Red error, cleared inputs
```

### OTP - Expired Code
```
Code:   9 9 9 9 9 9
Result: Red error with resend link
```

### Forgot Password - Full Flow
```
Step 1: owner@company.com → Next
Step 2: 1 2 3 4 5 6 → Next
Step 3: password123 / password123 → Next
Step 4: Success → Back to login
```

---

## 🎨 Visual States

### Error State
```
┌────────────────────────────────────┐
│ ⚠  Invalid email or password.      │
│    Please try again.               │
└────────────────────────────────────┘
Red background, red borders on inputs
```

### Loading State
```
┌────────────────────────────────────┐
│ [⟳ Signing in...                 ] │
└────────────────────────────────────┘
Spinner rotating, button disabled
```

### Success State
```
┌────────────────────────────────────┐
│ ✓  Verification successful!        │
└────────────────────────────────────┘
Green background, brief pause, navigate
```

---

## 🔑 Key Features

### Form Validation
- Real-time validation
- Submit disabled until valid
- Clear error on input change
- Visual feedback (colors)

### Password Toggle
- Eye icon to show/hide
- Icon changes (eye ↔ eye-off)
- Works during typing

### OTP Auto-Advance
- Type digit → auto jump to next
- Backspace on empty → jump to previous
- Paste 6 digits → fill all at once

### Resend Timer
- Starts at 1:00 (60 seconds)
- Counts down to 0:00
- Button becomes clickable
- On click: timer resets, inputs clear

### Multi-Step Flow
- Forgot password has 4 steps
- Back button on each step
- Smooth transitions
- State preserved between steps

---

## 📐 Responsive Design

### Tablet (1024×768)
- Centered card layout
- Touch-friendly inputs (48px)
- Large OTP boxes (48×56px)
- Bottom padding for keyboard

### Desktop (1440×900)
- Same centered design
- Slightly larger OTP boxes (56×64px)
- More padding in cards
- Hover states on buttons

### Mobile (< 640px)
- Stacks vertically
- Full-width buttons
- Smaller OTP boxes fit screen
- Scrollable if needed

---

## 🎯 Common Scenarios

### "I entered the wrong email"
1. Click "Back to login" on OTP page
2. Re-enter correct email
3. Try again

### "OTP expired"
1. See red error message
2. Click "Resend code" (if timer expired)
3. Or click link in error message
4. Enter new code

### "Forgot which email I used"
1. On login page, click "Forgot password?"
2. Try entering different emails
3. Valid email → proceeds to OTP
4. Invalid email → shows error

### "Password doesn't match"
1. On reset step, see red error below confirm field
2. Re-enter matching password
3. Submit button enables

### "Want to test loading state"
1. Enter valid credentials
2. Click submit
3. Observe 1.5 second delay with spinner
4. Then navigation

---

## 🐛 Debugging

### Button won't enable
- Check both email and password filled
- Check password 8+ characters (on reset)
- Check passwords match (on reset)
- Check all 6 OTP digits entered

### OTP not auto-advancing
- Only digits allowed (no letters)
- Check focus on input
- Try clicking next input manually

### Paste not working
- Click in any OTP input first
- Use Ctrl+V (Windows) or Cmd+V (Mac)
- Ensure clipboard has 6 digits

### Timer not counting down
- Check page hasn't been backgrounded
- Refresh page if stuck
- Timer should start at 1:00

### Navigation not working
- Check console for errors
- Verify react-router-dom installed
- Check route paths match

---

## 📚 Documentation Files

- **AUTH_FLOWS.md** - Complete feature documentation
- **AUTH_TESTING_GUIDE.md** - Detailed test cases
- **AUTH_VISUAL_REFERENCE.md** - Design specifications
- **AUTH_QUICK_START.md** - This file

---

## 🚀 Routes Summary

```
/auth/demo              → Auth demo landing page
/auth/login             → Login page
/auth/otp               → OTP verification
/auth/forgot-password   → Password reset flow
/                       → Main app (after auth)
```

---

## ✨ Pro Tips

1. **Use demo credentials** - They're shown on each page
2. **Try paste in OTP** - Copy 123456, paste in any box
3. **Watch the timer** - Counts down from 1:00 in real-time
4. **Test error states** - Use 999999 for expired OTP
5. **Resize window** - See responsive design in action
6. **Use keyboard** - Tab through inputs, Enter to submit
7. **Check all steps** - Forgot password has 4 distinct screens
8. **Observe loading** - 1.5s delay shows real loading behavior

---

## 🎬 Demo Script (2 min)

```
1. Start at /auth/demo (10s)
   - Show three cards
   - Highlight features

2. Click "Login" demo (30s)
   - Show empty form
   - Enter invalid: wrong@test.com / wrong
   - Show error state
   - Clear, enter valid: planner@company.com / planner123
   - Show loading state
   - Navigate to OTP

3. OTP verification (30s)
   - Show auto-advance: type 1 2 3 4 5 6
   - Show submit enabled
   - Show loading
   - Show success
   - Navigate to app

4. Back to /auth/forgot-password (50s)
   - Step 1: Enter owner@company.com
   - Step 2: Paste 123456 (show paste feature!)
   - Step 3: password123 / password123
   - Step 4: Success screen
   - Back to login

Total: ~2 minutes
```

---

**Ready to test!** Start at `/auth/demo` or jump to `/auth/login`
