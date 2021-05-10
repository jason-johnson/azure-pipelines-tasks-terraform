import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithCommandOptions extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder, private readonly commandOptions: string | undefined) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        if(this.commandOptions){
            const args = this.commandOptionsToArgs(this.commandOptions);
            options.concatArgs(args);
        }
        return options;
    }

    private commandOptionsToArgs(commandOptions: string): string[] {
        var args: string[] = [];

        var inQuotes = false;
        var escaped = false;
        var lastCharWasSpace = true;
        var arg = '';

        var append = function (c: string) {
            // we only escape double quotes.
            if (escaped && c !== '"') {
                arg += '\\';
            }

            arg += c;
            escaped = false;
        }

        for (var i = 0; i < commandOptions.length; i++) {
            var c = commandOptions.charAt(i);

            if (c === ' ' && !inQuotes) {
                if (!lastCharWasSpace) {
                    args.push(arg);
                    arg = '';
                }
                lastCharWasSpace = true;
                continue;
            }
            else {
                lastCharWasSpace = false;
            }

            if (c === '"') {
                if (!escaped) {
                    inQuotes = !inQuotes;
                }
                else {
                    append(c);
                }
                continue;
            }

            if (c === "\\" && escaped) {
                append(c);
                continue;
            }

            if (c === "\\" && inQuotes) {
                escaped = true;
                continue;
            }

            append(c);
            lastCharWasSpace = false;
        }

        if (!lastCharWasSpace) {
            args.push(arg.trim());
        }

        return args;
    }

}

declare module "." {
    interface RunnerOptionsBuilder {
        withCommandOptions(this: RunnerOptionsBuilder, commandOptions: string | undefined): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withCommandOptions = function(this: RunnerOptionsBuilder, commandOptions: string | undefined): RunnerOptionsBuilder {
    return new RunWithCommandOptions(this, commandOptions);
}