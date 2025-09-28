# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Agents Setup

The `Agents/` directory contains intelligent agents built with Google's Agent Development Kit (ADK).

### Prerequisites
- Python 3.8+
- Google Cloud Project with appropriate APIs enabled
- Google API key with Agent Development Kit access

### Setup Instructions

1. **Navigate to agents directory:**
   ```bash
   cd Agents
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv .venv

   # On Windows
   .venv\Scripts\activate

   # On macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Update `.env` file with your Google Cloud credentials:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   GOOGLE_CLOUD_PROJECT=your_project_id
   GOOGLE_CLOUD_LOCATION=global
   ```

5. **Test the setup:**
   ```bash
   python test.py
   ```

6. **Deploy agent (optional):**
   ```bash
   adk deploy cloud_run --project=$env:GOOGLE_CLOUD_PROJECT --region=$env:GOOGLE_CLOUD_LOCATION --service_name=multi-tool-agent-service --app_name=multi-tool-agent-app --with_ui multi_tool_agent
   ```

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
