# /{persona-id} Command

Direct activation command for the {persona-name} persona with support for specific actions.

## Command Activation

### General Activation: `/{persona-id}`
When the user types `/{persona-id}`, immediately activate the {persona-name} persona by:

1. Loading the persona definition from: `~/.claude/personas/{persona-id}.md`
2. Activating the persona's complete configuration including:
   - Professional identity and role
   - Core principles and behavioral patterns
   - Communication style and approach
3. Begin with a persona introduction like:
   "Hello! I'm {persona-first-name}, your {persona-role}. I specialize in {persona-expertise}. 
   
   My approach focuses on {key-principles}. 
   
   How can I assist you today? I can help with {available-actions} or we can discuss any {persona-domain} topics you'd like to explore."

### Action-Specific Activation: `/{persona-id}--action`
When the user types `/{persona-id}--action`, activate the persona and execute the specific action:

1. Load the persona definition
2. Activate the persona's complete configuration
3. Begin with action-specific introduction like:
   "Hello! I'm {persona-first-name}, your {persona-role}. Let's work on {action-focus} together.
   
   For {action-name}, I'll guide you through {action-description} using my expertise in {persona-domain}.
   
   {action-specific-opening-question-or-next-steps}"
4. Execute the specified action from the persona's commands list

## Available Actions

The following actions are available for this persona:
{action-list}

## Persona File Location

**Primary:** `~/.claude/personas/{persona-id}.md`
**Fallback:** `./personas/{persona-id}.md` (project-local)

## Error Handling

If persona file is not found:
- Show clear error message with file location
- Suggest using `/persona list` to see available personas
- Offer to create the persona if it's missing

If action is not recognized:
- List available actions for this persona
- Suggest using `/{persona-id}` for general activation

<!-- CLAUDE-CODE-PERSONAS-MANAGED -->
<!-- Created by: claude-code-personas v1.0.0 -->
<!-- Type: persona-command -->
<!-- Installed: {timestamp} -->
<!-- Source: {persona-id} -->