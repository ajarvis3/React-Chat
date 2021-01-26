using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using server.Hubs;

namespace server
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            var url = "https://ajarvis3.github.io";
            if (env.IsDevelopment())
            {
                url = "http://localhost:3000";
                app.UseDeveloperExceptionPage();
            }
            System.Diagnostics.Trace.WriteLine(url);

            // Like CORS for WebSockets
            var webSocketOptions = new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(120),
            };
            webSocketOptions.AllowedOrigins.Add(url);

            app.UseWebSockets(webSocketOptions);

            // CORS
            app.UseCors(builder =>
            {
                builder.WithOrigins(url)
                    .AllowAnyHeader()
                    .WithMethods("GET", "POST");
                    // .AllowCredentials();
            });

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Hello World!");
                });
                endpoints.MapHub<ChatHub>("/chathub");
            });
        }
    }
}
