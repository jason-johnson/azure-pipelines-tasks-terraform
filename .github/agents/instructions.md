# Agent Instructions for azure-pipelines-tasks-terraform Repository

## Project Overview

This repository contains Azure Pipelines extension tasks for installing and executing Terraform commands from Azure DevOps pipelines. It provides a guided abstraction for deploying infrastructure with Terraform.

**Key Components:**
- **terraform-cli** (`tasks/terraform-cli/`): Main task for executing Terraform CLI commands
- **terraform-installer** (`tasks/terraform-installer/`): Task for installing Terraform on build agents
- **terraform-plan view** (`views/terraform-plan/`): UI view for inspecting Terraform plans in pipeline summaries

## Repository Structure

```
azure-pipelines-tasks-terraform/
├── tasks/
│   ├── terraform-cli/          # Main Terraform CLI task (75+ TypeScript files, ~2200 lines)
│   │   ├── src/
│   │   │   ├── commands/       # Terraform and Azure CLI command implementations
│   │   │   ├── runners/        # Command execution and builders
│   │   │   ├── authentication/ # Azure authentication handling
│   │   │   ├── backends/       # Terraform backend configurations (azurerm, local)
│   │   │   ├── providers/      # Cloud provider integrations
│   │   │   ├── tests/          # Cucumber BDD tests (.feature files)
│   │   │   └── index.ts        # Task entry point
│   │   ├── package.json        # Dependencies and scripts
│   │   └── task.json          # Azure DevOps task definition
│   └── terraform-installer/    # Terraform installer task
├── views/
│   └── terraform-plan/         # React-based plan visualization view
├── .github/
│   └── workflows/
│       ├── ci.yml             # GitHub Actions CI pipeline
│       └── codeql-analysis.yml # Security scanning
├── pipelines/                  # Azure DevOps pipelines (integration tests, publishing)
├── templates/                  # Example Terraform templates for testing
├── scripts/                    # Build and deployment scripts
└── _test-agent/               # Local test environment (temp/tools directories)
```

## Build, Test, and Development Workflows

### Prerequisites

- **Node.js**: Version 20.x or 22.x (Cucumber requires Node 20+)
- **npm**: Comes with Node.js
- **Python**: Required for some native dependencies
- **tfx-cli**: For packaging extensions (`npm install -g tfx-cli`)

### Quick Start Commands

```bash
# Install all dependencies for a component
cd tasks/terraform-cli && npm ci

# Build TypeScript
npm run build  # Compiles TypeScript using tsc --build

# Run tests
npm test       # Runs Cucumber BDD tests (133 scenarios, 1347 steps)

# Run tests with coverage
npm run test:coverage  # Generates coverage reports in .tests/coverage/

# Package for distribution
npm run pack   # Creates .dist/ directory with production-ready files
```

### Full Build Process (from root)

```bash
# Package all components (installs deps, builds, packages)
npm run pack-cli    # Packages terraform-cli task
npm run pack-inst   # Packages terraform-installer task
npm run pack-views  # Packages terraform-plan view

# Package everything and create extension
npm run package:self  # Requires self.json with publisher info
```

### Running Tasks Locally

To run terraform-cli task locally for development:

1. Create `.env` file in `tasks/terraform-cli/` (see `tasks/terraform-cli/README.md` for template)
2. Configure Azure DevOps connection details and credentials
3. Set `INPUT_COMMAND` to the Terraform command you want to test
4. Run: `npm start` (uses ts-node with dotenv)

**Important:** The `_test-agent/` directory provides `temp/` and `tools/` directories for local testing.

## CI/CD Pipeline Architecture

### GitHub Actions (`.github/workflows/ci.yml`)
- **Triggers**: PRs and non-main branches
- **Node versions**: 20.x and 22.x matrix
- **Jobs**:
  1. `build-terraform-cli`: Build, test with coverage, package
  2. `build-terraform-installer`: Build and package
  3. `build-terraform-plan-view`: Build, test with coverage, package
  4. `package-extension`: Combine artifacts and create .vsix extension
- **Outputs**: Test results, code coverage (Codecov), packaged artifacts
- **Note**: Artifacts don't persist across workflow re-runs (use continue-on-error for resilience)

### Azure DevOps Pipelines (`pipelines/`)
- **Purpose**: Integration testing and marketplace publishing
- **Reason**: Requires actual Azure DevOps runtime environment and service connections
- **DO NOT** migrate these to GitHub Actions

## Code Organization and Patterns

### Command Pattern Architecture

All Terraform commands follow a consistent pattern:

```typescript
export class TerraformCommand implements ICommand {
    constructor(/* dependencies */) {}
    
    exec(): Promise<CommandResponse> {
        // Command execution logic
    }
}
```

**Command locations:** `tasks/terraform-cli/src/commands/`
- `tf-*.ts`: Terraform commands (apply, plan, init, destroy, etc.)
- `az-*.ts`: Azure CLI commands (for backend setup)

### Adding New Terraform Commands

1. **Create command file**: `tasks/terraform-cli/src/commands/tf-<command>.ts`
2. **Implement ICommand interface**: Follow pattern from existing commands
3. **Use builders**: Leverage `RunWithTerraform` builder for simple commands
4. **Add tests**: Create `.feature` file in `tasks/terraform-cli/src/tests/features/`
5. **Export**: Add to `tasks/terraform-cli/src/commands/index.ts`

**Example reference:** `tf-validate.ts` and `tf-fmt.ts` for simple commands

### Testing with Cucumber

- **Framework**: Cucumber BDD with TypeScript (cucumber-tsflow)
- **Test files**: `tasks/terraform-cli/src/tests/features/*.feature`
- **Step definitions**: `tasks/terraform-cli/src/tests/steps/`
- **Run tests**: `npm test` or `npm run test:coverage`
- **Test reports**: `.tests/results.xml` (JUnit format)

## Dependencies and Version Management

### Critical Dependency Requirements

- **@cucumber/cucumber**: v12+ (requires Node 20+)
- **cucumber-tsflow**: v4.6.1+ (for Cucumber v12 compatibility)
- **azure-pipelines-task-lib**: Task SDK for Azure DevOps
- **applicationinsights**: Telemetry collection

### Views Dependencies

- **sass**: Required as peer dependency for sass-loader in terraform-plan view
- Always check peer dependencies when updating webpack/loaders

### Updating Dependencies

1. Check compatibility with Node 20/22
2. Test thoroughly with `npm test`
3. Update both package.json and package-lock.json
4. Verify CI passes on both Node versions

## Common Development Tasks

### Adding a New Terraform Command

```bash
# 1. Create command file
cd tasks/terraform-cli/src/commands
# Create tf-<command>.ts using existing patterns

# 2. Create test feature
cd ../tests/features
# Create terraform-<command>.feature

# 3. Build and test
cd ../../..  # Back to terraform-cli/
npm run build
npm test

# 4. Verify coverage
npm run test:coverage
```

### Fixing CI Failures

1. **Check workflow runs**: Use GitHub MCP tools (`list_workflow_runs`, `get_job_logs`)
2. **Common issues**:
   - Node version incompatibility (ensure Node 20+)
   - Missing peer dependencies (check npm install logs)
   - Artifact download failures (re-run workflow if needed)
3. **Test locally first**: Match CI Node version with `nvm use 20`

### Debugging Task Execution

1. Set up `.env` file with proper Azure DevOps credentials
2. Use `npm start` to run with debugger attached
3. Check VS Code launch configurations in `.vscode/launch.json`
4. Review logs in `_test-agent/temp/` directory

## Security and Quality

### Security Scanning

- **CodeQL**: Runs on PRs (`.github/workflows/codeql-analysis.yml`)
- **Dependencies**: Check for vulnerabilities with `npm audit`
- **Secrets**: Never commit credentials; use environment variables

### Code Quality

- **TypeScript**: Strict type checking enabled
- **Test coverage**: Aim for high coverage on new code
- **BDD tests**: Write descriptive scenarios for all commands

## Publishing and Deployment

### Extension Packaging

1. **Set version**: Uses GitVersion for semantic versioning
2. **Package components**: `npm run pack-cli`, `pack-inst`, `pack-views`
3. **Create extension**: Uses tfx-cli to create .vsix file
4. **Publish**: Azure DevOps pipelines handle marketplace publishing

### Marketplace Publishers

- **Current owner**: @jason-johnson (JasonBJohnson publisher)
- **Previous publisher**: Deprecated, no longer maintained

## Coding Conventions and Best Practices

### TypeScript Conventions

- Use explicit types for function parameters and return values
- Prefer `async/await` over promise chains
- Use dependency injection for testability
- Follow existing file and class naming patterns

### Testing Conventions

- Write BDD scenarios in Gherkin syntax
- Use descriptive scenario names
- Test both success and failure paths
- Mock Azure DevOps task library for unit tests

### Git Workflow

- Create feature branches from `main`
- Use descriptive commit messages
- Ensure CI passes before merging
- Squash commits when merging PRs

## Troubleshooting Common Issues

### "Cannot find module sass"
- **Solution**: Add `sass` to devDependencies in views/terraform-plan/package.json
- **Reason**: sass-loader requires sass as peer dependency

### "Cucumber requires Node 20+"
- **Solution**: Use Node 20.x or 22.x
- **Reason**: @cucumber/cucumber v12+ dropped Node 18 support

### Artifact Download Failures in CI
- **Solution**: Add `continue-on-error: true` and conditional checks
- **Reason**: GitHub Actions workflow re-runs don't preserve artifacts from previous attempts

### Build Failures After Dependency Updates
- **Check**: Peer dependency warnings in npm install
- **Verify**: Both Node 20 and 22 in CI matrix
- **Test**: Run full test suite locally

## Key Files and Their Purposes

- **task.json**: Azure DevOps task manifest (inputs, outputs, execution)
- **package.json**: npm dependencies and scripts
- **tsconfig.json**: TypeScript compiler configuration
- **cucumber.js**: Cucumber test runner configuration
- **.nycrc.yml**: Code coverage configuration
- **vss-extension.json**: Azure DevOps extension manifest

## Useful Commands Reference

```bash
# Install dependencies
npm ci                    # Clean install (respects package-lock.json)
npm install               # Install with potential updates

# Development
npm run build            # Compile TypeScript
npm start                # Run task locally with .env config

# Testing
npm test                 # Run all Cucumber tests
npm run test:coverage    # Generate coverage reports
npm run test:report      # Generate JUnit XML report

# Packaging
npm run pack             # Package task for distribution
tfx extension create     # Create extension .vsix file

# Git operations
git --no-pager status    # Check status without pager
git --no-pager diff      # View changes without pager
git --no-pager log --oneline -20  # View recent commits
```

## Environment Variables for Local Testing

Key environment variables (see `tasks/terraform-cli/README.md` for full list):

```bash
AGENT_TOOLSDIRECTORY=./../_test-agent/tools
AGENT_TEMPDIRECTORY=./../_test-agent/temp
SYSTEM_TEAMFOUNDATIONCOLLECTIONURI=<azure-devops-org-url>
SYSTEM_TEAMPROJECT=<project-name>
INPUT_COMMAND=<terraform-command>
INPUT_WORKINGDIRECTORY=<path-to-terraform-files>
INPUT_BACKENDTYPE=local  # or 'azurerm'
```

## Using MCP Servers for Documentation (Optional)

**Note**: MCP servers like context7 can greatly enhance AI agent efficiency by providing access to documentation, but they must be configured separately by the user/administrator.

If you have access to MCP servers (such as context7, web search, or documentation servers), use them to efficiently query documentation instead of guessing. This is particularly helpful for:

### Recommended MCP Server Uses

1. **Terraform Command Details**: Query official Terraform documentation for command syntax, options, and behavior
2. **Azure DevOps APIs**: Look up task library methods, service connection patterns, and pipeline variables
3. **Testing Patterns**: Search Cucumber.js documentation for BDD testing best practices
4. **TypeScript/Node.js**: Find type definitions, async patterns, and language features
5. **Dependency Documentation**: Query npm package documentation for libraries used in this project

### Example Queries (if MCP available)

- "What are the options for terraform plan command?" → Query Terraform CLI docs
- "How do I use azure-pipelines-task-lib to get input values?" → Query Azure DevOps SDK docs
- "What's the syntax for Cucumber step definitions?" → Query Cucumber.js docs
- "How do I implement async/await error handling in TypeScript?" → Query TypeScript docs

### Configuring MCP Servers

MCP servers are not part of this repository. They must be configured in your MCP client (e.g., Claude Desktop, IDEs with MCP support). Common useful MCP servers for this project:

- **context7**: Documentation search and retrieval
- **web_search**: Search the web for current information
- **github**: GitHub API access (already available in Copilot environment)

Consult your MCP client documentation for setup instructions.

### Key Documentation Resources (Direct Links)

If MCP servers are not available, reference these directly:

- **Azure DevOps Task SDK**: https://github.com/microsoft/azure-pipelines-task-lib
- **Terraform CLI**: https://www.terraform.io/cli
- **Cucumber.js**: https://cucumber.io/docs/cucumber/
- **Extension Development**: https://learn.microsoft.com/en-us/azure/devops/extend/

## Stored Repository Memories to Reference

When working on this repository, be aware of these key stored facts:

1. **Build commands**: Use `npm run build` in terraform-cli to compile
2. **Test commands**: Use `npm test` in terraform-cli to verify changes
3. **Package commands**: Use `npm run pack-cli/pack-inst/pack-views` for full builds
4. **Node version requirement**: Node 20 or 22 required for Cucumber
5. **Dependency compatibility**: cucumber-tsflow 4.6.1+ supports @cucumber/cucumber v12
6. **CI/CD split**: GitHub Actions for PRs, Azure DevOps for integration tests and publishing
7. **Artifact handling**: GitHub Actions workflow re-runs don't preserve artifacts
8. **sass dependency**: Required as peer dependency for terraform-plan view

Remember to store new facts you discover using the `store_memory` tool to help future agents working on this repository!

## Tips for Efficient Work

1. **Read this file first** - Understanding the repository structure and conventions saves time
2. **Use context7** - Query documentation instead of guessing or searching through files
3. **Follow patterns** - Look at existing commands before creating new ones
4. **Test early** - Build and test after each change to catch errors quickly
5. **Store discoveries** - Use `store_memory` to preserve important findings
6. **Reference memories** - Check stored facts before exploring the repository
