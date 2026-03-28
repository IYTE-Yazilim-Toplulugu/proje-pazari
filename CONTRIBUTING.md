# Contributing to IYTE Proje Pazarı Frontend

Thank you for contributing to IYTE Proje Pazarı! This document provides guidelines for contributing to the frontend project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Collaborate openly and transparently
- Follow the team's communication guidelines

## 🚀 Getting Started

### 1. Clone the Repository

For team members:

```bash
git clone https://github.com/IYTE-Yazilim-Toplulugu/proje-pazari.git
cd proje-pazari
```

### 2. Set Up Development Environment

Follow the [README.md](README.md) for setup instructions.

### 3. Find an Issue

- Check the [Project Board](https://github.com/orgs/IYTE-Yazilim-Toplulugu/projects/23)
- Look for issues assigned to you or marked as "Ready"
- Comment on the issue to let others know you're working on it

## 💻 Development Workflow

### Branch Naming Convention

Use the format: `feature/issue-{number}-{short-description}`

Examples:
- `feature/issue-1-auth-pages-oauth`
- `feature/issue-2-projects-feed-home`
- `fix/issue-15-login-button-bug`

### Workflow Steps

1. **Create or checkout branch**:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/issue-X-description
   ```

2. **Install dependencies** (if needed):
   ```bash
   pnpm install
   ```

3. **Make changes** following coding standards

4. **Test your changes** in browser

5. **Lint your code**:
   ```bash
   pnpm lint:fix
   ```

6. **Commit** with conventional commit messages

7. **Push** to remote:
   ```bash
   git push origin feature/issue-X-description
   ```

8. **Create Pull Request** on GitHub

## 🎨 Coding Standards

### TypeScript

- **Always use TypeScript** (`.ts`, `.tsx`)
- **Define interfaces/types** for all props and data
- **Use Zod schemas** for API data validation
- **Avoid `any`** - use `unknown` or proper types

### File Naming

- Components: `PascalCase.tsx` (e.g., `ProjectCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Hooks: `use*.ts` (e.g., `useProjects.ts`)
- Types: `PascalCase.ts` (e.g., `Project.ts`)

### Directory Structure

```
components/
├── projects/
│   ├── ProjectCard.tsx       # Component file
│   ├── ProjectCard.test.tsx  # Test file
│   └── index.ts              # Barrel export
```

### Import Order

```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party imports
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

// 3. Internal absolute imports
import { useProjects } from '@/lib/hooks/projectHooks';
import type { Project } from '@/lib/models';

// 4. Relative imports
import './styles.css';
```

## 📦 Component Guidelines

### Functional Components

Always use functional components with TypeScript:

```typescript
interface ProjectCardProps {
  project: Project;
  onSelect?: (id: string) => void;
  className?: string;
}

export default function ProjectCard({
  project,
  onSelect,
  className
}: ProjectCardProps) {
  return (
    <div className={className}>
      <h3>{project.title}</h3>
      {onSelect && (
        <button onClick={() => onSelect(project.id)}>
          Select
        </button>
      )}
    </div>
  );
}
```

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import type { Project } from '@/lib/models';

// 2. Types/Interfaces
interface Props {
  project: Project;
}

// 3. Component
export default function ProjectCard({ project }: Props) {
  // 3a. Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 3b. Handlers
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  // 3c. Effects
  useEffect(() => {
    // Effect logic
  }, [isExpanded]);

  // 3d. Render
  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  );
}
```

### Props Best Practices

- **Destructure props** in function signature
- **Use optional props** with `?`
- **Provide default values** when appropriate
- **Document complex props** with JSDoc

```typescript
interface ButtonProps {
  /** Button text content */
  children: React.ReactNode;
  /** Click event handler */
  onClick: () => void;
  /** Button style variant */
  variant?: 'primary' | 'secondary';
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) {
  // Implementation
}
```

## 🎨 Styling Guidelines

### Tailwind CSS

- **Use utility classes** for styling
- **Follow mobile-first** approach
- **Support dark mode** with `dark:` prefix
- **Use consistent spacing** (4px increments)

```tsx
// Good
<div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    Title
  </h2>
  <p className="text-sm text-gray-600 dark:text-gray-400">
    Description
  </p>
</div>

// Avoid inline styles
<div style={{ padding: '24px' }}>  // ❌
```

### Responsive Design

```tsx
// Mobile-first breakpoints
<div className="
  w-full                  // Mobile
  md:w-1/2               // Tablet (768px+)
  lg:w-1/3               // Desktop (1024px+)
  xl:w-1/4               // Large desktop (1280px+)
">
```

### Common Patterns

```tsx
// Card component
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">

// Button
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">

// Input
<input className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800">
```

## 🔌 API Integration

### Using Custom Hooks

```typescript
// In component
export default function ProjectsPage() {
  const { data, isLoading, error } = useProjects({
    page: 0,
    size: 10
  });

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {data?.projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Creating API Functions

```typescript
// lib/api/project.ts
export async function getProjects(params?: GetProjectsParams) {
  return fetcher({
    url: `/api/v1/projects?${new URLSearchParams(params)}`,
    schema: MProjectListResponse,
  });
}

// lib/hooks/projectHooks.ts
export function useProjects(params?: GetProjectsParams) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => getProjects(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

## 📝 Commit Guidelines

### Conventional Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `ui`: UI/UX changes
- `docs`: Documentation
- `style`: Code formatting (not CSS)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance
- `perf`: Performance improvement

### Examples

```bash
# Feature
git commit -m "feat: add project card component"

# Bug fix
git commit -m "fix: resolve login button alignment issue"

# UI change
git commit -m "ui: update header design with dark mode support"

# With scope
git commit -m "feat(projects): add search and filter functionality"
```

## 🔄 Pull Request Process

### Before Creating a PR

1. **Lint your code**:
   ```bash
   pnpm lint:fix
   ```

2. **Build succeeds**:
   ```bash
   pnpm build
   ```

3. **Test in browser**:
   - Desktop view
   - Mobile view
   - Dark mode
   - Different browsers (Chrome, Firefox, Safari)

4. **Branch is up to date**:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout feature/issue-X-description
   git rebase dev
   ```

### Creating a Pull Request

Use this template:

```markdown
## Description
Brief description of UI changes

Closes #X

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] UI/UX improvement
- [ ] Documentation update

## Changes Made
- Added ProjectCard component
- Implemented responsive grid layout
- Added dark mode support

## Screenshots

### Desktop
![Desktop view](url)

### Mobile
![Mobile view](url)

### Dark Mode
![Dark mode](url)

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari (if available)
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Keyboard navigation
- [ ] Screen reader friendly

## Checklist
- [ ] Code follows style guidelines
- [ ] TypeScript types defined
- [ ] Tailwind classes used correctly
- [ ] Components are reusable
- [ ] No console errors
- [ ] No ESLint warnings
- [ ] Accessible (a11y)
```

### Screenshots Required

Always include screenshots for:
- New UI components
- Layout changes
- Style updates
- Responsive design
- Dark mode support

## ♿ Accessibility Guidelines

- **Use semantic HTML**: `<button>`, `<nav>`, `<main>`, etc.
- **Add ARIA labels** where needed
- **Keyboard navigation** must work
- **Color contrast** meets WCAG AA standards
- **Focus indicators** are visible

```tsx
// Good accessibility
<button
  onClick={handleClick}
  aria-label="Delete project"
  className="focus:ring-2 focus:ring-blue-500"
>
  <TrashIcon aria-hidden="true" />
</button>

// Screen reader text
<span className="sr-only">Loading projects...</span>
```

## 🧪 Testing (Coming Soon)

When we add testing:

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';

test('renders project title', () => {
  const project = { id: '1', title: 'Test Project' };
  render(<ProjectCard project={project} />);

  expect(screen.getByText('Test Project')).toBeInTheDocument();
});
```

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What should happen.

**Screenshots**
Add screenshots to help explain.

**Environment**
- Browser: Chrome 119
- OS: Windows 11
- Screen size: 1920x1080
- Device: Desktop

**Console errors**
Paste any console errors here.
```

## 📱 Responsive Design Checklist

Test on these breakpoints:
- [ ] Mobile: 375px (iPhone SE)
- [ ] Mobile: 390px (iPhone 12/13/14)
- [ ] Tablet: 768px (iPad)
- [ ] Desktop: 1024px
- [ ] Large: 1440px
- [ ] Extra Large: 1920px

## 🎨 Design Tokens

### Colors

```typescript
// Use Tailwind classes
bg-blue-600       // Primary
bg-gray-800       // Dark background
text-gray-900     // Dark text
text-gray-600     // Secondary text

// Dark mode
dark:bg-gray-900  // Dark mode background
dark:text-white   // Dark mode text
```

### Spacing

```
p-1   = 4px
p-2   = 8px
p-4   = 16px
p-6   = 24px
p-8   = 32px
```

## 📞 Questions?

- Open a discussion on GitHub
- Ask in team chat
- Contact: yazilim@iyte.edu.tr

---

Thank you for contributing! 🎉
