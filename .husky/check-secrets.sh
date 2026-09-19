#!/bin/bash

# Pre-commit hook to check for sensitive data in staged files
# Prevents accidentally committing secrets, API keys, tokens, etc.

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Patterns to check for sensitive data
SENSITIVE_PATTERNS=(
  "password\s*=\s*['\"].*['\"]"
  "api[_-]?key\s*=\s*['\"].*['\"]"
  "secret[_-]?key\s*=\s*['\"].*['\"]"
  "token\s*=\s*['\"].*['\"]"
  "bearer\s+[a-zA-Z0-9_-]{20,}"
  "private[_-]?key"
  "BEGIN RSA PRIVATE KEY"
  "BEGIN PRIVATE KEY"
  "AWS_SECRET_ACCESS_KEY"
  "GITHUB_TOKEN"
)

# Files to always block
BLOCKED_FILES=(
  ".env"
  ".env.local"
  ".env.development.local"
  ".env.test.local"
  ".env.production.local"
  "secrets.json"
  "credentials.json"
  "*.pem"
  "*.key"
  "*.p12"
  "*.pfx"
)

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

# Check for blocked files
echo "Checking for blocked files..."
BLOCKED_FOUND=false

for FILE in $STAGED_FILES; do
  BASENAME=$(basename "$FILE")
  
  for BLOCKED in "${BLOCKED_FILES[@]}"; do
    if [[ "$BASENAME" == $BLOCKED ]]; then
      echo -e "${RED}ERROR: Blocked file detected: $FILE${NC}"
      echo "This file should not be committed. Add it to .gitignore."
      BLOCKED_FOUND=true
    fi
  done
done

if [ "$BLOCKED_FOUND" = true ]; then
  echo -e "${RED}Commit aborted due to blocked files.${NC}"
  exit 1
fi

# Check staged files for sensitive patterns
echo "Scanning for sensitive data patterns..."
SECRETS_FOUND=false

for FILE in $STAGED_FILES; do
  # Skip binary files and node_modules
  if [[ "$FILE" == *"node_modules"* ]] || [[ "$FILE" == *".lock" ]]; then
    continue
  fi
  
  # Skip if file doesn't exist (deleted)
  if [ ! -f "$FILE" ]; then
    continue
  fi
  
  # Check each pattern
  for PATTERN in "${SENSITIVE_PATTERNS[@]}"; do
    MATCHES=$(git diff --cached "$FILE" | grep -iE "$PATTERN" || true)
    
    if [ -n "$MATCHES" ]; then
      echo -e "${RED}WARNING: Possible sensitive data in $FILE${NC}"
      echo -e "${YELLOW}Pattern matched: $PATTERN${NC}"
      echo "$MATCHES"
      SECRETS_FOUND=true
    fi
  done
done

if [ "$SECRETS_FOUND" = true ]; then
  echo ""
  echo -e "${RED}Sensitive data detected in staged files!${NC}"
  echo "Please review the warnings above and remove any secrets before committing."
  echo ""
  echo "If this is a false positive, you can:"
  echo "  1. Use environment variables instead of hardcoded values"
  echo "  2. Add the file to .gitignore if it's local config"
  echo "  3. Use SKIP=secrets to bypass this check (not recommended)"
  echo ""
  exit 1
fi

echo "✓ No sensitive data detected"
exit 0
