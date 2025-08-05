# Installation Guide

## Quick Installation

```bash
git clone https://github.com/mushfoo/claude-code-personas.git
cd claude-code-personas
npm install
npm run setup
```

**Dry run option** (preview what would be installed):
```bash
npm run setup -- --dry-run
```

**Uninstall option** (remove installed files):
```bash
npm run remove
```

**With dry-run to preview:**
```bash
npm run remove -- --dry-run
```

This interactive installer will:
1. Create required directories in your `~/.claude/` folder
2. Install the `/persona` command
3. Optionally install example personas
4. Set up the complete persona system

### 2. Directory Structure Created
```
~/.claude/
├── personas/           # Global personas
├── commands/           # Persona management commands
│   └── persona.md
└── agents/            # Claude Code agent wrappers (optional)
```

## Verification

Test the installation:
```bash
/persona list
```

You should see available personas (if examples were installed) or a message about creating your first persona.

## Project-Specific Setup

To use project-specific personas, create a personas directory in any project:
```bash
mkdir personas
```

Any `.md` files in this directory will be automatically discovered by `/persona list`.

## Troubleshooting

### Command Not Found
If `/persona` command is not recognized:
1. Check that `~/.claude/commands/persona.md` exists
2. Restart your Claude Code session
3. Verify Claude Code has access to custom commands

### No Personas Found
If `/persona list` shows no personas:
1. Check that `~/.claude/personas/` directory exists
2. Try reinstalling: `npm run setup`
3. Create your first persona: `/persona create`

### Permission Issues
Ensure you have write permissions to:
- `~/.claude/` directory
- Your project's `personas/` directory (if using project-local personas)

## Uninstallation

**Recommended method:**
```bash
npm run remove
```

This will:
- Show you what would be removed
- Ask for confirmation
- Give you the option to keep user-created personas and agents
- Only remove system-installed files

**Manual removal** (if needed):
```bash
rm -rf ~/.claude/personas
rm -rf ~/.claude/agents  # if you created agent wrappers
rm ~/.claude/commands/persona.md
```

## Next Steps

1. **List available personas**: `/persona list`
2. **Create your first persona**: `/persona create`
3. **Activate a persona**: `/persona activate <id>`
4. **Get help**: `/persona help`
5. **Read the documentation** in the `docs/` directory