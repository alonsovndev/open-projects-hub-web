# OpenCode Configuration

This document explains the `opencode.json` configuration file and how to use the custom commit commands.

## What is opencode.json?

`opencode.json` is a configuration file that defines:

- **Custom commands** for common workflows
- **Repository structure** and conventions
- **Agent configurations** and knowledge base
- **Testing setup** and verification workflows
- **Formatting and commit standards**

## 📦 Custom Commands

The repository includes several custom commands to streamline your workflow.

### Commit Commands

#### 1. `/commit` - Interactive Commit (Recommended)

**Full command with all changes:**

This command provides an interactive prompt to create a properly formatted commit.

**What it does:**

1. Prompts you to select commit type (feat, fix, docs, etc.)
2. Optionally asks for a scope (auth, api, dashboard, etc.)
3. Asks for commit description
4. Stages all changes (`git add .`)
5. Creates commit with Conventional Commits format
6. Runs Husky hooks automatically (Prettier formatting)

**Example flow:**

```
→ Select commit type: feat
→ Enter commit scope: auth
→ Enter commit description: add login form validation

✅ Stages all files
✅ Creates commit: "feat(auth): add login form validation"
✅ Prettier formats staged files
✅ Commit message validated
```

#### 2. `/commit-staged` - Commit Staged Files Only

**For when you've already staged specific files:**

This command commits only the files you've already staged with `git add`.

**What it does:**

1. Prompts for commit type
2. Optionally asks for scope
3. Asks for description
4. Commits **only staged files** (no automatic `git add .`)
5. Runs Husky hooks

**Example workflow:**

```bash
# You manually stage specific files
git add src/features/auth/LoginForm.tsx
git add src/features/auth/tests/LoginForm.test.tsx

# Then use the command
/commit-staged

→ Select commit type: test
→ Enter commit scope: auth
→ Enter commit description: add login form tests

✅ Commits only the 2 staged files
```

#### 3. `/quick-commit` - Quick Commit (No Scope)

**Fastest option when you don't need a scope:**

This command skips the scope prompt for faster commits.

**What it does:**

1. Prompts for type (simplified list)
2. Prompts for description
3. Stages all changes
4. Creates commit without scope

**Example:**

```
/quick-commit

→ Commit type: fix
→ Description: resolve null pointer in auth

✅ Creates: "fix: resolve null pointer in auth"
```

### Verification Commands

#### `/verify` - Run All Checks

Runs the complete verification workflow:

1. TypeScript type checking
2. Build verification

```bash
/verify

✅ Type checking...
✅ Building...
✅ All checks passed!
```

#### `/format` - Format All Code

Formats all files in `src/` with Prettier:

```bash
/format

✅ Formatting all files...
✅ 15 files formatted
```

#### `/format-check` - Check Formatting

Checks if files are properly formatted without changing them:

```bash
/format-check

✅ Checking formatting...
⚠️ 3 files need formatting
```

## 🎯 Commit Type Reference

When using commit commands, you'll select from these types:

| Type         | When to Use        | Example                             |
| ------------ | ------------------ | ----------------------------------- |
| **feat**     | New feature        | `feat(auth): add login page`        |
| **fix**      | Bug fix            | `fix(api): handle null response`    |
| **docs**     | Documentation      | `docs: update README`               |
| **style**    | Code formatting    | `style: format with Prettier`       |
| **refactor** | Code restructuring | `refactor(hooks): simplify useAuth` |
| **perf**     | Performance        | `perf: optimize image loading`      |
| **test**     | Tests              | `test(auth): add login tests`       |
| **build**    | Build/dependencies | `build: upgrade React to v19`       |
| **ci**       | CI configuration   | `ci: add GitHub Actions`            |
| **chore**    | Other changes      | `chore: update .gitignore`          |
| **revert**   | Revert commit      | `revert: undo login changes`        |

## 🏷️ Recommended Scopes

When prompted for scope, you can use these common scopes:

- `auth` - Authentication/authorization features
- `api` - API integration
- `dashboard` - Dashboard features
- `viewer` - Viewer features
- `home` - Home page
- `routing` - Routing configuration
- `state` - State management (Redux)
- `ui` - UI components
- `hooks` - Custom React hooks
- `utils` - Utility functions
- `types` - TypeScript types
- `config` - Configuration files

**Or create your own!** Scopes are flexible.

## 📋 Usage Examples

### Example 1: Adding a New Feature

```bash
# You created a new login form component
/commit

→ Select commit type: feat
→ Enter commit scope: auth
→ Enter commit description: add login form component

✅ Commit created: "feat(auth): add login form component"
```

### Example 2: Fixing a Bug

```bash
# You fixed a bug in API handling
/quick-commit

→ Commit type: fix
→ Description: handle 401 unauthorized response

✅ Commit created: "fix: handle 401 unauthorized response"
```

### Example 3: Updating Documentation

```bash
# You updated the README
/quick-commit

→ Commit type: docs
→ Description: add setup instructions

✅ Commit created: "docs: add setup instructions"
```

### Example 4: Staging Specific Files First

```bash
# You only want to commit test files
git add src/features/auth/tests/*.test.tsx

/commit-staged

→ Select commit type: test
→ Enter commit scope: auth
→ Enter commit description: add comprehensive auth tests

✅ Commits only test files
```

### Example 5: Refactoring with Scope

```bash
# You refactored authentication hooks
/commit

→ Select commit type: refactor
→ Enter commit scope: hooks
→ Enter commit description: simplify useAuth implementation

✅ Commit created: "refactor(hooks): simplify useAuth implementation"
```

## 🔄 Complete Workflow

Here's a typical development workflow using the custom commands:

```bash
# 1. Make changes to code
# (edit files in your editor)

# 2. Format code (optional, hooks do this automatically)
/format

# 3. Verify changes (optional, good practice)
/verify

# 4. Create commit interactively
/commit
→ Type: feat
→ Scope: auth
→ Description: add password reset feature

# 5. Check commit was created
git log --oneline
# Output: abc1234 feat(auth): add password reset feature

# 6. Push to remote
git push
```

## ⚡ Quick Reference

```
┌──────────────────────────────────────────────────────┐
│          OPENCODE CUSTOM COMMANDS                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│ COMMIT COMMANDS:                                     │
│   /commit           Interactive commit (all files)   │
│   /commit-staged    Commit staged files only         │
│   /quick-commit     Quick commit (no scope)          │
│                                                      │
│ VERIFICATION:                                        │
│   /verify           Type check + build               │
│   /format           Format all code                  │
│   /format-check     Check formatting                 │
│                                                      │
│ COMMIT FORMAT:                                       │
│   type(scope): description                           │
│                                                      │
│ COMMON TYPES:                                        │
│   feat, fix, docs, test, refactor, build             │
│                                                      │
│ COMMON SCOPES:                                       │
│   auth, api, dashboard, ui, hooks, utils             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## 🔧 Configuration Details

### Repository Structure

```json
{
  "structure": {
    "features": "src/features/<feature>/",
    "shared": "src/shared/",
    "pages": "src/pages/",
    "app": "src/app/",
    "resources": "src/resources/"
  }
}
```

### Naming Conventions

```json
{
  "naming": {
    "components": "PascalCase",
    "componentFolders": "kebab-case",
    "files": "kebab-case",
    "pages": "lowercase",
    "features": "kebab-case"
  }
}
```

### Git Hooks

```json
{
  "hooks": {
    "pre-commit": {
      "enabled": true,
      "description": "Format staged files with Prettier"
    },
    "commit-msg": {
      "enabled": true,
      "description": "Validate commit message follows Conventional Commits"
    }
  }
}
```

### Testing Configuration

```json
{
  "testing": {
    "unit": {
      "framework": "vitest",
      "enabled": false
    },
    "integration": {
      "framework": "react-testing-library",
      "enabled": false
    },
    "e2e": {
      "framework": "playwright",
      "enabled": false
    }
  }
}
```

## 📚 Documentation Links

The `opencode.json` file references all documentation:

- **Architecture**: `.opencode/knowledge/frontend-architecture.md`
- **Preferences**: `.opencode/knowledge/project-preferences.md`
- **Testing Strategy**: `.opencode/knowledge/testing-strategy.md`
- **Quick Reference**: `.opencode/knowledge/quick-reference.md`
- **All Skills**: `.opencode/skills/*.md`

## 🎓 Benefits of Using Custom Commands

1. **Consistency** - All commits follow the same format
2. **Speed** - No need to remember commit message syntax
3. **Validation** - Automatic validation before commit
4. **Formatting** - Automatic code formatting via hooks
5. **Documentation** - Clear workflow for all team members

## 🚀 Getting Started

1. Make sure Husky is installed and active
2. Use `/commit` for your next commit
3. Follow the interactive prompts
4. Let the hooks handle formatting automatically
5. Enjoy clean, consistent commits!

## ❓ FAQ

**Q: What's the difference between `/commit` and `/commit-staged`?**

A: `/commit` stages all changes with `git add .`, then commits. `/commit-staged` commits only files you've already staged manually.

**Q: Can I still use regular `git commit`?**

A: Yes! The hooks work with both custom commands and regular git commands.

**Q: What if I need a commit type not in the list?**

A: The list includes all standard Conventional Commit types. If you need a custom type, use regular `git commit` or modify `opencode.json`.

**Q: Will the hooks slow down my commits?**

A: Hooks only format staged files, so they're very fast (typically < 1 second).

**Q: Can I bypass the interactive prompts?**

A: Yes, use regular git commands: `git commit -m "feat: your message"`

## 🔗 Related Documentation

- **Git Hooks Setup**: `.opencode/skills/git-hooks-husky.md`
- **Conventional Commits**: https://www.conventionalcommits.org/
- **OpenCode**: https://opencode.us/

---

**Need help?** Check the documentation in `.opencode/` or ask your team lead!
