# SNAPI Installer Mobile Application
For QUT 2024 Capstone Team 81

## Requirements
### Node.js and npx
https://nodejs.org/en/download/package-manager
https://www.npmjs.com/package/npx
### Expo
Should automatically install by running
```
npm install
```
in the project directory. If it doesn't try using 
```
npm install expo-cli
```
### Android Studio or XCode
To simulate the app in an Android or iOS environment you'll need the related SDKs installed. Android Studio can be installed on Mac and Windows Devices, XCode can only be installed on Mac devices. You can see instructions on how to install the emulators or how to use your own phone to test in this page: https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated
## Getting started

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

## Examples

There are some examples in the **app-example** folder, it follows the same structure as the **app** folder.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.