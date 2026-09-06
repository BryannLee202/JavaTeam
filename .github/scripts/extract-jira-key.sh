#!/bin/bash
# Extract Jira issue key (JAV-xxx) from branch name or PR title
# Usage: ./extract-jira-key.sh "<branch_name_or_pr_title>"
#
# Examples:
#   ./extract-jira-key.sh "JAV-42"           → JAV-42
#   ./extract-jira-key.sh "JAV-42-login-page" → JAV-42
#   ./extract-jira-key.sh "feat/JAV-123"      → JAV-123
#   ./extract-jira-key.sh "[JAV-99] Fix bug"  → JAV-99

INPUT="$1"

if [ -z "$INPUT" ]; then
  echo ""
  exit 1
fi

# Match JAV-<number> pattern (case insensitive)
JIRA_KEY=$(echo "$INPUT" | grep -oEi 'JAV-[0-9]+' | head -1 | tr '[:lower:]' '[:upper:]')

echo "$JIRA_KEY"
