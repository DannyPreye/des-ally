# DES Assessment: Multi-Tenant Dashboard Analytics Platform

## Project Overview
This project is a demonstration of a **Multi-Tenant Dashboard Analytics Platform** designed with real-time updates, role-based access control (RBAC), and tenant isolation. It was built using **Next.js 14+, TypeScript**, and other modern web technologies.
Dummy data is stored in **LocalStorage** to simulate persistence, while authentication sessions are stored in cookies to mimic a secured login/logout process.

## Technology Stack

- **Frameworks and Libraries:**
  - Next.js 14+
  - TypeScript
  - React Hooks
  - Tailwind CSS (via Shadcn UI)
  - React Tanstack Query

- **Data Handling:**
  - LocalStorage (for mock data)

- **UI Components:**
  - Shadcn UI

---

## Project Structure

```plaintext
/src
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── actions/login.ts
│   ├── [tenant]/
│   │   ├── dashboard/page.tsx
│   │   ├── settings/page.tsx
│   │   └── users/page.tsx
│   │   └── layout.tsx
├── components/
│   ├── providers/
│   │   ├── index.tsx
│   │   └── theme-provider.tsx
│   ├── widgets/
│   │   └── DashboardWidget.tsx
│   └── ui/
├── lib/
|   ├── helpers/
|   |       ├──functions.ts
|   |       └── setupData.ts
│   └── utils.ts
├── middleware.ts
└── hooks/
    ├── useDebounce.ts
    ├── useUserData.ts
    ├── useMobile.ts
    └── useToast.ts
```

---

## Setup Instructions

### Prerequisites
- **Node.js** 18+
- **npm** or **bun**

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/DannyPreye/des-ally.git
   cd multi-tenant-dashboard
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

---

## Authentication Credentials

### Company 1: `company1`
- **Admin:**
  - Email: `admin@example.com`
  - Password: `Admin123!`
- **Manager:**
  - Email: `manager@example.com`
  - Password: `Manager123!`
- **Viewer:**
  - Email: `viewer@example.com`
  - Password: `Viewer123!`

### Company 2: `company2`
- **Admin:**
  - Email: `admin2@example.com`
  - Password: `Admin123!`
- **Manager:**
  - Email: `manager2@example.com`
  - Password: `Manager123!`
- **Viewer:**
  - Email: `viewer2@example.com`
  - Password: `Viewer123!`

---

## Key Architectural Decisions

### Tenant Isolation
- **Dynamic Routing:** Each tenant is isolated through dynamic route paths (e.g., `/[tenant]/dashboard`).
- **Middleware Enforcement:** Tenant access is controlled via custom middleware that validates tenant and user roles.
- **Authentication:** Cookies are used to securely store session tokens.

### Performance Optimization
- **Efficient Data Fetching:**
  - Pagination, sorting, and filtering are supported using **React Tanstack Query**.
- **Real-Time Updates:**
  - Widgets simulate real-time data updates through a polling mechanism.
- **Rendering Strategy:**
  - Server-side rendering (SSR) is used where appropriate for faster initial loads.
  - Client-side rendering (CSR) for interactive components.
- **Minimized Re-renders:**
  - React state management minimizes unnecessary updates.

---

## Security Considerations

- **Role-Based Access Control (RBAC):**
  - Permissions are enforced at the route and component level.
- **Tenant-Specific Validation:**
  - Prevents cross-tenant data leakage through middleware and isolated state management.
- **Authentication Security:**
  - Secure cookie storage for authentication tokens.
- **Cross-Tenant Data Access Prevention:**
  - Scoped APIs and middleware ensure data isolation.

---

## Demo Features

- **Multi-Tenant Examples:**
  - Access dashboards for `company1` and `company2`.
- **User Roles Demonstrated:**
  - Log in as Admin, Manager, or Viewer to explore the role-based access system.
- **Real-Time Updates:**
  - See widgets update dynamically with mock data.
- **Performance Testing Results:**
  - Optimized data-fetching strategies and UI rendering times are demonstrated in the demo.

---

