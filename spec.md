# EarnPro

## Current State
EarnPro is a full-stack earning platform with job browsing, applications, dashboard, leaderboard, profile, and admin panel. Users can apply to jobs and track earnings.

## Requested Changes (Diff)

### Add
- **Tasks Page** (`/tasks`): Shows social media tasks users can complete to earn. Two initial tasks:
  1. Facebook Follow: link to https://www.facebook.com/share/14YTD13PWJA/
  2. Telegram Channel Join: link to https://t.me/marketing_group_03
  Each task shows reward amount, a button to open the link, and a "Mark as Done" button that tracks completion in localStorage.
- **Payment Page** (`/payment`): Shows user's current balance, payment method selection (bKash, Nagad, Rocket), account number input, and withdrawal request form. Uses mock/frontend state since no payment gateway integration.
- Nav link for "Tasks" and "Payment" visible to authenticated users.

### Modify
- `Nav.tsx`: Add Tasks and Payment links for authenticated users.
- `App.tsx`: Register new routes.

### Remove
- Nothing.

## Implementation Plan
1. Create `src/frontend/src/pages/TasksPage.tsx` with Facebook and Telegram tasks, localStorage completion tracking.
2. Create `src/frontend/src/pages/PaymentPage.tsx` with balance display, withdrawal form (bKash/Nagad/Rocket), and history.
3. Update `App.tsx` to add routes for `/tasks` and `/payment`.
4. Update `Nav.tsx` to add nav links for Tasks and Payment.
