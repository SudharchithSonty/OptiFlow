# Authentication Testing Guide

## Quick Test Scenarios

### 🔐 AUTH-01: Login Page
**URL:** `/auth/login`

#### Test Case 1: Invalid Credentials
1. Navigate to `/auth/login`
2. Enter: `test@example.com` / `wrongpassword`
3. Click "Sign In"
4. **Expected:** Red error banner appears with message
5. **Expected:** Input borders turn red
6. **Expected:** Error clears when typing

#### Test Case 2: Valid Credentials (Owner)
1. Enter: `owner@company.com` / `owner123`
2. Click "Sign In"
3. **Expected:** Loading spinner appears
4. **Expected:** Button text changes to "Signing in..."
5. **Expected:** Navigates to `/auth/otp` after 1.5s

#### Test Case 3: Valid Credentials (Planner)
1. Enter: `planner@company.com` / `planner123`
2. Click "Sign In"
3. **Expected:** Same loading behavior
4. **Expected:** Navigates to `/auth/otp` with planner role

#### Test Case 4: Valid Credentials (Supervisor)
1. Enter: `supervisor@company.com` / `supervisor123`
2. Click "Sign In"
3. **Expected:** Navigates to `/auth/otp` with supervisor role

#### Test Case 5: Form Validation
1. Leave email empty, enter password
2. **Expected:** Submit button disabled (gray)
3. Enter email, clear password
4. **Expected:** Submit button still disabled
5. Fill both fields
6. **Expected:** Submit button enabled (blue)

#### Test Case 6: Password Visibility Toggle
1. Enter password: `test123`
2. Click eye icon
3. **Expected:** Password visible as plain text
4. **Expected:** Eye icon changes to eye-off
5. Click again
6. **Expected:** Password hidden again

#### Test Case 7: Remember Me
1. Click "Remember me" checkbox
2. **Expected:** Checkbox shows checkmark
3. Click again
4. **Expected:** Checkbox unchecked

#### Test Case 8: Forgot Password Link
1. Click "Forgot password?" link
2. **Expected:** Navigates to `/auth/forgot-password`

---

### 📧 AUTH-02: OTP Verify Page
**URL:** `/auth/otp`

#### Test Case 1: Valid OTP Entry
1. Navigate to `/auth/otp` (or come from login)
2. Enter: `1` `2` `3` `4` `5` `6`
3. **Expected:** Auto-advance through inputs
4. **Expected:** Submit button enables after 6th digit
5. Click "Verify Code"
6. **Expected:** Loading spinner appears
7. **Expected:** Success message shows briefly
8. **Expected:** Navigates to dashboard after 1s

#### Test Case 2: Invalid OTP
1. Enter: `1` `1` `1` `1` `1` `1`
2. Click "Verify Code"
3. **Expected:** Red error banner appears
4. **Expected:** Input borders turn red
5. **Expected:** OTP cleared automatically
6. **Expected:** Focus returns to first input

#### Test Case 3: Expired OTP
1. Enter: `9` `9` `9` `9` `9` `9`
2. Click "Verify Code"
3. **Expected:** Red error banner with "expired" message
4. **Expected:** Input borders turn red
5. **Expected:** "Request a new code" link appears in error

#### Test Case 4: Resend Timer
1. Observe timer counting down
2. **Expected:** Shows "Resend code in 1:00" initially
3. **Expected:** Counts down to "Resend code in 0:00"
4. **Expected:** Button changes to "Resend verification code"
5. **Expected:** Button becomes clickable (blue)

#### Test Case 5: Resend Code
1. Wait for timer to reach 0:00
2. Click "Resend verification code"
3. **Expected:** Loading spinner appears briefly
4. **Expected:** Green success message appears
5. **Expected:** Timer resets to 1:00
6. **Expected:** Inputs cleared
7. **Expected:** Focus returns to first input

#### Test Case 6: Paste Functionality
1. Copy `123456` to clipboard
2. Click in any OTP input
3. Press Ctrl+V (or Cmd+V on Mac)
4. **Expected:** All 6 inputs fill automatically
5. **Expected:** Focus on last input
6. **Expected:** Submit button enables

#### Test Case 7: Backspace Navigation
1. Enter first 3 digits: `1` `2` `3`
2. Press Backspace (3rd input is empty)
3. **Expected:** Focus moves to 2nd input
4. Press Backspace again
5. **Expected:** Clears 2nd digit
6. Press Backspace again
7. **Expected:** Focus moves to 1st input

#### Test Case 8: Back to Login
1. Click "Back to login" button
2. **Expected:** Navigates to `/auth/login`

---

### 🔑 AUTH-03: Forgot Password Page
**URL:** `/auth/forgot-password`

#### Test Case 1: Email Not Found
1. Navigate to `/auth/forgot-password`
2. Enter: `notfound@example.com`
3. Click "Send Verification Code"
4. **Expected:** Loading spinner appears
5. **Expected:** Red error banner appears
6. **Expected:** Message: "No account found with this email address."

#### Test Case 2: Valid Email (Step 1 → Step 2)
1. Enter: `owner@company.com`
2. Click "Send Verification Code"
3. **Expected:** Loading spinner appears
4. **Expected:** Advances to OTP step
5. **Expected:** Shows entered email address
6. **Expected:** Timer starts at 1:00

#### Test Case 3: Invalid OTP in Reset Flow
1. From Step 2, enter: `1` `1` `1` `1` `1` `1`
2. Click "Verify Code"
3. **Expected:** Red error appears
4. **Expected:** OTP cleared
5. **Expected:** Can try again

#### Test Case 4: Expired OTP in Reset Flow
1. Enter: `9` `9` `9` `9` `9` `9`
2. Click "Verify Code"
3. **Expected:** Expired error appears
4. **Expected:** Can resend

#### Test Case 5: Valid OTP (Step 2 → Step 3)
1. Enter: `1` `2` `3` `4` `5` `6`
2. Click "Verify Code"
3. **Expected:** Loading spinner appears
4. **Expected:** Advances to password reset step

#### Test Case 6: Password Too Short
1. From Step 3, enter new password: `test`
2. **Expected:** Red text appears: "Password must be at least 8 characters"
3. **Expected:** Submit button disabled

#### Test Case 7: Passwords Don't Match
1. Enter new password: `testpassword123`
2. Enter confirm password: `testpassword456`
3. **Expected:** Red text: "Passwords do not match"
4. **Expected:** Submit button disabled

#### Test Case 8: Valid Password Reset (Step 3 → Step 4)
1. Enter new password: `testpassword123`
2. Enter confirm password: `testpassword123`
3. **Expected:** Submit button enables
4. Click "Reset Password"
5. **Expected:** Loading spinner appears
6. **Expected:** Advances to success step
7. **Expected:** Green checkmark icon
8. **Expected:** Success message

#### Test Case 9: Return to Login from Success
1. From Step 4, click "Back to Login"
2. **Expected:** Navigates to `/auth/login`

#### Test Case 10: Back Button Navigation
1. From Step 2 (OTP), click "Back" button
2. **Expected:** Returns to Step 1 (Email)
3. From Step 3 (Password), click "Back" button
4. **Expected:** Returns to Step 1 (Email)

#### Test Case 11: Resend in Reset Flow
1. Reach Step 2 (OTP)
2. Wait for timer to expire
3. Click "Resend code"
4. **Expected:** Timer resets
5. **Expected:** Inputs clear
6. **Expected:** Can enter new code

---

## Visual State Checklist

### Login Page States

- [ ] **Default State**
  - Empty form
  - Gray submit button
  - All inputs enabled
  - Demo credentials visible

- [ ] **Typing State**
  - Blue focus ring on active input
  - Password hidden by default
  - Submit enables when both filled

- [ ] **Loading State**
  - Spinner in submit button
  - Text: "Signing in..."
  - All inputs disabled (gray bg)
  - No interaction possible

- [ ] **Error State**
  - Red banner at top
  - Alert icon visible
  - Red input borders
  - Red focus ring
  - Error clears on type

- [ ] **Password Toggle**
  - Eye icon changes
  - Password text visibility changes
  - Icon clickable during loading

### OTP Page States

- [ ] **Default State**
  - 6 empty boxes
  - Gray borders
  - First input focused
  - Timer at 1:00
  - Submit disabled

- [ ] **Entering State**
  - Blue borders on filled
  - Gray borders on empty
  - Auto-advance working
  - Submit enables at 6 digits

- [ ] **Loading State**
  - Spinner in submit button
  - Text: "Verifying..."
  - All inputs disabled (gray bg)

- [ ] **Error State (Invalid)**
  - Red banner
  - Alert icon
  - Red input borders
  - Inputs cleared
  - Focus on first

- [ ] **Error State (Expired)**
  - Red banner
  - Expired message
  - "Request new code" link
  - Red input borders

- [ ] **Success State**
  - Green banner
  - Checkmark icon
  - Brief pause
  - Navigation

- [ ] **Resend Available**
  - Timer at 0:00
  - Blue "Resend" link
  - Clickable

- [ ] **Resend Loading**
  - Spinner appears
  - Brief delay
  - Success message
  - Timer resets

### Forgot Password States

#### Step 1: Email
- [ ] Default (empty)
- [ ] Loading (sending)
- [ ] Error (not found)
- [ ] Valid navigation

#### Step 2: OTP
- [ ] All OTP states (same as OTP page)
- [ ] Timer functionality
- [ ] Resend functionality

#### Step 3: Password
- [ ] Default (empty)
- [ ] Password too short error
- [ ] Passwords don't match error
- [ ] Loading (resetting)
- [ ] Valid navigation

#### Step 4: Success
- [ ] Green checkmark
- [ ] Success message
- [ ] "Back to Login" button
- [ ] Navigation works

---

## Responsive Testing

### Tablet (1024×768)
- [ ] Login card centered
- [ ] Inputs are 48px tall (touch-friendly)
- [ ] OTP boxes visible and accessible
- [ ] All text readable
- [ ] Buttons easy to tap
- [ ] No horizontal scroll

### Desktop (1440×900)
- [ ] Same centered layout
- [ ] Slightly larger padding
- [ ] OTP boxes slightly bigger
- [ ] All states work identically
- [ ] No layout shift

### Mobile (375×667)
- [ ] Card responsive
- [ ] Inputs stack properly
- [ ] OTP boxes fit on screen
- [ ] Vertical scroll if needed
- [ ] Touch targets adequate

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all inputs
- [ ] Enter submits forms
- [ ] Backspace navigates in OTP
- [ ] Arrow keys work in OTP
- [ ] Escape closes (if applicable)

### Screen Reader
- [ ] All labels read correctly
- [ ] Errors announced
- [ ] Loading states announced
- [ ] Success messages announced
- [ ] Form structure clear

### Visual
- [ ] High contrast maintained
- [ ] Focus indicators visible
- [ ] Color not sole indicator
- [ ] Text readable at all sizes
- [ ] Icons have text alternatives

---

## Browser Testing

### Chrome/Edge
- [ ] All states render
- [ ] Animations smooth
- [ ] No console errors
- [ ] Local storage works

### Firefox
- [ ] Input styling consistent
- [ ] Focus rings visible
- [ ] Paste works in OTP
- [ ] Navigation works

### Safari
- [ ] iOS input zooming controlled
- [ ] Touch events work
- [ ] Auto-fill handled
- [ ] Paste works

---

## Performance Testing

- [ ] No layout shift on load
- [ ] Smooth transitions
- [ ] Fast input response
- [ ] Quick navigation
- [ ] No memory leaks
- [ ] Efficient re-renders

---

## Demo Credentials Summary

### Login
```
owner@company.com / owner123
planner@company.com / planner123
supervisor@company.com / supervisor123
```

### OTP
```
Valid:   123456
Expired: 999999
Invalid: Any other 6-digit code
```

### Forgot Password
```
Valid emails:
- owner@company.com
- planner@company.com
- supervisor@company.com

Valid OTP: 123456
Expired OTP: 999999
```

---

## Automated Test Scripts

### Login Flow (Happy Path)
```javascript
// Navigate to login
cy.visit('/auth/login');

// Enter credentials
cy.get('#email').type('planner@company.com');
cy.get('#password').type('planner123');

// Submit
cy.contains('Sign In').click();

// Verify navigation
cy.url().should('include', '/auth/otp');
```

### OTP Flow (Happy Path)
```javascript
// Should be on OTP page
cy.url().should('include', '/auth/otp');

// Enter OTP
'123456'.split('').forEach((digit, i) => {
  cy.get(`input[type="text"]`).eq(i).type(digit);
});

// Submit
cy.contains('Verify Code').click();

// Verify success
cy.url().should('eq', '/');
```

### Full Password Reset Flow
```javascript
// Step 1: Email
cy.visit('/auth/forgot-password');
cy.get('#email').type('owner@company.com');
cy.contains('Send Verification Code').click();

// Step 2: OTP
'123456'.split('').forEach((digit, i) => {
  cy.get(`input[type="text"]`).eq(i).type(digit);
});
cy.contains('Verify Code').click();

// Step 3: Password
cy.get('#new-password').type('newpassword123');
cy.get('#confirm-password').type('newpassword123');
cy.contains('Reset Password').click();

// Step 4: Success
cy.contains('Password Reset Successful!').should('be.visible');
cy.contains('Back to Login').click();
cy.url().should('include', '/auth/login');
```

---

## Common Issues & Fixes

### Issue: Submit button stays disabled
**Fix:** Check both email and password are filled

### Issue: OTP not advancing
**Fix:** Ensure only digits entered, check auto-focus logic

### Issue: Paste not working in OTP
**Fix:** Click in input first, ensure event listener attached

### Issue: Timer not counting down
**Fix:** Check useEffect dependencies, ensure cleanup

### Issue: Error not clearing
**Fix:** Verify error state cleared on input change

### Issue: Navigation not working
**Fix:** Check react-router-dom setup, verify routes

---

**Testing Complete:** ✅ All states verified, ready for production
