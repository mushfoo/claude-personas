# Global Persona Management System

A unified system for creating, managing, and activating personas from anywhere using Claude.

## System Architecture

### Global Command: `/persona`

Single entry point for all persona operations, accessible from any directory.

```
/persona [action] [parameters]
```

### Actions Available:

1. **List**: Show available personas
2. **Create**: Generate new persona using AI
3. **Activate**: Switch to specific persona
4. **Edit**: Modify existing persona
5. **Convert**: Convert sub-agent to persona
6. **Import**: Import persona from file
7. **Export**: Export persona configuration

## Implementation Structure

### Global Configuration File: `~/.claude/personas/config.json`
```json
{
  "personas": {
    "analyst": {
      "name": "Mary",
      "path": "~/.claude/personas/business-analyst.md",
      "tags": ["business", "analysis", "research"],
      "created": "2024-08-05",
      "source": "bmad-import"
    },
    "security-expert": {
      "name": "Marcus", 
      "path": "~/.claude/personas/security-analyst.md",
      "tags": ["security", "compliance", "risk"],
      "created": "2024-08-05",
      "source": "ai-generated"
    }
  },
  "active_persona": null,
  "persona_directories": [
    "~/.claude/personas/",
    "~/.claude/commands/BMad/agents/",
    "./personas/"
  ]
}
```

### Directory Structure:
```
~/.claude/
├── personas/
│   ├── config.json
│   ├── business-analyst.md
│   ├── security-analyst.md
│   ├── data-scientist.md
│   └── templates/
│       ├── generic-persona-template.md
│       └── role-templates/
├── commands/
│   └── persona.md
└── lib/
    └── persona-manager.py
```

## Command Usage Examples

### 1. List Available Personas
```bash
/persona list
# or
/persona ls

# Output:
Available Personas:
1. analyst (Mary) - Business Analyst [business, analysis, research]
2. security-expert (Marcus) - Security Analyst [security, compliance, risk]  
3. dev (James) - Full Stack Developer [development, coding]
4. pm (John) - Product Manager [product, strategy]
5. orchestrator (BMad Orchestrator) - Master Orchestrator [workflow, coordination]

Type '/persona activate <id>' to switch personas
Type '/persona create' to generate a new one
```

### 2. Create New Persona
```bash
/persona create

# AI-guided creation:
🤖✨ AI Persona Generator

What expertise area? (e.g., 'Legal Consultant', 'Marketing Strategist', 'Medical Researcher')
> Financial Advisor

Key focus areas? (e.g., 'investment planning, risk assessment')  
> retirement planning, portfolio optimization

Industry context? (optional)
> independent financial planning

[AI generates comprehensive persona]

✅ Created 'financial-advisor' persona!
Activate with: /persona activate financial-advisor
```

### 3. Activate Persona
```bash
/persona activate analyst
# or
/persona analyst

# Switches to Mary (Business Analyst) persona
# Works from any directory
```

### 4. Convert BMad Sub-Agents
```bash
/persona convert bmad

# Converts all BMad agents to global personas:
Converting BMad agents...
✅ analyst (Mary) → ~/.claude/personas/business-analyst.md
✅ dev (James) → ~/.claude/personas/developer.md  
✅ pm (John) → ~/.claude/personas/product-manager.md
✅ orchestrator → ~/.claude/personas/bmad-orchestrator.md
✅ master → ~/.claude/personas/bmad-master.md

All BMad agents are now available globally!
```

### 5. Quick Actions
```bash
# Quick activation (shorthand)
/persona @analyst      # Activate analyst
/persona @security     # Activate security-expert

# Search personas
/persona search security
# Output: security-expert, security-consultant

# Show persona details
/persona info analyst
# Shows full persona configuration
```

## Global Persona Command Implementation

```yaml
# ~/.claude/commands/persona.md

activation-instructions:
  - Detect action from user input
  - Route to appropriate persona management function
  - Handle global persona registry operations
  - Provide unified interface regardless of current directory

core-functions:
  list-personas:
    - Scan configured persona directories
    - Read persona registry
    - Display formatted list with metadata
    - Support filtering by tags or search

  create-persona:
    - Launch AI-powered persona generator
    - Guide user through minimal input collection
    - Generate comprehensive persona using reasoning
    - Save to global persona directory
    - Register in global config

  activate-persona:
    - Validate persona exists
    - Load persona configuration
    - Switch Claude to persona mode
    - Update active persona in config

  convert-subagents:
    - Scan BMad agents directory
    - Convert each agent to global persona format
    - Preserve all functionality and dependencies
    - Register in global system

  import-export:
    - Export persona as portable configuration
    - Import personas from other systems
    - Support sharing between team members
```

## Persona Registry Management

### Auto-Discovery
```python
def discover_personas():
    """Automatically find personas in configured directories"""
    personas = {}
    
    for directory in config['persona_directories']:
        for file in glob(f"{directory}/*.md"):
            if is_persona_file(file):
                persona_info = extract_persona_info(file)
                personas[persona_info['id']] = persona_info
    
    return personas
```

### Registry Sync
```python
def sync_registry():
    """Keep registry in sync with filesystem"""
    discovered = discover_personas()
    config['personas'].update(discovered)
    save_config()
```

## Cross-Platform Compatibility

### Windows
```
%USERPROFILE%\.claude\personas\
```

### macOS/Linux  
```
~/.claude/personas/
```

### Project-Local Personas
```
./personas/          # Project-specific personas
./.claude/personas/  # Legacy support
```

## Integration with Existing Systems

### BMad Compatibility
- Seamlessly import all existing BMad agents
- Preserve all functionality and commands
- Maintain backward compatibility
- Support both `/agent` and `/persona` access

### IDE Integration
- Works with any Claude-enabled IDE
- Consistent experience across editors
- Support for project-specific persona sets

## Advanced Features

### Persona Templates
```bash
/persona template legal
# Creates legal professional template

/persona template healthcare  
# Creates healthcare professional template
```

### Team Sharing
```bash
/persona export analyst > analyst-config.yaml
/persona import analyst-config.yaml
```

### Persona Inheritance
```bash
/persona create --based-on analyst --specialization "market-research"
# Creates market research analyst based on general analyst
```

### Context-Aware Activation
```bash
/persona auto
# Automatically suggests relevant personas based on:
# - Current directory/project type
# - Recent file activity  
# - Git repository context
```

## Usage Workflow

1. **Initial Setup**: `/persona convert bmad` (import existing agents)
2. **Daily Usage**: `/persona activate <id>` or `/persona @<id>`
3. **Create New**: `/persona create` (AI-guided generation)
4. **Management**: `/persona list`, `/persona info <id>`
5. **Sharing**: `/persona export <id>`, `/persona import <file>`

This system provides:
- ✅ Global accessibility from any directory
- ✅ Unified management interface
- ✅ AI-powered persona creation
- ✅ Backward compatibility with BMad
- ✅ Easy sharing and collaboration
- ✅ Support for any expertise domain