# MCP Server for Azure Pipelines Terraform Extension

This directory contains agent instructions and an MCP (Model Context Protocol) server for efficiently working with the azure-pipelines-tasks-terraform repository.

## Files in This Directory

- **instructions.md**: Comprehensive guide for AI agents working on this repository
- **mcp-server.js**: MCP server implementation with repository-specific tools
- **mcp-config.json**: Configuration file for the MCP server
- **README.md**: This file

## Agent Instructions

The `instructions.md` file provides detailed information about:

- Repository structure and organization
- Build, test, and development workflows
- Code patterns and conventions
- Common development tasks
- Troubleshooting guides
- CI/CD pipeline details

**AI agents should read this file first** when working on this repository to understand the codebase and development practices.

## MCP Server

The MCP server (`mcp-server.js`) provides specialized tools for working with this repository. It requires the MCP SDK to be installed.

### Prerequisites

```bash
npm install @modelcontextprotocol/sdk
```

### Available Tools

The MCP server provides the following tools:

1. **build_terraform_cli** - Build the terraform-cli task (compiles TypeScript)
2. **test_terraform_cli** - Run Cucumber tests for terraform-cli task
   - Optional `coverage` parameter to generate coverage reports
3. **build_all_components** - Build all components (cli, installer, views)
4. **package_extension** - Package the complete extension as .vsix file
5. **list_terraform_commands** - List all implemented Terraform commands
6. **check_ci_status** - Check recent commits and working directory status
7. **get_repository_info** - Get comprehensive repository information

### Configuration

To use the MCP server, configure your MCP client with the settings in `mcp-config.json`. You may need to adjust the path based on your setup.

Example configuration for Claude Desktop or other MCP clients:

```json
{
  "mcpServers": {
    "azure-pipelines-terraform": {
      "command": "node",
      "args": [
        "/absolute/path/to/azure-pipelines-tasks-terraform/.github/agents/mcp-server.js"
      ],
      "description": "Tools for Azure Pipelines Terraform extension development"
    }
  }
}
```

### Usage Examples

Once configured, you can use the MCP tools through your MCP client:

```
# Build the terraform-cli task
Use the build_terraform_cli tool

# Run tests with coverage
Use the test_terraform_cli tool with coverage: true

# Get all available commands
Use the list_terraform_commands tool

# Package the full extension
Use the package_extension tool
```

### Development

The MCP server is implemented in Node.js and uses the official MCP SDK. It provides a stdio-based transport for communication.

To test the server directly:

```bash
node .github/agents/mcp-server.js
```

The server will start and wait for MCP protocol messages on stdin.

## Benefits for AI Agents

Using these resources provides several benefits:

1. **Faster Onboarding**: Comprehensive instructions reduce time spent exploring
2. **Consistency**: Standardized workflows and patterns across sessions
3. **Automation**: MCP tools automate common repository tasks
4. **Context**: Stored memories and documentation preserve institutional knowledge
5. **Efficiency**: Pre-configured tools reduce repetitive command execution

## Maintenance

When updating this repository:

1. **Update instructions.md** if you:
   - Change build/test workflows
   - Add new coding conventions
   - Modify repository structure
   - Discover important patterns

2. **Update mcp-server.js** if you:
   - Add new automated workflows
   - Create helpful development tools
   - Identify repetitive tasks that could be automated

3. **Update memories** using the `store_memory` tool when you:
   - Discover new facts about the codebase
   - Learn about conventions not documented elsewhere
   - Fix issues that might recur

## License

This MCP server and documentation are part of the azure-pipelines-tasks-terraform project and are licensed under the same MIT license as the main project.
