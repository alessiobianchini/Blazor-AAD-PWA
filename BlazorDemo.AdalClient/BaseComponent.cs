using Microsoft.AspNetCore.Blazor.Components;
using Microsoft.AspNetCore.Blazor.Services;
using System.Net.Http;

namespace BlazorDemo.AdalClient
{
    public abstract class BaseComponent : BlazorComponent
    {
        [Inject]
        protected IUriHelper UriHelper { get; set; }

        [Inject]
        protected PushNotificationsClient PushNotificationClient { get; set; }
    }
}
