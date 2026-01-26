# How to Test Authentication Screens

## 🎯 Quick Access

### Method 1: Click the Green Button (EASIEST!)
1. Look at the **top right** of the screen
2. Click the **green "View Auth Screens"** button
3. You'll see the Auth Demo landing page with all three options

### Method 2: Direct URL
Type in your browser's address bar:
- Demo page: Add `/auth/demo` to your URL
- Login: Add `/auth/login` to your URL
- OTP: Add `/auth/otp` to your URL
- Forgot Password: Add `/auth/forgot-password` to your URL

---

## 📋 Step-by-Step Testing

### ✅ Test 1: Login Page (2 minutes)

1. **Click the green "View Auth Screens" button** in the top right
2. Click **"View Demo"** under "Login Page"
3. You should see a login form

**Test Invalid Credentials:**
- Email: `wrong@test.com`
- Password: `wrongpass`
- Click "Sign In"
- ❌ **Expected:** Red error banner appears

**Test Valid Credentials:**
- Email: `planner@company.com`
- Password: `planner123`
- Click "Sign In"
- ⏳ **Expected:** Loading spinner appears
- ✅ **Expected:** Redirects to OTP page after 1.5 seconds

---

### ✅ Test 2: OTP Verification (2 minutes)

After logging in, you should be on the OTP page automatically.

**Test Valid OTP:**
- Type: `1` `2` `3` `4` `5` `6`
- Notice inputs auto-advance as you type
- Click "Verify Code"
- ⏳ **Expected:** Loading spinner
- ✅ **Expected:** Green success message
- ✅ **Expected:** Redirects to main app

**To Test Invalid OTP:**
1. Click green button again → Auth Demo → OTP page
2. Type: `1` `1` `1` `1` `1` `1`
3. Click "Verify Code"
4. ❌ **Expected:** Red error, inputs cleared

**To Test Expired OTP:**
1. Type: `9` `9` `9` `9` `9` `9`
2. Click "Verify Code"
3. ❌ **Expected:** Red error saying "expired"

**To Test Paste:**
1. Copy this: `123456`
2. Click in any OTP box
3. Press Ctrl+V (or Cmd+V on Mac)
4. ✅ **Expected:** All 6 boxes fill automatically

**To Test Resend Timer:**
1. Watch the countdown: "Resend code in 1:00"
2. Wait (or just observe it counting down)
3. When it hits 0:00, button becomes blue
4. Click "Resend verification code"
5. ✅ **Expected:** Timer resets to 1:00, inputs clear

---

### ✅ Test 3: Forgot Password (3 minutes)

1. **Click green button** → Auth Demo
2. Click **"View Demo"** under "Forgot Password"

**Step 1 - Email:**
- Enter: `owner@company.com`
- Click "Send Verification Code"
- ⏳ **Expected:** Loading, then moves to Step 2

**Step 2 - OTP:**
- Type: `1` `2` `3` `4` `5` `6`
- Click "Verify Code"
- ⏳ **Expected:** Loading, then moves to Step 3

**Step 3 - New Password:**
- New Password: `password123`
- Confirm Password: `password123`
- Click "Reset Password"
- ⏳ **Expected:** Loading, then moves to Step 4

**Step 4 - Success:**
- ✅ **Expected:** Green checkmark and success message
- Click "Back to Login"
- ✅ **Expected:** Returns to login page

**To Test Validation:**
1. In Step 3, enter different passwords
2. New: `password123`
3. Confirm: `password456`
4. ❌ **Expected:** Red text "Passwords do not match"
5. ❌ **Expected:** Submit button disabled

---

## 🎨 Visual States to Look For

### ✅ Loading State
- Spinning circle icon
- Button text changes ("Signing in...", "Verifying...", etc.)
- Inputs become gray and disabled

### ❌ Error State
- Red banner at top with alert icon
- Input borders turn red
- Clear error message

### ✅ Success State
- Green banner with checkmark
- Brief pause (1 second)
- Automatic navigation

### ⏸️ Disabled State
- Gray button
- Cannot click
- Cursor shows "not allowed"

---

## 🐛 Troubleshooting

### "I don't see the green button"
- Make sure you're on the main app (not already on an auth page)
- Look in the top-right corner next to the user avatar
- On mobile, the button might show just an icon

### "Button doesn't enable"
- **Login:** Make sure both email AND password are filled
- **OTP:** Make sure all 6 digits are entered
- **Reset:** Make sure password is 8+ characters AND both match

### "Navigation doesn't work"
- Check browser console (F12) for errors
- Make sure you're using valid credentials from the demo box
- Try refreshing the page

### "OTP won't auto-advance"
- Only type single digits (0-9)
- Don't type letters
- Click in the first box before starting

### "Can't test resend timer"
- Timer is 60 seconds (1 minute)
- You can use invalid OTP to test error states instead
- Or wait for timer to reach 0:00

---

## 📝 Test Checklist

Use this checklist to verify everything works:

### Login Page
- [ ] Empty form shows disabled button
- [ ] Typing enables button
- [ ] Invalid credentials show error
- [ ] Valid credentials show loading
- [ ] Valid credentials navigate to OTP
- [ ] Password toggle works (eye icon)
- [ ] Demo credentials are visible

### OTP Page
- [ ] 6 empty boxes appear
- [ ] Auto-advance works when typing
- [ ] Paste fills all boxes
- [ ] Valid code shows success
- [ ] Invalid code shows error
- [ ] Expired code shows error
- [ ] Timer counts down from 1:00
- [ ] Resend button enables at 0:00
- [ ] Back to login works

### Forgot Password
- [ ] Step 1: Email validation works
- [ ] Step 1: Valid email advances
- [ ] Step 2: OTP entry works
- [ ] Step 2: Valid OTP advances
- [ ] Step 3: Password too short shows error
- [ ] Step 3: Passwords don't match shows error
- [ ] Step 3: Valid passwords advance
- [ ] Step 4: Success screen appears
- [ ] Step 4: Back to login works
- [ ] Back button works on each step

---

## 🎬 Quick Demo Script (30 seconds)

**Fastest way to see everything:**

1. Click **green button** (top right)
2. Click **"View Demo"** on Login card
3. Type: `planner@company.com` / `planner123`
4. Click **Sign In** → Watch loading
5. Type: `123456` → Watch auto-advance
6. Click **Verify Code** → Watch success
7. ✅ You're in the main app!

**To return to auth demo:**
- Click green button again!

---

## 📞 Need Help?

### Demo Credentials
```
Login:
  planner@company.com / planner123
  owner@company.com / owner123
  supervisor@company.com / supervisor123

OTP:
  Valid: 123456
  Expired: 999999
  Invalid: Any other code
```

### What to Expect
- **Loading:** 1.5 second delay (simulates real API)
- **Timer:** Counts down from 60 seconds
- **Navigation:** Automatic after success
- **Errors:** Clear and descriptive

---

**Ready to test!** Click the **green "View Auth Screens"** button now! 🚀
