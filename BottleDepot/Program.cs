using MySqlConnector;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

Console.WriteLine("JWT KEY: " + builder.Configuration["Jwt:Key"]);
Console.WriteLine("JWT ISSUER: " + builder.Configuration["Jwt:Issuer"]);
Console.WriteLine("JWT AUDIENCE: " + builder.Configuration["Jwt:Audience"]);


// ── MySQL ─────────────────────────────────────────────
builder.Services.AddScoped<MySqlConnection>(_ =>
    new MySqlConnection(
        builder.Configuration
               .GetConnectionString("DefaultConnection")));

// ── CORS ──────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .SetIsOriginAllowed(origin => 
                origin.StartsWith("http://localhost") ||
                origin.EndsWith(".vercel.app")
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
});

// ── JWT ───────────────────────────────────────────────

// ---------- JWT FROM CONFIG ----------
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        // options.UseSecurityTokenValidators = true;
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAudience,
            IssuerSigningKey         = new SymmetricSecurityKey(
                                           Encoding.UTF8.GetBytes(jwtKey!)),
            NameClaimType = "name",
            RoleClaimType = "role"       
        };   
            
       options.Events = new JwtBearerEvents
{
    OnAuthenticationFailed = context =>
    {
        Console.WriteLine("JWT FAILED: " + context.Exception.Message);
        return Task.CompletedTask;
    },
    OnTokenValidated = context =>
    {
        Console.WriteLine("JWT OK: " + context.Principal?.Identity?.Name);
        return Task.CompletedTask;
    }
};
    });


builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();    // ← simple, no JWT config

var app = builder.Build();
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Urls.Add($"http://0.0.0.0:{port}");
app.UseSwagger();
app.UseSwaggerUI();
// app.UseCors("AllowReact");
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();


app.Run();