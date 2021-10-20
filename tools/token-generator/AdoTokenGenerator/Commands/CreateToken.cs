using CommandLine;
using System;

namespace AdoTokenGenerator.Commands
{
    [Verb("create", HelpText = "Create's a new personal access token")]
    public class CreateToken
    {
        [Option('u')] 
        public string TeamCollectionUri { get; set; }

        [Option('o')] 
        public Guid Organization { get; set; }
        
        [Option('n')] 
        public string Name { get; set; }

        [Option('e', Default = 90, HelpText = "Number of days until the token expires")]
        public int Expiration { get; set; }
    }
}
