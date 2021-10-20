namespace AdoTokenGenerator.Commands
{
    public class CreateTokenResult
    {
        public CreateTokenResult(string token)
        {
            Token = token;
        }

        public string Token { get; }
    }
}
