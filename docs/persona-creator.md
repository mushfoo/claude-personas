# Persona Creator - Interactive Assistant

This is an interactive tool for creating custom Claude personas. When activated, it guides you through a structured process to define all aspects of your new persona.

## Usage

To create a new persona, use the `/create-persona` command. The assistant will:

1. **Collect Information** - Through a series of prompts
2. **Validate Input** - Ensure all data is properly formatted
3. **Generate Configuration** - Create the persona file
4. **Provide Instructions** - Show how to install and use

## Interactive Session Example

```
🎭 **Persona Creator Assistant**

I'll help you create a custom persona for Claude. This process will take about 5-10 minutes.

We'll go through the following steps:
1. Basic Identity (name, role, icon)
2. Behavioral Traits (style, principles)  
3. Commands & Capabilities
4. Dependencies & Resources

Type 'ready' when you're ready to begin, or 'cancel' to exit.

> ready

Great! Let's start with the basics. Please provide:

**Persona Name** (e.g., Sarah, Alex, Morgan):
> Elena

**Command ID** (lowercase, no spaces, e.g., security-analyst):
> data-scientist

**Professional Title** (e.g., Security Analyst, Data Scientist):
> Senior Data Scientist

**Emoji Icon** (paste an emoji that represents this role):
> 📊

**When to Use** (brief description of use cases):
> Use for data analysis, machine learning tasks, statistical modeling, and data visualization

Excellent! Now let's define the persona's behavior and style:

**Role Description** (one line):
> Expert Data Scientist & Machine Learning Specialist

**Communication Style** (3-5 traits, comma-separated):
> analytical, precise, data-driven, collaborative, curious

**Core Identity** (detailed expertise):
> Data science professional specializing in statistical analysis, machine learning, and actionable insights

**Primary Focus** (main objectives):
> Extracting insights from data, building predictive models, creating visualizations, statistical analysis

Now, list 5-10 core principles that guide this persona's behavior.
Enter one principle per line. Type 'done' when finished.

> Data integrity is paramount
> Always validate assumptions with evidence
> Communicate complex findings simply
> Consider ethical implications of data use
> Reproducibility in all analyses
> Question data sources and biases
> Collaborate to understand business context
> done

Great! Now let's define custom commands for this persona.
Format: command-name: description
Type 'done' when finished or 'skip' to use defaults only.

> analyze-dataset: Perform exploratory data analysis on provided dataset
> build-model: Create and train a machine learning model
> visualize-data: Generate appropriate data visualizations
> statistical-test: Run statistical significance tests
> done

Would you like to specify dependencies? (tasks/templates/checklists/data)
Type 'yes' to add dependencies, 'no' to skip, or 'auto' to use common defaults.

> auto

Using default data science dependencies...

✅ Configuration complete! Here's your generated persona:

[Generated configuration shown for review]

Does this look correct? (yes/no/edit)
> yes

✅ Persona created successfully!

📁 File saved to: elena-data-scientist.md

To use your new persona:
1. Place the file in: .claude/commands/your-namespace/agents/data-scientist.md
2. Activate with: /data-scientist
3. View commands with: *help

💡 Tips:
- Test the persona with simple commands first
- Refine principles based on usage
- Add dependencies as needed
- Share with team for consistency
```

## Quick Templates

For faster creation, use these pre-configured templates:

### Security Analyst
```
/create-persona quick:security
```
Creates a security-focused persona with:
- Vulnerability assessment commands
- Security checklists
- Compliance templates

### Data Scientist
```
/create-persona quick:data
```
Creates a data analysis persona with:
- Statistical analysis commands
- ML workflow tasks
- Visualization templates

### Product Manager
```
/create-persona quick:product
```
Creates a product management persona with:
- PRD creation commands
- Roadmap templates
- Stakeholder communication tools

### UX Designer
```
/create-persona quick:creative
```
Creates a design-focused persona with:
- Design review commands
- User research templates
- Prototype feedback tools

## Advanced Options

### Batch Creation
Create multiple personas from a configuration file:
```
/create-persona --batch personas-config.yaml
```

### Clone Existing
Create a new persona based on an existing one:
```
/create-persona --clone analyst --new-id research-analyst
```

### Export/Import
Export persona configuration for sharing:
```
/create-persona --export data-scientist > data-scientist-config.yaml
```

Import from configuration:
```
/create-persona --import data-scientist-config.yaml
```

## Validation Rules

The creator enforces these rules:
- **Command IDs**: Lowercase, alphanumeric with hyphens only
- **Names**: Any valid string
- **Emojis**: Single emoji character only
- **Commands**: No spaces, lowercase, unique within persona
- **Dependencies**: Must follow naming conventions

## Troubleshooting

### Common Issues

1. **"Command ID already exists"**
   - Choose a different ID or use --force to overwrite

2. **"Invalid emoji"**
   - Ensure you're using a single emoji character

3. **"Missing required field"**
   - All basic identity fields are required

4. **"Invalid command format"**
   - Commands must be: lowercase-with-hyphens: description

### Getting Help

- Use `/create-persona --help` for command options
- Check existing personas for examples
- Refer to the persona configuration guide

## Integration with BMad

To integrate with the BMad system:

1. Place generated files in `.claude/commands/BMad/agents/`
2. Add task dependencies to `.bmad-core/tasks/`
3. Add templates to `.bmad-core/templates/`
4. Update the orchestrator if needed

## Best Practices

1. **Start Simple**: Begin with basic commands and add complexity later
2. **Test Thoroughly**: Activate and test each command
3. **Document Well**: Clear descriptions help users understand capabilities
4. **Version Control**: Track persona changes in git
5. **Team Alignment**: Share personas for consistency

## Next Steps

After creating your persona:

1. Test activation: `/{your-command-id}`
2. Verify commands: `*help`
3. Run sample tasks
4. Refine based on usage
5. Share with team

Remember: Personas are living documents. Iterate and improve based on real-world usage!