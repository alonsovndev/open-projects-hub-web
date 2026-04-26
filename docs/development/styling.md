# Styling

SCSS Modules + Ant Design strategy for building consistent, maintainable UI.

## Core Principle

- **Ant Design** for behavior, structure, and interaction patterns
- **SCSS Modules** for branding, custom layouts, and visual identity

## When to Use Ant Design

### 1. Forms and Validation

```typescript
import { Form, Input, Button } from "antd";

<Form onFinish={handleSubmit}>
  <Form.Item
    label="Email"
    name="email"
    rules={[{ required: true, type: "email" }]}
  >
    <Input />
  </Form.Item>
</Form>
```

### 2. Data Display

```typescript
import { Table, Tag, Badge } from "antd";

<Table dataSource={data} columns={columns} />
```

### 3. Overlays and Feedback

```typescript
import { Modal, Drawer, message, notification } from "antd";

message.success("Login successful");
Modal.confirm({ title: "Delete project?" });
```

### 4. Admin Layouts

```typescript
import { Layout, Menu, Breadcrumb } from "antd";

<Layout>
  <Layout.Sider><Menu items={menuItems} /></Layout.Sider>
  <Layout.Content>{children}</Layout.Content>
</Layout>
```

## When to Use SCSS Modules

### 1. Marketing and Content Sections

```typescript
import styles from "./home-hero.module.scss";

<section className={styles.hero}>
  <h1 className={styles.title}>Welcome</h1>
  <p className={styles.subtitle}>Your project hub</p>
</section>
```

### 2. Custom Branded Layouts

```typescript
import styles from "./custom-card.module.scss";

<div className={styles.brandedCard}>
  <div className={styles.header}>Custom Design</div>
  <div className={styles.content}>{children}</div>
</div>
```

### 3. Static Informational Pages

```text
About page, Privacy Policy, Terms → Use semantic HTML + SCSS
```

## Mixed Approach (Recommended)

Combine both for optimal results:

```typescript
import { Button, Card } from "antd";
import styles from "./dashboard.module.scss";

<div className={styles.dashboard}>
  <Card className={styles.welcomeCard}>
    <h2 className={styles.title}>Welcome</h2>
    <Button type="primary">Get Started</Button>
  </Card>
</div>
```

## SCSS Module Conventions

### File Naming

```text
// Component styles
LoginForm.tsx            → login-form.module.scss
AdminWelcome.tsx         → admin-welcome.module.scss

// Page styles
pages/home/index.tsx     → pages/home/home.module.scss
```

### Class Naming

Use kebab-case for CSS classes:

```scss
// login-form.module.scss
.form-container {
  padding: 24px;
}

.input-field {
  margin-bottom: 16px;
}

.submit-button {
  width: 100%;
}
```

```typescript
// LoginForm.tsx
import styles from "./login-form.module.scss";

<div className={styles.formContainer}>
  <input className={styles.inputField} />
  <button className={styles.submitButton}>Submit</button>
</div>
```

### Multiple Classes

```typescript
// Combine classes
<div className={`${styles.card} ${styles.active}`}>

// With library (classnames)
import cx from "classnames";
<div className={cx(styles.card, { [styles.active]: isActive })}>
```

## Global Styles

### When to Use

- CSS resets
- Typography base styles
- Color variables
- Spacing system

### File Structure

```text
src/styles/
  global.scss              # Main global styles
  _variables.scss          # SCSS variables
  _mixins.scss            # Reusable mixins
```

### Example

```scss
// styles/_variables.scss
$color-primary: #1890ff;
$color-success: #52c41a;
$spacing-unit: 8px;
$border-radius: 4px;

// styles/global.scss
@import "./variables";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
}
```

## Ant Design Customization

### Theme Customization

```typescript
// App.tsx
import { ConfigProvider } from "antd";

<ConfigProvider
  theme={{
    token: {
      colorPrimary: "#1890ff",
      borderRadius: 4,
    },
  }}
>
  <App />
</ConfigProvider>
```

### Component-Level Customization

```typescript
// Use className prop
<Button className={styles.customButton}>Click</Button>

// SCSS
.customButton {
  border-radius: 8px;
  padding: 12px 24px;
}
```

## Decision Framework

### Checklist

Ask these questions before choosing:

1. **Is this data-driven or CRUD-related?** → Ant Design
2. **Does it need validation or complex state?** → Ant Design
3. **Is this marketing or branded content?** → SCSS Modules
4. **Is this a static informational page?** → SCSS Modules

**If 2+ answers favor Ant Design → use Ant Design**  
**Otherwise → use SCSS Modules**

## Anti-Patterns

### ❌ Don't Use Ant Design for Everything

```typescript
// ❌ Bad - Ant Design for static content
<Card>
  <Typography.Title>About Us</Typography.Title>
  <Typography.Paragraph>
    We are a company...
  </Typography.Paragraph>
</Card>

// ✅ Good - Semantic HTML + SCSS
<section className={styles.aboutSection}>
  <h1 className={styles.title}>About Us</h1>
  <p className={styles.description}>We are a company...</p>
</section>
```

### ❌ Don't Reinvent Ant Design

```typescript
// ❌ Bad - Custom form validation
const [emailError, setEmailError] = useState("");
<input onChange={validateEmail} />
{emailError && <span>{emailError}</span>}

// ✅ Good - Use Ant Design
<Form.Item
  name="email"
  rules={[{ type: "email", required: true }]}
>
  <Input />
</Form.Item>
```

### ❌ Don't Deeply Override Ant Design Classes

```scss
// ❌ Bad - Fragile overrides
.ant-btn-primary {
  background: red !important;
}

// ✅ Good - Use theme or wrapper
<ConfigProvider theme={{ token: { colorPrimary: "red" } }}>
  <Button type="primary">Click</Button>
</ConfigProvider>
```

### ❌ Don't Use Inline Styles for Static Values

```typescript
// ❌ Bad
<div style={{ padding: "24px", marginBottom: "16px" }}>

// ✅ Good
<div className={styles.container}>

// SCSS
.container {
  padding: 24px;
  margin-bottom: 16px;
}
```

## Wrapper Components

When Ant Design patterns repeat, create thin wrappers:

```text
src/shared/components/ui/
  app-button/
    AppButton.tsx
    app-button.module.scss
    index.ts
```

```typescript
// AppButton.tsx
import { Button, ButtonProps } from "antd";
import styles from "./app-button.module.scss";

export const AppButton: FC<ButtonProps> = (props) => {
  return <Button {...props} className={styles.button} />;
};
```

## Responsive Design

### Use SCSS Breakpoints

```scss
// _variables.scss
$breakpoint-mobile: 768px;
$breakpoint-tablet: 1024px;

// component.module.scss
.container {
  padding: 24px;

  @media (max-width: $breakpoint-mobile) {
    padding: 16px;
  }
}
```

### Ant Design Grid

```typescript
import { Row, Col } from "antd";

<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8}>Column</Col>
  <Col xs={24} sm={12} md={8}>Column</Col>
</Row>
```

## Best Practices

### ✅ Do

```typescript
// Use semantic HTML structure
<section className={styles.heroSection}>
  <h1 className={styles.title}>Welcome</h1>
</section>

// Use Ant Design for forms
<Form onFinish={onSubmit}>
  <Form.Item name="email" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
</Form>

// Combine both when appropriate
<div className={styles.dashboardLayout}>
  <Card title="Statistics">
    <Statistic value={1234} />
  </Card>
</div>

// Use SCSS variables
.button {
  padding: $spacing-unit * 2;
  border-radius: $border-radius;
}
```

### ❌ Don't

```typescript
// Don't wrap everything in Card
<Card><Card><Card><p>Content</p></Card></Card></Card>

// Don't use inline styles for static values
<div style={{ padding: 24 }}>

// Don't override Ant Design internals
.ant-btn { /* Deep overrides */ }

// Don't recreate Ant Design validation
const [errors, setErrors] = useState({});
```

## Accessibility

Both Ant Design and semantic HTML support accessibility:

```typescript
// Ant Design includes ARIA attributes
<Button type="primary">Submit</Button>
// Renders: <button class="ant-btn ant-btn-primary">Submit</button>

// Add custom labels when needed
<input aria-label="Email address" className={styles.input} />
```

## Related Documentation

- **[Conventions](./conventions.md)** - File naming
- **[Component Design](../architecture/folder-structure.md)** - Component organization
- **[Ant Design Documentation](https://ant.design/)** - Official docs

## Summary

- ✅ Use **Ant Design** for forms, tables, modals, admin UI
- ✅ Use **SCSS Modules** for marketing, branded content, custom layouts
- ✅ **Mix both** for optimal results
- ✅ Use semantic HTML for structure
- ✅ Avoid inline styles for static values
- ✅ Don't deeply override Ant Design classes
- ✅ Create wrappers when patterns repeat
