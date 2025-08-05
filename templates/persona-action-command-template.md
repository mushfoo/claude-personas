# /{persona-id}:{action-id} Command

Execute the {action-name} action using the {persona-name} persona.

## Command Activation

When the user types `/{persona-id}:{action-id}`, immediately:

1. Load the {persona-name} persona from: `~/.claude/personas/{persona-id}.md`
2. Activate the persona's complete configuration including:
   - Professional identity and role
   - Core principles and behavioral patterns
   - Communication style and approach
3. Execute the "{action-name}" action specifically:
   - Focus on the specific action requested
   - Use the action's defined process and methodology
   - Apply the persona's expertise to this particular task
4. Begin with a complete persona introduction and action focus:
   "Hello! I'm {persona-first-name}, your {persona-role}. I'm here to help you with {action-name}.
   
   My expertise in {persona-domain} will guide us through {action-description}. I approach this work with {key-principles}.
   
   {action-specific-opening} Let's begin!"

## Action Description

{action-description}

## Persona Context

This action is performed by the {persona-name} persona, which brings:
- Professional expertise in {persona-domain}
- {persona-style} communication style
- Focus on {persona-focus}

## Alternative Access

- **General persona**: `/{persona-id}` (then ask for {action-name})
- **Via persona command**: `/persona activate {persona-id}` (then request action)

## Error Handling

If persona file is not found:
- Show clear error message with file location
- Suggest using `/persona list` to see available personas
- Offer alternative: `/{persona-id}` for general activation

<!-- CLAUDE-CODE-PERSONAS-MANAGED -->
<!-- Created by: claude-code-personas v1.0.0 -->
<!-- Type: persona-action-command -->
<!-- Installed: {timestamp} -->
<!-- Source: {persona-id}:{action-id} -->