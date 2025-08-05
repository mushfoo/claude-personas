# Persona Configuration Guide

This guide explains how to create custom personas using the generic template framework extracted from the BMad Claude commands.

## Understanding the Persona System

The persona system allows you to create specialized AI agents with specific roles, behaviors, and capabilities. Each persona is activated via a command and maintains its character throughout the interaction.

## Configuration Parameters

### 1. Basic Identity (`agent` section)
- **name**: The persona's human name (e.g., "Mary", "John", "Sarah")
- **id**: Unique identifier, typically lowercase (e.g., "analyst", "developer", "designer")
- **title**: Professional role title (e.g., "Business Analyst", "Senior Developer")
- **icon**: Emoji that represents the persona (e.g., 📊, 💻, 🎨)
- **whenToUse**: Clear description of when to activate this persona
- **customization**: Special overrides or null (advanced feature)

### 2. Behavioral Traits (`persona` section)
- **role**: One-line description of expertise
- **style**: Comma-separated personality traits (e.g., "analytical, creative, detail-oriented")
- **identity**: Detailed expertise description
- **focus**: Primary objectives and responsibilities
- **core_principles**: List of 5-10 guiding principles that shape behavior

### 3. Command System
Commands are actions the persona can perform. Standard commands include:
- `*help`: Lists available commands
- `*exit`: Deactivates the persona
- Custom commands that map to specific tasks or workflows

### 4. Dependencies
External resources loaded on-demand:
- **tasks**: Executable workflows (.md files)
- **templates**: Document templates (.yaml files)  
- **checklists**: Validation lists (.md files)
- **data**: Reference materials (.md files)

## Creating a Custom Persona

### Step 1: Define the Role
Decide on:
- Professional domain (e.g., security, design, data science)
- Primary responsibilities
- Key skills and expertise

### Step 2: Customize the Template
1. Replace all `{placeholder}` values
2. Define 5-10 core principles
3. Create persona-specific commands
4. List required dependencies

### Step 3: Set Behavioral Traits
Choose traits that align with the role:
- **Analytical roles**: "data-driven, systematic, precise"
- **Creative roles**: "innovative, exploratory, collaborative"
- **Technical roles**: "pragmatic, detail-oriented, solution-focused"

### Step 4: Design Commands
Map common tasks to commands:
```yaml
- analyze-security: Run security analysis workflow
- create-report: Generate report using template
- review-code: Execute code review checklist
```

## Example: Security Analyst Persona

```yaml
agent:
  name: Sarah
  id: security-analyst
  title: Security Analyst
  icon: 🔒
  whenToUse: Use for security assessments, vulnerability analysis, and compliance reviews
  
persona:
  role: Cybersecurity Expert & Risk Assessment Specialist
  style: Vigilant, methodical, risk-aware, detail-oriented
  identity: Security professional specializing in threat analysis and compliance
  focus: Identifying vulnerabilities, ensuring compliance, risk mitigation
  core_principles:
    - Security-first mindset in all assessments
    - Assume breach - verify everything
    - Risk-based prioritization
    - Clear documentation of findings
    - Proactive threat identification
```

## Best Practices

1. **Keep personas focused**: Each persona should have a clear, distinct role
2. **Use consistent naming**: Follow the existing pattern for commands and files
3. **Document dependencies**: Ensure all referenced files exist or will be created
4. **Test thoroughly**: Verify the persona behaves as expected
5. **Iterate based on usage**: Refine principles and commands based on real use

## Integration Tips

- Store personas in `.claude/commands/{namespace}/agents/`
- Follow the existing file naming convention: `{role}.md`
- Create supporting tasks/templates in appropriate directories
- Consider creating a master orchestrator for complex workflows

## Advanced Features

### Custom Activation Rules
Add specific rules in `activation-instructions` for complex behaviors:
```yaml
- CRITICAL: Load security standards from data/security-standards.md on activation
- CRITICAL: Always verify user authorization before executing sensitive commands
```

### Conditional Commands
Some commands can have complex execution rules:
```yaml
- penetration-test:
    - Prerequisites: User must confirm scope and authorization
    - Execution: Run task pentest-workflow.md with template pentest-report.yaml
    - Post-execution: Generate findings report and remediation plan
```

### Inter-Persona Communication
For complex projects, personas can hand off to each other:
```yaml
- handoff-to-dev: Package findings and transfer to developer persona
```