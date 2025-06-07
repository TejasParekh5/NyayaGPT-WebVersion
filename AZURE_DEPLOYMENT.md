# Azure Deployment Guide for NyaySetu

## Setting up Azure App Service

Follow these steps to deploy your NyaySetu application to Azure App Service:

### 1. Create an Azure App Service Web App

1. Log in to the Azure Portal (https://portal.azure.com)
2. Click "Create a resource" > "Web App"
3. Configure as follows:
   - **Resource Group**: Create new > "nyaysetu-rg"
   - **Name**: "nyaysetu-app" (or any available name)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: East US (or region closest to your users)
   - **App Service Plan**: Create new > "nyaysetu-plan"
   - **Pricing Plan**: Free F1 tier (to start) or Basic B1 tier (more reliable)
4. Click "Review + Create" > "Create"

### 2. Configure the App Service

After creation, go to your app service and:

1. Go to "Configuration" > "Application settings" and add:

   ```
   BHASHINI_UDYAT_KEY=044ead971c-2c3c-4043-89e9-45e154285b18
   BHASHINI_INFERENCE_API_KEY=ur_lB-PKydyLBVz21RlFTLpSqRyuUslBSRf-G8byTEgXPS-dnB1B6VMhA61Ljal7
   BHASHINI_API_URL=https://bhashini.gov.in/api
   ```

2. Go to "Deployment Center" and set up deployment from your GitHub repository
   - Choose GitHub as the source
   - Connect to your repository
   - Configure Build Provider (GitHub Actions)

### 3. Prepare Your Project for Azure Deployment

1. Create a `web.config` file in your project root:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <webSocket enabled="false" />
    <handlers>
      <add name="iisnode" path="backend/server.js" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="backend">
          <match url="^/api/(.*)$" />
          <action type="Rewrite" url="backend/server.js" />
        </rule>
        <rule name="static">
          <match url="(.*)" />
          <action type="Rewrite" url="dist/$1" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True" />
          </conditions>
        </rule>
      </rules>
    </rewrite>
    <iisnode watchedFiles="web.config;*.js" />
  </system.webServer>
</configuration>
```

2. Update your package.json with a build script:

```json
"scripts": {
  "start": "node backend/server.js",
  "build": "vite build",
  "postinstall": "npm run build"
}
```

### 4. Deploy Your Application

1. Commit and push your changes to GitHub
2. Azure will automatically deploy your application
3. Visit your app at `https://nyaysetu-app.azurewebsites.net`
