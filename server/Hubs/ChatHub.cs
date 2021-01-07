using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;

namespace server.Hubs
{
    public class ChatHub: Hub
    {
        public Task SubscribeToChat(string chatName)
        {
            Console.WriteLine($"Someone joined {chatName}");
            return Groups.AddToGroupAsync(Context.ConnectionId, chatName);
        }

        public Task UnsubscribeChat(string chatName)
        {
            Console.WriteLine($"Someone left {chatName}");
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, chatName);
        }

        public Task SendMessage(string user, string message, string chatName)
        {
            var id = Guid.NewGuid().ToString();
            Console.WriteLine($"{user} sent {message} to {chatName}");
            return Clients.Group(chatName).SendAsync($"ReceiveMessage{chatName}", user, message, id);
        }

        public override Task OnConnectedAsync() {
            return Clients.Caller.SendAsync("OnConnected");
        }
    }
}