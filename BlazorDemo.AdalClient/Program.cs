using Microsoft.AspNetCore.Blazor.Browser.Services;
using Microsoft.AspNetCore.Blazor.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace BlazorDemo.AdalClient
{
    public class Program
    {
        static void Main(string[] args)
        {
            var serviceProvider = new BrowserServiceProvider(services =>
            {
            });

            BlazorWebAssemblyHost.CreateDefaultBuilder()
                                 .UseBlazorStartup<Startup>()
                                 .Build()
                                 .Run();
        }
    }
}