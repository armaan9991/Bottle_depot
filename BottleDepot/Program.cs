using MySqlConnector;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.UseSecurityTokenValidators = true;
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidAudience            = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(
                                           Encoding.UTF8.GetBytes(
                                               builder.Configuration["Jwt:Key"]!)),
            // RoleClaimType            = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
            // NameClaimType            = "name"
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
        Console.WriteLine("JWT OK: " + context.Principal.Identity?.Name);
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