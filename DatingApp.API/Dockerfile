FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["DatingApp.API/DatingApp.API.csproj", "DatingApp.API/"]
RUN dotnet restore "DatingApp.API/DatingApp.API.csproj"
COPY . .
WORKDIR "/src/DatingApp.API"
RUN dotnet build "DatingApp.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DatingApp.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DatingApp.API.dll"]
