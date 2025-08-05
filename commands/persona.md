# /persona Command

Global persona management system for Claude Code. Creates and manages persona definitions that can be used directly or as Claude Code agents.

## Command Activation

When the user types `/persona` followed by parameters, Claude should:

1. Parse the command parameters to determine the requested action
2. Execute the appropriate persona management operation
3. Provide clear feedback and next steps to the user

## Usage Patterns

```
/persona list                    # List all available personas
/persona ls                      # Short form of list
/persona create                  # AI-powered persona creation (default)
/persona create "Role" "focus"   # Quick AI persona creation
/persona create:interactive      # Step-by-step manual creation
/persona activate <id>           # Activate a specific persona
/persona @<id>                   # Shorthand activation
/persona create-agent <id>       # Enable Claude Code agents integration for persona
/persona remove-agent <id>       # Disable Claude Code agents integration (keeps persona)
/persona create-command <id>     # Create direct /{id} command for persona
/persona create-actions <id>     # Create action commands (/{id}:action) for persona
/persona search <term>           # Search for personas
/persona info <id>               # Show detailed persona information
/persona help                    # Show help information
```

## Core Operations

### 1. List Personas (`/persona list`)

**Action:** Display all available personas from configured directories

**Process:**
1. Search directories for persona files in this order:
   - `~/.claude/personas/` (global personas - primary)
   - `./personas/` (project-local personas)

2. Parse persona metadata from files

3. Display organized list:
```
🎭 Available Personas:

Global Personas:
1. security-analyst - Security & Risk Assessment Expert
2. data-scientist - Data Analysis & ML Expert  
3. health-coach - Health & Wellness Mentor

Project Personas:
4. domain-expert - Healthcare Compliance Specialist

Usage:
• Activate: /persona activate <id> or /persona @<id>
• Create new: /persona create
• Get info: /persona info <id>
```

### 2. Create Persona (`/persona create`)

**AI-Powered Mode (Default):** `/persona create`

1. **Collect All Inputs**: Single form with all required information
   ```
   🤖 Fast AI Persona Creation
   
   Role/Expertise: Financial Advisor
   Focus Areas: retirement planning, portfolio optimization
   Context (optional): fintech, enterprise clients
   
   Configuration:
   ✓ Global scope (accessible from any project)
   ✓ Create direct command (e.g., /financial-advisor)
   ✓ Create action commands (e.g., /financial-advisor:portfolio-review)
   ✗ Enable Claude Code agents integration
   
   [C]reate persona with these settings, [M]odify settings, or [A]bort?
   > C
   ```

2. **AI Generation & Installation**: Create and install everything automatically
   - Generate comprehensive persona using AI reasoning including:
     - **Persona name**: Create an appropriate professional name (e.g., "Sarah" for life coach, "Marcus" for security analyst)
     - **Professional identity**: Role description and expertise areas
     - **Core principles**: 6-8 role-specific guiding principles
     - **Commands**: Available actions and capabilities
     - **Communication style**: Personality and interaction patterns
   - **Important**: Create persona file using `copyFileWithMetadata()` with `type: generated-persona`
   - Generate direct command file (with metadata)
   - Generate action command files (with metadata, if enabled)
   - Create agent wrapper (with metadata, if enabled)

3. **Completion**: Show final summary and usage instructions

**Quick Mode:** `/persona create "Legal Consultant" "contract law, compliance"`
- Skip prompts and use defaults (global scope, AI generation, direct + action commands)

**Interactive Mode:** `/persona create:interactive`
- Step-by-step manual creation with full control over each aspect
- Choose persona format (BMad-style vs YAML frontmatter)
- Manually define principles, commands, and behavioral patterns
- Advanced customization options for experienced users

**Output Example:**
```
✅ Created financial-advisor persona: "Alexandra"
📁 Global: ~/.claude/personas/financial-advisor.md
⚡ Command: /financial-advisor
⚡ Actions: /financial-advisor:portfolio-review, /financial-advisor:retirement-plan, /financial-advisor:risk-assess
🤖 Agent: ~/.claude/agents/financial-advisor.md

⚠️  Restart Claude Code to see new commands

Meet Alexandra, your Professional Financial Advisor specializing in retirement planning and portfolio optimization.

Usage:
• Direct: /financial-advisor
• Actions: /financial-advisor:portfolio-review, /financial-advisor:retirement-plan
• Persona: /persona activate financial-advisor  
• Agent: Use Task tool to launch financial-advisor agent
```

### 3. Activate Persona (`/persona activate <id>`)

**Action:** Switch Claude to operate as the specified persona

**Process:**
1. Search for persona file in discovery order:
   - `~/.claude/personas/<id>.md`
   - `./personas/<id>.md`

2. Parse persona configuration (supports multiple formats)

3. Load persona's instructions, principles, and behavioral patterns

4. Switch Claude's operational mode to embody this persona

5. Greet user as the persona with role-specific introduction

**Example activation:**
```
✅ Activated security-analyst persona

🔒 Hello! I'm Marcus, your Senior Security Analyst. I specialize in threat analysis, 
vulnerability assessment, and risk mitigation. 

My approach focuses on assume-breach mentality, risk-based prioritization, and 
evidence-based assessment.

How can I assist you today? I can help with vulnerability-scan, threat-model, 
security-review, or we can discuss any cybersecurity topics you'd like to explore.
```

**Example action activation** (`/security-analyst:threat-model`):
```
✅ Activated security-analyst persona for threat-model action

🔒 Hello! I'm Marcus, your Senior Security Analyst. Let's work on threat modeling together.

For threat modeling, I'll guide you through systematic identification and analysis of 
potential security threats using my expertise in cybersecurity risk assessment.

What system or application would you like to create a threat model for? I'll help you 
identify assets, threats, vulnerabilities, and appropriate countermeasures.
```

### 4. Enable Claude Code agents integration (`/persona create-agent <id>`)

**Action:** Enable Claude Code agents integration for an existing persona

**Process:**
1. Verify the persona exists in discovery order:
   - `~/.claude/personas/<id>.md`
   - `./personas/<id>.md`

2. Parse persona metadata to extract name and description

3. Prompt for configuration:
   ```
   Enable Claude Code agents integration for 'life-coach' persona?
   
   Agent model preference?
   [1] sonnet (default)
   [2] haiku
   > 1
   
   Agent description: Use this agent when you need coaching on wellness, goal-setting, and personal development
   [Press Enter to use default or customize]
   >
   ```

4. Create agent file: `~/.claude/agents/<id>.md`
   - Use `agent-wrapper-template.md` as base
   - **Important**: Add metadata using `copyFileWithMetadata()` function
   - Mark as `type: agent-wrapper` in metadata
   - Include all standard metadata fields for proper tracking

5. Confirmation and usage instructions

**Output Example:**
```
✅ Enabled Claude Code agents integration for life-coach persona
🤖 Agent: ~/.claude/agents/life-coach.md

⚠️  Restart Claude Code to see new agent

Usage:
• Task tool: Launch life-coach agent for coaching sessions
• Direct: /persona activate life-coach
```

### 5. Disable Claude Code agents integration (`/persona remove-agent <id>`)

**Action:** Disable Claude Code agents integration for a persona while keeping the persona itself

**Process:**
1. Check if agent wrapper exists: `~/.claude/agents/<id>.md`

2. Show confirmation prompt:
   ```
   Found Claude Code agents integration for life-coach persona.
   
   This will disable agents integration but keep the persona.
   You can still use:
   • /persona activate life-coach
   • /life-coach (if command exists)
   
   Disable agents integration? [y/N]
   > y
   ```

3. Delete the agent file: `~/.claude/agents/<id>.md`

4. Provide next steps and alternatives

**Output Example:**
```
✅ Disabled Claude Code agents integration for life-coach persona
🗑️  Deleted: ~/.claude/agents/life-coach.md

⚠️  Restart Claude Code to apply changes

The persona remains available via:
• Direct: /persona activate life-coach
• Command: /life-coach (if created)
```

**Use Cases:**
- Agents integration interferes with direct persona activation
- Want to use persona without agents integration
- Cleaning up unused agents integration
- Switching between agent and non-agent modes

### 6. Create Persona Command (`/persona create-command <id>`)

**Action:** Create a direct command (like `/life-coach`) for an existing persona

**Process:**
1. Verify the persona exists in discovery order:
   - `~/.claude/personas/<id>.md`
   - `./personas/<id>.md`

2. Parse persona metadata to extract name and description

3. Generate command file using template: `templates/persona-command-template.md`

4. Create command file: `~/.claude/commands/<id>.md`

5. Confirmation and usage instructions

**Output Example:**
```
✅ Created direct command for life-coach persona
⚡ Command: ~/.claude/commands/life-coach.md

⚠️  Restart Claude Code to see new command

Usage:
• Direct activation: /life-coach
• Standard activation: /persona activate life-coach
```

### 6. Create Persona Action Commands (`/persona create-actions <id>`)

**Action:** Create individual action commands (like `/life-coach--goal-setting`) for an existing persona

**Process:**
1. Verify the persona exists and parse its command definitions

2. Extract all available actions from the persona's commands section

3. Show available actions and confirm creation:
   ```
   Found 4 actions for life-coach persona:
   • goal-setting: Guide goal-setting and achievement planning
   • life-review: Conduct comprehensive life assessment
   • habit-building: Develop sustainable habit formation
   • problem-solve: Collaborative problem-solving session
   
   Create action commands for all actions? [Y/n]
   > y
   ```

4. Generate individual command files for each action using `persona-action-command-template.md`

5. Create command files: `~/.claude/commands/<persona-id>/<action-id>.md`

**Output Example:**
```
✅ Created 4 action commands for life-coach persona
⚡ Commands: 
   /life-coach:goal-setting
   /life-coach:life-review  
   /life-coach:habit-building
   /life-coach:problem-solve

⚠️  Restart Claude Code to see new commands

Usage:
• Direct actions: Use any command above for specific guidance
• General coaching: /life-coach
```

### 7. Search Personas (`/persona search <term>`)

**Action:** Find personas matching the search term

**Process:**
1. Search through persona names, descriptions, roles, and focus areas
2. Return ranked matches with relevance indicators
3. Show activation commands for found personas

## Persona File Formats

### Standard Persona Format
```markdown
# Persona Name

## Role
Expert description of professional role

## Identity & Style  
- Communication style traits
- Professional approach
- Key behavioral patterns

## Core Principles
1. First guiding principle
2. Second guiding principle
...

## Expertise Areas
- Domain knowledge areas
- Specialized skills
- Industry context

## Instructions
Detailed instructions for how Claude should behave as this persona...
```

### BMad-Style Format (Legacy Support)
- YAML frontmatter with `agent:` and `persona:` sections
- Comprehensive structure with commands and dependencies
- Automatically detected and supported

## File Naming Conventions

**Action Commands with Subdirectories:**
- **Commands use colon syntax**: `/life-coach:goal-setting`
- **Files use subdirectories**: `life-coach/goal-setting.md`
- **Direct commands**: `life-coach.md`
- **Agent files**: `life-coach.md`

The colon syntax provides clear separation between persona and action, with subdirectories organizing the command files.

## Agent Wrapper Generation

When user requests agent integration, create a Claude Code agent file:

**Agent File:** `~/.claude/agents/persona-name.md`

**Content Structure:**
```markdown
---
name: persona-name
description: Use this agent when you need [specific use case description with examples]
model: sonnet
color: blue
---

Load and activate persona from: ~/.claude/personas/persona-name.md

<!-- CLAUDE-CODE-PERSONAS-MANAGED -->
<!-- Created by: claude-code-personas v1.0.0 -->
<!-- Type: agent-wrapper -->
<!-- Installed: 2025-01-05T12:00:00.000Z -->
<!-- Source: persona-name -->
```

**Important**: Always append metadata marker at the end of the file to ensure proper management by the revert system.

**Generated Persona Files** must also include metadata:
```markdown
# Life Coach - Personal Development Expert

[persona content here...]

<!-- CLAUDE-CODE-PERSONAS-MANAGED -->
<!-- Created by: claude-code-personas v1.0.0 -->
<!-- Type: generated-persona -->
<!-- Installed: 2025-01-05T12:00:00.000Z -->
<!-- Source: AI generation -->
```

The agent wrapper:
- Provides Claude Code-specific metadata (model, color, description)
- Contains usage examples for when to use the Task tool
- References the core persona file as single source of truth
- Enables both `/persona activate` and Task tool access

## Directory Structure & Discovery

### Search Order for `/persona list` and `/persona activate`:
1. **Global personas**: `~/.claude/personas/` (primary location)
2. **Project personas**: `./personas/` (project-specific)

### Generation Output Locations:
- **Global scope**: `~/.claude/personas/persona-name.md`
- **Project scope**: `./personas/persona-name.md`
- **Agent wrapper**: `~/.claude/agents/persona-name.md` (if requested)

## Error Handling

- **Persona not found**: Show similar names and available personas
- **Directory missing**: Create required directories automatically
- **Invalid scope**: Default to global with warning
- **Agent wrapper conflicts**: Warn if agent already exists
- **File parsing errors**: Clear error message with format guidance

## Integration Points

### With Claude Code Agents
- Personas can be accessed via Task tool when agent wrapper exists
- Agent description includes clear usage examples and context
- Single persona definition serves both direct activation and agent use

### With AI Generation
- Use reasoning framework from `docs/ai-persona-generator.md`
- Generate professional identity, principles, and behavioral patterns
- Create comprehensive personas matching repository example quality
- **Critical**: All generated personas MUST include metadata using `copyFileWithMetadata()`
- Mark with `type: generated-persona` to distinguish from examples and user-created content

### With Project Workflows
- Project-local personas automatically discovered
- Support for domain-specific expertise within project context
- No conflict between global and project personas (different namespaces)

## Default Behaviors

- **Scope**: Global (accessible from any Claude Code instance)
- **Direct command**: Created automatically (e.g., `/life-coach`)
- **Action commands**: Created automatically (e.g., `/life-coach--goal-setting`)
- **Agents integration**: Not enabled (user must explicitly request)
- **Model**: sonnet (if agents integration requested)
- **Discovery**: Global personas take precedence over project-local for same name