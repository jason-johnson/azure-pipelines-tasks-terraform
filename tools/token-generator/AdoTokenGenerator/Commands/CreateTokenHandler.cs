using Microsoft.VisualStudio.Services.Client;
using Microsoft.VisualStudio.Services.DelegatedAuthorization;
using Microsoft.VisualStudio.Services.DelegatedAuthorization.WebApi;
using Microsoft.VisualStudio.Services.WebApi;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace AdoTokenGenerator.Commands
{
    public class CreateTokenHandler
    {
        public async Task<CreateTokenResult> ExecuteAsync(CreateToken command, CancellationToken cancellationToken)
        {
            Console.WriteLine($"Connecting to organization {command.TeamCollectionUri}");
            using(var connection = new VssConnection(new Uri(command.TeamCollectionUri), new VssClientCredentials(false)))
            {
                await connection.ConnectAsync(cancellationToken);
                Console.WriteLine($"Connected to organization {command.TeamCollectionUri}");
                var tokenClient = connection.GetClient<TokenHttpClient>();
                var token = new SessionToken()
                {
                    TargetAccounts = new List<Guid>() { command.Organization },
                    // Scopes documented here: https://docs.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops#scopes
                    Scope = "vso.gallery_publish",
                    DisplayName = command.Name,
                    ValidTo = DateTime.Now.AddDays(command.Expiration)
                };
                Console.WriteLine($"Creating marketplace token \"{command.Name}\"");
                var result = await tokenClient.CreateSessionTokenAsync(token, SessionTokenType.Compact, false, cancellationToken: cancellationToken);
                Console.WriteLine($"TOKEN CREATED: {result.Token}");
                return new CreateTokenResult(result.Token);
            }
        }
    }
}
