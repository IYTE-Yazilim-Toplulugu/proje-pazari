# 🎓 IYTE Proje Pazarı - Frontend

A modern Next.js frontend application for IYTE Project Marketplace, where students collaborate on projects.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.8-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8.svg)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## 🛠 Tech Stack

- **Framework**: Next.js 16.0.8 (App Router)
- **React**: 19.2.1
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query (React Query) v5
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Native Fetch with custom wrapper
- **Authentication**: JWT (httpOnly cookies)
- **UI Components**: shadcn/ui (to be integrated)

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20** or higher ([Download](https://nodejs.org/))
- **pnpm** (recommended) or npm/yarn
- **Git** ([Download](https://git-scm.com/))

### Install pnpm

```bash
npm install -g pnpm
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/IYTE-Yazilim-Toplulugu/proje-pazari.git
cd proje-pazari
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

The `.env` file is gitignored and will never be committed. See the [Environment Variables](#environment-variables) section for details.

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
proje-pazari/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   └── forgot-password/ # Password reset
│   ├── projects/            # Projects pages
│   │   ├── page.tsx         # Projects feed
│   │   └── [id]/            # Project details
│   ├── profile/             # User profile
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── providers.tsx        # Context providers
├── components/              # React components
│   ├── shared/              # Shared components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Button.tsx
│   ├── projects/            # Project components
│   ├── profile/             # Profile components
│   └── ui/                  # shadcn/ui components
├── lib/                     # Core utilities
│   ├── api/                 # API integration
│   │   ├── base.ts          # HTTP client
│   │   ├── auth.ts          # Auth endpoints
│   │   ├── project.ts       # Project endpoints
│   │   └── user.ts          # User endpoints
│   ├── hooks/               # Custom React hooks
│   │   ├── authHooks.ts     # Auth hooks
│   │   ├── projectHooks.ts  # Project hooks
│   │   └── userHooks.ts     # User hooks
│   ├── models/              # Zod schemas & types
│   │   ├── Auth.ts
│   │   ├── User.ts
│   │   └── Project.ts
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx
│   └── utils/               # Utility functions
├── public/                  # Static assets
│   ├── logo/                # IYTE logos
│   └── favicon.ico
└── package.json
```

### Key Directories

- **`app/`**: Next.js 14+ App Router pages and layouts
- **`components/`**: Reusable React components
- **`lib/api/`**: API integration layer with typed endpoints
- **`lib/hooks/`**: Custom hooks using React Query
- **`lib/models/`**: Zod schemas for type-safe validation

## 👥 Development Workflow

### Working on an Issue

1. **Find your assigned issue** on the [Project Board](https://github.com/orgs/IYTE-Yazilim-Toplulugu/projects/23)

2. **Checkout the feature branch**:
   ```bash
   git fetch origin
   git checkout feature/issue-X-task-name
   ```

3. **Install dependencies** (if needed):
   ```bash
   pnpm install
   ```

4. **Run the dev server**:
   ```bash
   pnpm dev
   ```

5. **Make your changes** following the coding standards

6. **Test your changes**:
   - Manually test in the browser
   - Check responsive design
   - Verify dark mode works
   - Test accessibility (keyboard navigation)

7. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add project card component"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `ui:` - UI changes
   - `docs:` - Documentation
   - `refactor:` - Code refactoring
   - `style:` - Formatting changes
   - `test:` - Adding tests

8. **Push to remote**:
   ```bash
   git push origin feature/issue-X-task-name
   ```

9. **Create a Pull Request**:
   - Base branch: `dev`
   - Compare branch: `feature/issue-X-task-name`
   - Link to the issue: `Closes #X`
   - Add screenshots for UI changes
   - Request reviews from team members

## 📜 Available Scripts

```bash
# Development
pnpm dev          # Start dev server (port 3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues

# Testing (to be added)
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Generate coverage report

# Utilities
pnpm clean        # Clean build artifacts
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` to get started:

```bash
cp .env.example .env
```

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | URL of the Spring Boot backend, no trailing slash (e.g. `http://localhost:8080`) | ✅ Yes |
| `NODE_ENV` | `development` or `production` | ✅ Yes |
| `NEXT_PUBLIC_SITE_URL` | Frontend base URL (e.g. `http://localhost:3000`) | No |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | No |

**Note**: `.env` is gitignored — never commit it. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all files (`.ts`, `.tsx`)
- Define types/interfaces for all props and data structures
- Use Zod schemas for runtime validation
- Avoid `any` type - use `unknown` or proper typing

### React Components

```tsx
// Use arrow functions for components
export default function ProjectCard({ project }: ProjectCardProps) {
  // Component logic
}

// Define prop types
interface ProjectCardProps {
  project: Project;
  onSelect?: (id: string) => void;
}

// Use React Query for data fetching
const { data, isLoading } = useProjects({ page: 0, size: 10 });
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Support dark mode with `dark:` prefix
- Use consistent spacing (4px base: `p-1`, `p-2`, `p-4`, etc.)

```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    Title
  </h2>
</div>
```

### File Organization

- One component per file
- Use index files for barrel exports
- Group related components in folders
- Keep components small and focused

### API Integration

Use the established pattern in `lib/api/`:

```typescript
// Define API function
export async function getProjects(params?: GetProjectsParams) {
  return fetcher({
    url: `/api/v1/projects?${new URLSearchParams(params)}`,
    schema: MProjectListResponse,
  });
}

// Create custom hook
export function useProjects(params?: GetProjectsParams) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => getProjects(params),
  });
}

// Use in component
const { data, isLoading, error } = useProjects({ page: 0, size: 10 });
```

## 🧪 Testing (Coming Soon)

We'll be adding:
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Visual Regression**: Chromatic (optional)

## 🐛 Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 pnpm dev
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

### Type Errors

Ensure you've installed the missing dependency:

```bash
pnpm add react-hook-form @hookform/resolvers
```

## 📖 Additional Resources

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Learn Tutorial](https://nextjs.org/learn)

### React Query
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- [React Query Tutorial](https://tanstack.com/query/latest/docs/framework/react/quick-start)

### Tailwind CSS
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 🎯 Features Roadmap

- [x] Authentication (Login, Register, JWT)
- [x] OAuth Integration (Google, Meta, Microsoft)
- [ ] Projects Feed Page
- [ ] Project Details & Application
- [ ] User Profile Management
- [ ] Email Verification (@std.iyte.edu.tr)
- [ ] Email Notifications
- [ ] Search & Filters
- [ ] Dark Mode
- [ ] Mobile Responsive
- [ ] SEO Optimization
- [ ] Performance Optimization

## 👨‍💻 Team

- **Web Team**: DrHalley, UlasGokkaya, neonid0, Xerkara, AliKemalMiloglu, bdurgut06, ygt-ernsy, ErkanArikan

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: yazilim@iyte.edu.tr
- Project Board: https://github.com/orgs/IYTE-Yazilim-Toplulugu/projects/23

---

Made with ❤️ by IYTE Yazılım Topluluğu
