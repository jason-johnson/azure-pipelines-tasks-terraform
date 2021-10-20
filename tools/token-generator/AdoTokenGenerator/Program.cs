using Microsoft.VisualStudio.Services.Client;
using Microsoft.VisualStudio.Services.WebApi;
using System;
using CommandLine;
using AdoTokenGenerator.Commands;
using System.Threading;
using System.Threading.Tasks;

namespace AdoTokenGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            MainAsync(args).Wait();
        }

        static async Task MainAsync(string[] args)
        {
            var container = new
            {
                CreateToken = new CreateTokenHandler(),
                CancellationTokenSource = new CancellationTokenSource()
            };

            await Parser.Default.ParseArguments<CreateToken>(args)
                .WithParsedAsync<CreateToken>(command => container.CreateToken.ExecuteAsync(command, container.CancellationTokenSource.Token));
        }
    }
}
