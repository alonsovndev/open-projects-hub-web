# Git Hooks with Husky

This project uses [Husky](https://typicode.github.io/husky/) to enforce code quality and commit standards via git hooks.

## What is Husky?

Husky automatically runs scripts before git actions (commits, pushes, etc.) to ensure code quality and consistency.

## Installed Hooks

### 1. Pre-Commit Hook

**Runs before every commit**

Executes `lint-staged` which:

- ✅ Formats code with Prettier (auto-fixes)
- ✅ Only checks staged files (fast and efficient)

**What gets formatted:**

- TypeScript/JavaScript files (`.ts`, `.tsx`, `.js`, `.jsx`)
- JSON files (`.json`)
- CSS/SCSS files (`.css`, `.scss`)
- Markdown files (`.md`)

**Note:** The hook will automatically format your files. If formatting changes are made, you'll need to stage them and commit again.

### 2. Commit Message Hook

**Runs before commit message is saved**

Validates that commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

**Valid types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, semicolons, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

**Examples:**

```bash
git commit -m "feat: add user authentication"
git commit -m "fix(api): handle null response in user endpoint"
git commit -m "docs: update README with setup instructions"
git commit -m "refactor(auth): simplify login logic"
```

**Invalid examples:**

```bash
git commit -m "updated stuff"           # ❌ No type
git commit -m "added feature"           # ❌ No type
git commit -m "feat add feature"        # ❌ Missing colon
git commit -m "feature: add login"      # ❌ Invalid type
```

## Manual Commands

### Format all files

```bash
npm run format
```

Formats all files in the `src/` directory.

### Check formatting (without fixing)

```bash
npm run format:check
```

Checks if files are formatted correctly without modifying them. Useful for CI/CD.

### Type check

```bash
npm run type-check
```

Runs TypeScript type checking without emitting files.

## Bypassing Hooks (⚠️ Use with Caution)

In rare cases, you may need to bypass hooks:

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip commit-msg validation
git commit --no-edit --amend --no-verify
```

**⚠️ WARNING:** Only bypass hooks when absolutely necessary (e.g., emergency hotfixes). The hooks exist to maintain code quality.

## Configuration Files

### `.husky/pre-commit`

Contains the pre-commit hook script that runs `lint-staged`.

### `.husky/commit-msg`

Contains the commit message validation script.

### `.prettierrc`

Prettier configuration for code formatting.

### `.prettierignore`

Files and directories ignored by Prettier.

### `package.json` → `lint-staged`

Configuration for what commands run on staged files.

## Troubleshooting

### Hook doesn't run

**Problem:** Git hooks aren't executing.

**Solution:**

```bash
# Reinstall husky
npm run prepare

# Or manually
npx husky install
```

### Permission denied error

**Problem:** Hook files aren't executable.

**Solution:**

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Prettier conflicts with my editor

**Problem:** Your editor formats code differently than Prettier.

**Solution:**

1. Install the Prettier extension for your editor
2. Enable "Format on Save" in your editor settings
3. Ensure your editor uses the project's `.prettierrc` config

**VS Code:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Commit message keeps failing

**Problem:** Your commit messages don't match the conventional format.

**Solution:**

- Use the format: `type: description`
- Valid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Example: `feat: add login page`

### Pre-commit is slow

**Problem:** `lint-staged` takes too long.

**Reason:** Only staged files are checked. If it's slow, you may have staged many files.

**Solution:**

- Commit smaller changesets
- Format files before staging: `npm run format`

## Future Enhancements

When testing is set up, the pre-commit hook can be extended to:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "prettier --write",
      "npm run test:related" // Run tests for changed files
    ]
  }
}
```

When ESLint is configured:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## Best Practices

1. **Commit often** - Small, focused commits are easier to review and revert
2. **Write clear commit messages** - Follow conventional commits format
3. **Let hooks fix issues** - If formatting fails, let Prettier auto-fix and re-commit
4. **Don't bypass hooks** - They exist to maintain code quality
5. **Keep commits focused** - One feature/fix per commit when possible

## Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [lint-staged](https://github.com/okonet/lint-staged)
- [Prettier](https://prettier.io/)
