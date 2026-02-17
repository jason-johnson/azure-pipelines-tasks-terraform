#!/usr/bin/env node

/**
 * MCP Server for Azure Pipelines Terraform Extension Repository
 * 
 * This server provides specialized tools for working with the azure-pipelines-tasks-terraform repository,
 * including build automation, test execution, and repository-specific utilities.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const REPO_ROOT = path.resolve(__dirname, '../..');

/**
 * Execute a shell command and return output
 */
function execCommand(command, cwd = REPO_ROOT) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      shell: true,
      cwd: cwd,
      stdio: ['inherit', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, exitCode: 0 });
      } else {
        reject(new Error(`Command failed with exit code ${code}\n${stderr}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * MCP Server implementation
 */
class AzurePipelinesTerraformServer {
  constructor() {
    this.server = new Server(
      {
        name: 'azure-pipelines-terraform-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'build_terraform_cli',
          description: 'Build the terraform-cli task (compiles TypeScript)',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'test_terraform_cli',
          description: 'Run Cucumber tests for terraform-cli task',
          inputSchema: {
            type: 'object',
            properties: {
              coverage: {
                type: 'boolean',
                description: 'Whether to generate code coverage reports',
                default: false,
              },
            },
            required: [],
          },
        },
        {
          name: 'build_all_components',
          description: 'Build all components (terraform-cli, terraform-installer, terraform-plan)',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'package_extension',
          description: 'Package the complete Azure DevOps extension as .vsix file',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'list_terraform_commands',
          description: 'List all implemented Terraform commands in the codebase',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'check_ci_status',
          description: 'Check the status of recent CI builds',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'get_repository_info',
          description: 'Get comprehensive information about the repository structure and status',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
      ],
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'build_terraform_cli':
            return await this.buildTerraformCli();
          
          case 'test_terraform_cli':
            return await this.testTerraformCli(args?.coverage || false);
          
          case 'build_all_components':
            return await this.buildAllComponents();
          
          case 'package_extension':
            return await this.packageExtension();
          
          case 'list_terraform_commands':
            return await this.listTerraformCommands();
          
          case 'check_ci_status':
            return await this.checkCiStatus();
          
          case 'get_repository_info':
            return await this.getRepositoryInfo();
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async buildTerraformCli() {
    const cwd = path.join(REPO_ROOT, 'tasks/terraform-cli');
    const result = await execCommand('npm run build', cwd);
    
    return {
      content: [
        {
          type: 'text',
          text: `✓ Successfully built terraform-cli\n\nOutput:\n${result.stdout}`,
        },
      ],
    };
  }

  async testTerraformCli(withCoverage) {
    const cwd = path.join(REPO_ROOT, 'tasks/terraform-cli');
    const command = withCoverage ? 'npm run test:coverage' : 'npm test';
    const result = await execCommand(command, cwd);
    
    return {
      content: [
        {
          type: 'text',
          text: `✓ Tests completed\n\nOutput:\n${result.stdout}${result.stderr}`,
        },
      ],
    };
  }

  async buildAllComponents() {
    const commands = [
      { name: 'terraform-cli', cmd: 'npm run pack-cli' },
      { name: 'terraform-installer', cmd: 'npm run pack-inst' },
      { name: 'terraform-plan', cmd: 'npm run pack-views' },
    ];

    const results = [];
    for (const { name, cmd } of commands) {
      try {
        await execCommand(cmd);
        results.push(`✓ ${name}: Success`);
      } catch (error) {
        results.push(`✗ ${name}: Failed - ${error.message}`);
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Build Results:\n${results.join('\n')}`,
        },
      ],
    };
  }

  async packageExtension() {
    const result = await execCommand('npm run package:self');
    
    return {
      content: [
        {
          type: 'text',
          text: `✓ Extension packaged successfully\n\nOutput:\n${result.stdout}`,
        },
      ],
    };
  }

  async listTerraformCommands() {
    const commandsDir = path.join(REPO_ROOT, 'tasks/terraform-cli/src/commands');
    const files = await fs.readdir(commandsDir);
    
    const tfCommands = files
      .filter(f => f.startsWith('tf-') && f.endsWith('.ts'))
      .map(f => f.replace('tf-', '').replace('.ts', ''));
    
    const azCommands = files
      .filter(f => f.startsWith('az-') && f.endsWith('.ts'))
      .map(f => f.replace('az-', '').replace('.ts', ''));

    return {
      content: [
        {
          type: 'text',
          text: `Terraform Commands (${tfCommands.length}):\n${tfCommands.map(c => `  - ${c}`).join('\n')}\n\nAzure CLI Commands (${azCommands.length}):\n${azCommands.map(c => `  - ${c}`).join('\n')}`,
        },
      ],
    };
  }

  async checkCiStatus() {
    try {
      const result = await execCommand('git --no-pager log --oneline -10');
      const statusResult = await execCommand('git --no-pager status --short');
      
      return {
        content: [
          {
            type: 'text',
            text: `Recent Commits:\n${result.stdout}\n\nWorking Directory Status:\n${statusResult.stdout || 'Clean'}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error checking CI status: ${error.message}`,
          },
        ],
      };
    }
  }

  async getRepositoryInfo() {
    try {
      const pkgJson = JSON.parse(
        await fs.readFile(path.join(REPO_ROOT, 'package.json'), 'utf-8')
      );
      
      const cliPkgJson = JSON.parse(
        await fs.readFile(path.join(REPO_ROOT, 'tasks/terraform-cli/package.json'), 'utf-8')
      );

      const info = {
        name: pkgJson.name,
        version: pkgJson.version,
        description: pkgJson.description,
        repository: pkgJson.repository?.url,
        components: {
          'terraform-cli': cliPkgJson.version,
        },
        scripts: Object.keys(pkgJson.scripts || {}),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(info, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting repository info: ${error.message}`,
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Azure Pipelines Terraform MCP server running on stdio');
  }
}

// Start the server
const server = new AzurePipelinesTerraformServer();
server.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
