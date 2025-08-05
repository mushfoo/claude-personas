# Claude Code Personas

A powerful persona management system for Claude AI that enables professional role-based interactions through specialized AI personalities.

## Overview

Claude Code Personas provides a framework for creating, managing, and activating specialized AI personas that give Claude different professional identities and expertise domains. Whether you need a security analyst, UX designer, business strategist, or any other professional role, this system allows you to quickly switch between expertly-crafted personas.

## Features

- **🎭 Global Persona Management**: Access and manage personas from any directory using the `/persona` command
- **🤖 AI-Powered Generation**: Create comprehensive personas with minimal input using advanced AI reasoning
- **🔄 Format Compatibility**: Supports both BMad-style and YAML frontmatter persona formats with automatic conversion
- **📦 Easy Distribution**: Export and import personas for team collaboration
- **🏢 Professional Depth**: Each persona includes core principles, custom commands, and role-specific behaviors
- **🔍 Auto-Discovery**: Automatically finds personas across multiple configured directories

## Quick Start

### Installation

```bash
git clone https://github.com/mushfoo/claude-code-personas.git
cd claude-code-personas
npm install
npm run setup
```

**Dry run** (see what would be installed without making changes):
```bash
npm run setup -- --dry-run
```

**Uninstall** (remove all installed files):
```bash
npm run remove
```

This will:
- Create required directories (`~/.claude/personas/`, `~/.claude/commands/`, `~/.claude/agents/`)
- Install the `/persona` command
- Optionally install example personas for reference

**⚠️ Important:** Restart Claude Code after installation to see new commands.

### Command Structure

Once installed, you'll have access to:
- **Direct persona commands**: `/life-coach`, `/security-analyst`, etc.
- **Action-specific commands**: `/life-coach:goal-setting`, `/security-analyst:threat-model`, etc.
- **Management command**: `/persona` for creating and managing personas

### Basic Usage

#### List Available Personas
```bash
/persona list
# or
/persona ls
```

#### Create a New Persona
```bash
# Interactive mode
/persona create

# Quick mode with role and focus
/persona create "Data Scientist" "machine learning, statistical analysis"
```

#### Activate a Persona
```bash
# Full command
/persona activate security-analyst

# Shorthand
/persona @analyst
```

#### Search for Personas
```bash
/persona search security
```

## Persona Structure

Each persona includes:

- **Professional Identity**: Name, title, and role description
- **Core Principles**: 8-12 guiding principles specific to the role
- **Custom Commands**: Role-specific commands for common tasks
- **Communication Style**: Personality traits and interaction patterns
- **Dependencies**: Supporting tasks, templates, and checklists

### Example Persona

```yaml
agent:
  name: Marcus
  id: security-analyst
  title: Senior Security Analyst
  icon: 🔒
  
persona:
  role: Expert Cybersecurity Professional
  style: vigilant, methodical, analytical
  identity: Security specialist focusing on threat analysis
  
  core_principles:
    - Assume breach - verify all trust relationships
    - Risk-based prioritization drives decisions
    - Evidence-based threat assessment
    
commands:
  - vulnerability-scan: Comprehensive security assessment
  - threat-model: Create detailed threat models
  - security-review: Review architecture and code
```

## Creating Custom Personas

### Using AI Generation

The AI-powered generator creates professional personas with minimal input:

```bash
/persona create "Legal Consultant" "contract law, compliance"
```

The system will:
1. Analyze the professional domain
2. Generate an appropriate name and identity
3. Create 8-12 role-specific principles
4. Design relevant custom commands
5. Set up supporting dependencies

### Manual Creation

You can also create personas manually by following the templates in the `templates/` directory. See the `examples/` directory for two sample personas showing different formats:

- `bmad-style-persona.md` - Full BMad format with comprehensive structure  
- `yaml-frontmatter-persona.md` - Simple YAML frontmatter format (Data Scientist example)

## Directory Structure

```
claude-code-personas/
├── commands/                    # Command implementations
│   ├── persona.md              # Main persona management command
│   ├── generate-persona.md     # AI persona generator
│   └── create-persona.md       # Interactive persona creator
├── docs/                       # Documentation
├── templates/                  # Persona templates
├── examples/                   # Example personas
│   ├── bmad-style-persona.md   # BMad format example
│   └── yaml-frontmatter-persona.md # YAML format example
└── README.md
```

## Advanced Features

### Persona Conversion
Convert between different persona formats:
```bash
# Convert BMad agents
/persona convert bmad

# Convert Claude agents
/persona convert claude
```

### Export/Import
Share personas with your team:
```bash
# Export a persona
/persona export analyst > analyst-persona.yaml

# Import a persona
/persona import analyst-persona.yaml
```

### Project-Specific Personas
Create a `personas/` directory in your project to add project-specific personas that are automatically discovered.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Adding New Personas

1. Create a new persona file in `examples/personas/`
2. Follow the existing format (BMad-style or YAML frontmatter)
3. Test the persona activation
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the BMad agent system
- Built for the Claude AI ecosystem
- Community-driven persona contributions

## Support

For issues, questions, or contributions:
- Open an issue on [GitHub](https://github.com/mushfoo/claude-code-personas/issues)
- Check the [documentation](docs/) for detailed guides
- Join our community discussions

---

**Ready to enhance your Claude experience?** Start with `/persona list` to see available personas or `/persona create` to build your own!