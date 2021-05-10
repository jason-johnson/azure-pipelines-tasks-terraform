export class TerraformError extends Error {
    constructor(name: string, message: string, stack?: string | undefined) {
        super(message);
        this.name = name;
        this.stack = stack;
    }
}

export class TerraformAggregateError extends Error {
    public readonly errors: TerraformError[];
    public readonly stderr: string;
    public readonly exitCode: number;
    constructor(command: string, stderr: string, exitCode: number) {
        let stderrEscaped: string = stderr
        .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
        let lines: string[] = stderrEscaped
            .split('\n\n')
            .map(line => line.replace('\nError:', 'Error:'))
            .map(line => line.replace('\n', ' '))
            .filter(line => line && line !== "");
        let message: string = lines
            .filter(line => line.startsWith('Error:'))
            .map(line => line.replace('Error:', ''))
            .join(" | ");
        super(message);
        this.stderr = stderrEscaped;
        this.name = `Terraform command '${command}' failed with exit code '${exitCode}'.`;
        this.errors = [];
        this.exitCode = exitCode;
        lines.forEach((line, i) => {
            if (line.startsWith('Error:')) {
                let name: string = line.replace('Error: ', '');
                let message: string = lines[(i + 1)];
                this.errors.push(new TerraformError(name, message, this.stack));
            }
        });      
    }
}