#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import chalk from 'chalk';
import prompts from 'prompts';

const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const PERSONAS_DIR = path.join(CLAUDE_DIR, 'personas');
const COMMANDS_DIR = path.join(CLAUDE_DIR, 'commands');
const AGENTS_DIR = path.join(CLAUDE_DIR, 'agents');
const TEMPLATES_DIR = path.join(CLAUDE_DIR, 'templates');

// Metadata constants
const METADATA_MARKER = '<!-- CLAUDE-CODE-PERSONAS-MANAGED -->';
const APP_VERSION = '1.0.0';

interface InitOptions {
  reinstall?: boolean;
  installExamples?: boolean;
  dryRun?: boolean;
  remove?: boolean;
}

// Utility functions for file metadata
async function copyFileWithMetadata(sourcePath: string, destPath: string, fileType: string): Promise<void> {
  const content = fs.readFileSync(sourcePath, 'utf-8');
  const timestamp = new Date().toISOString();
  
  const metadata = `

${METADATA_MARKER}
<!-- Created by: claude-code-personas v${APP_VERSION} -->
<!-- Type: ${fileType} -->
<!-- Installed: ${timestamp} -->
<!-- Source: ${path.basename(sourcePath)} -->`;

  const contentWithMetadata = content + metadata;
  fs.writeFileSync(destPath, contentWithMetadata, 'utf-8');
}

function isAppManagedFile(filePath: string): boolean {
  try {
    if (!fs.existsSync(filePath)) return false;
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.includes(METADATA_MARKER);
  } catch (error) {
    return false;
  }
}

function getFileMetadata(filePath: string): { type?: string; installed?: string; source?: string } | null {
  try {
    if (!fs.existsSync(filePath) || !isAppManagedFile(filePath)) return null;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Look for metadata at the end of the file (last 10 lines)
    const metadataLines = lines.slice(-10);
    
    const metadata: { type?: string; installed?: string; source?: string } = {};
    
    for (const line of metadataLines) {
      if (line.includes('<!-- Type:')) {
        metadata.type = line.match(/<!-- Type: (.+) -->/)?.[1];
      } else if (line.includes('<!-- Installed:')) {
        metadata.installed = line.match(/<!-- Installed: (.+) -->/)?.[1];
      } else if (line.includes('<!-- Source:')) {
        metadata.source = line.match(/<!-- Source: (.+) -->/)?.[1];
      }
    }
    
    return metadata;
  } catch (error) {
    return null;
  }
}

async function main(): Promise<void> {
  // Check for flags
  const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('-d');
  const isRemove = process.argv.includes('--remove') || process.argv.includes('-r');
  
  if (isRemove) {
    await handleRemove(isDryRun);
    return;
  }
  
  console.log(chalk.cyan('🎭 Claude Code Personas Setup\n'));
  
  if (isDryRun) {
    console.log(chalk.yellow('🔍 DRY RUN MODE - No files will be created\n'));
  }

  // Check if already initialized
  const personaCommandPath = path.join(COMMANDS_DIR, 'persona.md');
  let options: InitOptions = { dryRun: isDryRun };

  if (fs.existsSync(personaCommandPath) && !isDryRun) {
    const { reinit } = await prompts({
      type: 'confirm',
      name: 'reinit',
      message: 'Persona system already initialized. Reinstall?',
      initial: false
    });
    
    if (!reinit) {
      console.log(chalk.yellow('Setup cancelled.'));
      return;
    }
    options.reinstall = true;
  }

  if (isDryRun && fs.existsSync(personaCommandPath)) {
    console.log(chalk.gray('   System already initialized - would offer to reinstall\n'));
  }

  try {
    // Create directories
    console.log(chalk.blue('Creating directories...'));
    createDirectories(options.dryRun);
    
    // Copy command files
    console.log(chalk.blue('Installing commands...'));
    await copyCommands(options.dryRun);
    
    // Copy template files
    console.log(chalk.blue('Installing templates...'));
    await copyTemplates(options.dryRun);
    
    // Ask about example personas (skip in dry-run)
    let installExamples = true;
    if (!isDryRun) {
      const response = await prompts({
        type: 'confirm',
        name: 'installExamples',
        message: 'Install example personas for reference?',
        initial: true
      });
      installExamples = response.installExamples;
    } else {
      console.log(chalk.gray('   Would ask: Install example personas for reference? (default: yes)\n'));
    }
    
    options.installExamples = installExamples;

    if (installExamples) {
      console.log(chalk.blue('Installing example personas...'));
      await copyExamples(options.dryRun);
    }

    // Success message
    showSuccessMessage(options);

  } catch (error) {
    console.error(chalk.red('\n❌ Setup failed:'), (error as Error).message);
    process.exit(1);
  }
}

function createDirectories(dryRun: boolean = false): void {
  const dirs = [CLAUDE_DIR, PERSONAS_DIR, COMMANDS_DIR, AGENTS_DIR, TEMPLATES_DIR];
  
  dirs.forEach(dir => {
    if (dryRun) {
      const exists = fs.existsSync(dir);
      console.log(chalk.gray(`   ${exists ? 'Exists' : 'Would create'}: ${dir}`));
    } else {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(chalk.gray(`   Created: ${dir}`));
      } else {
        console.log(chalk.gray(`   Exists: ${dir}`));
      }
    }
  });
}

async function copyCommands(dryRun: boolean = false): Promise<void> {
  const sourceDir = path.join(__dirname, '..', 'commands');
  
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Commands directory not found: ${sourceDir}`);
  }

  const commandFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));
  
  if (commandFiles.length === 0) {
    throw new Error('No command files found in commands directory');
  }
  
  for (const file of commandFiles) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(COMMANDS_DIR, file);
    
    if (dryRun) {
      console.log(chalk.gray(`   Would install: ${file} → ${destPath}`));
    } else {
      await copyFileWithMetadata(sourcePath, destPath, 'system-command');
      console.log(chalk.gray(`   Installed: ${file}`));
    }
  }
}

async function copyTemplates(dryRun: boolean = false): Promise<void> {
  const sourceDir = path.join(__dirname, '..', 'templates');
  
  if (!fs.existsSync(sourceDir)) {
    console.log(chalk.yellow('   Warning: Templates directory not found, skipping...'));
    return;
  }

  const templateFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));
  
  for (const file of templateFiles) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(TEMPLATES_DIR, file);
    
    if (dryRun) {
      console.log(chalk.gray(`   Would install: ${file} → ${destPath}`));
    } else {
      await copyFileWithMetadata(sourcePath, destPath, 'template');
      console.log(chalk.gray(`   Installed: ${file}`));
    }
  }
}

async function copyExamples(dryRun: boolean = false): Promise<void> {
  const sourceDir = path.join(__dirname, '..', 'examples');
  
  if (!fs.existsSync(sourceDir)) {
    console.log(chalk.yellow('   Warning: Examples directory not found, skipping...'));
    return;
  }

  const exampleFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));
  
  for (const file of exampleFiles) {
    const sourcePath = path.join(sourceDir, file);
    
    // Convert example filenames to persona names
    let destName = file;
    if (file === 'bmad-style-persona.md') {
      destName = 'business-analyst.md';
    } else if (file === 'yaml-frontmatter-persona.md') {
      destName = 'data-scientist.md';
    }
    
    const destPath = path.join(PERSONAS_DIR, destName);
    
    if (dryRun) {
      console.log(chalk.gray(`   Would install: ${file} → ${destPath}`));
    } else {
      await copyFileWithMetadata(sourcePath, destPath, 'example-persona');
      console.log(chalk.gray(`   Installed: ${destName}`));
    }
  }
}

function showSuccessMessage(options: InitOptions): void {
  if (options.dryRun) {
    console.log(chalk.green('\n✅ Dry run completed! Here\'s what would be installed:\n'));
  } else {
    console.log(chalk.green('\n✅ Claude Personas initialized successfully!\n'));
  }
  
  console.log(chalk.cyan('📁 Directories:'));
  console.log(`   ${PERSONAS_DIR}`);
  console.log(`   ${COMMANDS_DIR}`);
  console.log(`   ${AGENTS_DIR}`);
  console.log(`   ${TEMPLATES_DIR}\n`);
  
  if (!options.dryRun) {
    console.log(chalk.yellow('⚠️  Restart Claude Code to see new commands\n'));
    
    console.log(chalk.cyan('🚀 Get started:'));
    console.log(chalk.white('   /persona list') + chalk.gray('     # List available personas'));
    console.log(chalk.white('   /persona create') + chalk.gray('   # Create your first persona'));
    console.log(chalk.white('   /persona help') + chalk.gray('    # Show all commands\n'));
  }

  if (options.installExamples) {
    console.log(chalk.cyan('📖 Example personas:'));
    console.log(`   ${path.join(PERSONAS_DIR, 'business-analyst.md')}`);
    console.log(`   ${path.join(PERSONAS_DIR, 'data-scientist.md')}\n`);
  }

  if (options.dryRun) {
    console.log(chalk.blue('💡 To actually install, run without --dry-run flag'));
  }
}

// Handle process interruption
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\nSetup interrupted.'));
  process.exit(1);
});

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
  console.error(chalk.red('Unexpected error:'), error.message);
  process.exit(1);
});

async function handleRemove(dryRun: boolean = false): Promise<void> {
  console.log(chalk.cyan('🎭 Claude Code Personas Uninstall\n'));
  
  if (dryRun) {
    console.log(chalk.yellow('🔍 DRY RUN MODE - No files will be removed\n'));
  }

  // Check what's installed
  const installedItems = await checkInstallation();
  
  if (installedItems.length === 0) {
    console.log(chalk.yellow('No Claude Personas installation found.'));
    return;
  }

  // Show what would be removed
  console.log(chalk.blue('Found these installed items:\n'));
  installedItems.forEach(item => {
    const status = dryRun ? 'Would remove' : 'Will remove';
    console.log(chalk.gray(`   ${status}: ${item}`));
  });

  if (!dryRun) {
    console.log(); // Empty line
    const { confirmRemove } = await prompts({
      type: 'confirm',
      name: 'confirmRemove',
      message: 'Are you sure you want to remove all Claude Personas files?',
      initial: false
    });

    if (!confirmRemove) {
      console.log(chalk.yellow('Uninstall cancelled.'));
      return;
    }

    console.log(chalk.blue('\nRemoving app-managed files...'));
    console.log(chalk.gray('ℹ️  Only files created by this application will be removed'));
    console.log(chalk.gray('ℹ️  User-created files without metadata will be preserved'));
    
    await removeInstalledFiles(true); // Parameter no longer used but kept for signature
    console.log(chalk.green('\n✅ Claude Personas successfully uninstalled!'));
    
    console.log(chalk.cyan('📁 Any user-created content has been preserved'));
    console.log(chalk.gray('   Files without app metadata remain untouched'));
  } else {
    console.log(chalk.blue('\n💡 To actually uninstall, run without --dry-run flag'));
  }
}

async function checkInstallation(): Promise<string[]> {
  const items: string[] = [];
  
  // Check for app-managed command files
  if (fs.existsSync(COMMANDS_DIR)) {
    const scanCommandFiles = (dir: string, basePath: string = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          // Recursively scan subdirectories for action commands
          scanCommandFiles(fullPath, path.join(basePath, entry.name));
        } else if (entry.name.endsWith('.md')) {
          if (isAppManagedFile(fullPath)) {
            const metadata = getFileMetadata(fullPath);
            const typeInfo = metadata?.type ? ` (${metadata.type})` : '';
            items.push(`${fullPath}${typeInfo}`);
          }
        }
      }
    };
    scanCommandFiles(COMMANDS_DIR);
  }

  // Check for app-managed persona files
  if (fs.existsSync(PERSONAS_DIR)) {
    const personaFiles = fs.readdirSync(PERSONAS_DIR).filter(f => f.endsWith('.md'));
    for (const file of personaFiles) {
      const filePath = path.join(PERSONAS_DIR, file);
      if (isAppManagedFile(filePath)) {
        const metadata = getFileMetadata(filePath);
        const typeInfo = metadata?.type ? ` (${metadata.type})` : '';
        items.push(`${filePath}${typeInfo}`);
      }
    }
  }

  // Check for app-managed agent files
  if (fs.existsSync(AGENTS_DIR)) {
    const agentFiles = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
    for (const file of agentFiles) {
      const filePath = path.join(AGENTS_DIR, file);
      if (isAppManagedFile(filePath)) {
        const metadata = getFileMetadata(filePath);
        const typeInfo = metadata?.type ? ` (${metadata.type})` : '';
        items.push(`${filePath}${typeInfo}`);
      }
    }
  }

  // Check for app-managed template files
  if (fs.existsSync(TEMPLATES_DIR)) {
    const templateFiles = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.md'));
    for (const file of templateFiles) {
      const filePath = path.join(TEMPLATES_DIR, file);
      if (isAppManagedFile(filePath)) {
        const metadata = getFileMetadata(filePath);
        const typeInfo = metadata?.type ? ` (${metadata.type})` : '';
        items.push(`${filePath}${typeInfo}`);
      }
    }
  }

  return items;
}

async function removeInstalledFiles(keepUserPersonas: boolean): Promise<void> {
  // Remove app-managed command files (always use metadata)
  if (fs.existsSync(COMMANDS_DIR)) {
    const removeCommandFiles = (dir: string, basePath: string = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = basePath ? path.join(basePath, entry.name) : entry.name;
        
        if (entry.isDirectory()) {
          // Recursively remove files in subdirectories
          removeCommandFiles(fullPath, relativePath);
          // Check if subdirectory is now empty and remove it
          if (fs.existsSync(fullPath) && fs.readdirSync(fullPath).length === 0) {
            fs.rmdirSync(fullPath);
            console.log(chalk.gray(`   Removed empty: ${relativePath}/`));
          }
        } else if (entry.name.endsWith('.md')) {
          if (isAppManagedFile(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(chalk.gray(`   Removed: ${relativePath}`));
          }
        }
      }
    };
    removeCommandFiles(COMMANDS_DIR);
  }

  // Remove app-managed persona files (always use metadata)
  if (fs.existsSync(PERSONAS_DIR)) {
    const personaFiles = fs.readdirSync(PERSONAS_DIR).filter(f => f.endsWith('.md'));
    for (const file of personaFiles) {
      const filePath = path.join(PERSONAS_DIR, file);
      if (isAppManagedFile(filePath)) {
        fs.unlinkSync(filePath);
        console.log(chalk.gray(`   Removed: ${file}`));
      }
    }
  }

  // Remove app-managed agent files (always use metadata)
  if (fs.existsSync(AGENTS_DIR)) {
    const agentFiles = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
    for (const file of agentFiles) {
      const filePath = path.join(AGENTS_DIR, file);
      if (isAppManagedFile(filePath)) {
        fs.unlinkSync(filePath);
        console.log(chalk.gray(`   Removed: ${file}`));
      }
    }
  }

  // Remove app-managed template files (always use metadata)
  if (fs.existsSync(TEMPLATES_DIR)) {
    const templateFiles = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.md'));
    for (const file of templateFiles) {
      const filePath = path.join(TEMPLATES_DIR, file);
      if (isAppManagedFile(filePath)) {
        fs.unlinkSync(filePath);
        console.log(chalk.gray(`   Removed: ${file}`));
      }
    }
  }

  // Clean up empty directories (only remove if completely empty)
  try {
    if (fs.existsSync(COMMANDS_DIR) && fs.readdirSync(COMMANDS_DIR).length === 0) {
      fs.rmdirSync(COMMANDS_DIR);
      console.log(chalk.gray(`   Removed empty: ${COMMANDS_DIR}/`));
    }
    
    if (fs.existsSync(PERSONAS_DIR) && fs.readdirSync(PERSONAS_DIR).length === 0) {
      fs.rmdirSync(PERSONAS_DIR);
      console.log(chalk.gray(`   Removed empty: ${PERSONAS_DIR}/`));
    }
    
    if (fs.existsSync(AGENTS_DIR) && fs.readdirSync(AGENTS_DIR).length === 0) {
      fs.rmdirSync(AGENTS_DIR);
      console.log(chalk.gray(`   Removed empty: ${AGENTS_DIR}/`));
    }
    
    if (fs.existsSync(TEMPLATES_DIR) && fs.readdirSync(TEMPLATES_DIR).length === 0) {
      fs.rmdirSync(TEMPLATES_DIR);
      console.log(chalk.gray(`   Removed empty: ${TEMPLATES_DIR}/`));
    }

    // Clean up the main .claude directory if it becomes empty
    if (fs.existsSync(CLAUDE_DIR) && fs.readdirSync(CLAUDE_DIR).length === 0) {
      fs.rmdirSync(CLAUDE_DIR);
      console.log(chalk.gray(`   Removed empty: ${CLAUDE_DIR}/`));
    }
  } catch (error) {
    // Directory not empty or other error, that's fine
  }
}

main().catch((error: Error) => {
  console.error(chalk.red('Unexpected error:'), error);
  process.exit(1);
});