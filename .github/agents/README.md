# Agent Instructions Directory

This directory contains comprehensive instructions for AI agents working on the azure-pipelines-tasks-terraform repository.

## Files in This Directory

- **instructions.md**: Comprehensive guide for AI agents working on this repository
- **README.md**: This file

## Agent Instructions

The `instructions.md` file provides detailed information about:

- Repository structure and organization
- Build, test, and development workflows
- Code patterns and conventions
- Common development tasks
- Troubleshooting guides
- CI/CD pipeline details
- How to use context7 MCP server for documentation queries

**AI agents should read this file first** when working on this repository to understand the codebase and development practices.

## Using MCP Servers (Optional)

AI agents can optionally use MCP (Model Context Protocol) servers to efficiently query documentation and understand the codebase, if configured. This is especially useful for:

- Querying Terraform documentation
- Looking up Azure DevOps task SDK documentation  
- Understanding Azure Pipelines concepts
- Searching for TypeScript/Node.js best practices
- Finding Cucumber testing documentation

### Configuration Required

**Note**: MCP servers like context7 are not included in this repository. They must be configured separately in your MCP client (e.g., Claude Desktop, IDEs with MCP support).

Common useful MCP servers for this project:
- **context7**: Documentation search and retrieval
- **web_search**: Web search for current information
- **github**: GitHub API access (may already be available)

### Example Queries

If you have MCP servers configured, use them to:

1. **Understand Terraform commands**: Query Terraform CLI documentation for command syntax and options
2. **Azure DevOps Task development**: Look up task SDK methods and patterns
3. **Testing patterns**: Search Cucumber BDD documentation for testing best practices
4. **TypeScript conventions**: Find type definitions and patterns

### Direct Documentation Links

If MCP servers are unavailable, reference documentation directly:
- Azure DevOps Task SDK: https://github.com/microsoft/azure-pipelines-task-lib
- Terraform CLI: https://www.terraform.io/cli
- Cucumber.js: https://cucumber.io/docs/cucumber/

## Benefits for AI Agents

Using these resources provides several benefits:

1. **Faster Onboarding**: Comprehensive instructions reduce time spent exploring
2. **Consistency**: Standardized workflows and patterns across sessions
3. **Better Documentation Access**: Use context7 to query official documentation efficiently
4. **Context**: Stored memories and documentation preserve institutional knowledge
5. **Efficiency**: Pre-documented patterns reduce repetitive exploration

## Maintenance

When updating this repository:

1. **Update instructions.md** if you:
   - Change build/test workflows
   - Add new coding conventions
   - Modify repository structure
   - Discover important patterns
   - Find useful context7 queries or documentation resources

2. **Update memories** using the `store_memory` tool when you:
   - Discover new facts about the codebase
   - Learn about conventions not documented elsewhere
   - Fix issues that might recur

## License

This documentation is part of the azure-pipelines-tasks-terraform project and is licensed under the same MIT license as the main project.
