# AppHeader Component

Flexible header component supporting both application and landing page variants.

## Features

✅ **Two Variants** - Default for authenticated pages, landing for marketing pages  
✅ **Reusable Design** - Single component for all header needs  
✅ **Responsive** - Mobile hamburger menu with smooth transitions  
✅ **Sticky Navigation** - Stays at top with blur effect (landing variant)  
✅ **Flexible Props** - Support for identity, actions, and children  
✅ **Modern SaaS Aesthetic** - Clean, minimal, professional  
✅ **External Links** - GitHub repo and Docs with icons  
✅ **Accessible** - Proper ARIA labels and semantic HTML

## Usage

### Default Variant (Application Pages)

```tsx
import { AppHeader } from "@/shared/components/layout/app-header";

// Simple usage - just logo and brand
<AppHeader />

// With actions
<AppHeader
  actions={
    <Button type="link" onClick={handleSignOut}>
      Sign Out
    </Button>
  }
/>

// With identity and actions
<AppHeader
  identity={<Text><strong>{userName}</strong></Text>}
  actions={
    <Button type="link" icon={<LogoutOutlined />} onClick={handleSignOut}>
      Sign Out
    </Button>
  }
/>

// With children (additional content)
<AppHeader>
  <Tag color="blue">Admin</Tag>
</AppHeader>
```

### Landing Variant (Marketing Pages)

```tsx
import { AppHeader } from "@/shared/components/layout/app-header";

// Landing page with navigation and CTAs
<AppHeader variant="landing" />;
```

## Props

| Prop       | Type                     | Default     | Description                                        |
| ---------- | ------------------------ | ----------- | -------------------------------------------------- |
| `variant`  | `"default" \| "landing"` | `"default"` | Header style variant                               |
| `children` | `ReactNode`              | -           | Additional content in brand section                |
| `actions`  | `ReactNode`              | -           | Action buttons/links (right side)                  |
| `identity` | `ReactNode`              | -           | User identity display (right side, before actions) |

## Variants

### Default Variant

**Use for:** Authenticated application pages (dashboard, settings, etc.)

**Layout:**

```
┌─────────────────────────────────────────────────┐
│ [Logo] Brand Name [children]    [identity] [actions] │
└─────────────────────────────────────────────────┘
```

**Features:**

- Flexible content slots (children, identity, actions)
- Static positioning with subtle shadow
- Clean white background

### Landing Variant

**Use for:** Public pages (home, auth screens, legal pages)

**Desktop Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo] Open Projects Hub  Docs  GitHub  Log In [Get Started] │
└──────────────────────────────────────────────────────────────┘
```

**Mobile Layout:**

```
┌────────────────────────────────┐
│ [Logo] Open Projects Hub   [☰] │
└────────────────────────────────┘
│ Docs                           │
│ GitHub                         │
│ [Log In]                       │
│ [Get Started]                  │
└────────────────────────────────┘
```

**Features:**

- Sticky positioning with blur backdrop
- Mobile hamburger menu
- External links to GitHub and Docs

**Navigation:**

- Docs → https://alonsovndev.github.io/open-projects-hub-docs/
- GitHub → https://github.com/orgs/alonsovndev/repositories?q=open-projects

**CTAs:**

- Log In → `/login`
- Get Started → `/role-selection`

## Design Tokens

### Colors

- Background (default): `#ffffff` solid
- Background (landing): `rgba(255, 255, 255, 0.8)` with blur
- Text Primary: `#0f172a`
- Text Secondary: `#475569`
- CTA Blue: `#2563eb` → `#1d4ed8` on hover

### Spacing

- Container max-width: `1280px` (landing)
- Header height: `72px` (desktop landing), `64px` (mobile landing)
- Horizontal padding: `24px` (desktop), `20px` (mobile)

### Typography

- Brand name: `16px` (landing), `1.05rem` (default), `600 weight`
- Nav links: `14px`, `500 weight`
- Buttons: `16px`, varies by button type

## Responsive Behavior

### Desktop (≥769px)

- Full navigation visible
- Horizontal layout
- CTA buttons side by side

### Tablet (769px - 1024px)

- Reduced spacing
- Slightly smaller nav gaps

### Mobile (<769px)

- Hamburger menu
- Vertical navigation
- Full-width CTA buttons
- Collapsible mobile menu

## Examples

### Private Application Layout

```tsx
export const PrivateLayout: FC = ({ children }) => {
  const { user } = useAuth();

  return (
    <div>
      <AppHeader
        identity={
          <Text>
            <strong>{user.name}</strong>
          </Text>
        }
        actions={<Button onClick={handleSignOut}>Sign Out</Button>}
      />
      <main>{children}</main>
    </div>
  );
};
```

### Landing Page

```tsx
export const Home: FC = () => {
  return (
    <div>
      <AppHeader variant="landing" />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
};
```

## Technical Notes

- Uses React hooks (`useState`) for mobile menu state (landing variant only)
- Fully responsive with CSS media queries
- Smooth transitions on all interactive elements
- Optimized for performance with minimal re-renders
- Follows project SCSS module conventions
- Backward compatible - existing usage unaffected
