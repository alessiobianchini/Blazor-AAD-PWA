using Blazored.Storage;
using Microsoft.JSInterop;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace BlazorDemo.AdalClient
{
    public class PushNotificationsClient
    {

        private readonly HttpClient _httpClient;
        private readonly ILocalStorage _localStorage;

        private const string BaseAddress = "https://fcm.googleapis.com/fcm/send";

        public string Token { get; set; }

        public PushNotificationsClient(HttpClient httpClient, ILocalStorage localStorage)
        {
            _httpClient = httpClient;
            _localStorage = localStorage;
        }

        public async Task<bool> SendMessage(string message)
        {
            var request = new
            {
                to = "/topics/all",
                data = new
                {
                    message = message
                }
            };

            var stringPayload = JsonConvert.SerializeObject(request);

            var response = await JSRuntime.Current.InvokeAsync<bool>("blazorDemoInterop.sendMessage", stringPayload);

            return response;
        }
    }
}
