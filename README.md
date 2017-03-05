# Granny
<p align="center"><img src="https://github.com/pyliaorachel/granny/blob/master/img/jumping_granny.gif" /></p>
![HappyGranny](https://github.com/pyliaorachel/granny/blob/master/img/happy_granny.gif)
![SadNeutralGranny](https://github.com/pyliaorachel/granny/blob/master/img/sad_neutral_granny.gif)
![SurprisedAngryGranny](https://github.com/pyliaorachel/granny/blob/master/img/surprised_angry_granny.gif)

__Granny__ is an app aimed at helping people understand their emotions without having to overcome difficulties such as seeking out outside assistance. One may easily open the app and talk to Granny, and Granny will respond, reflective of your emotions. Voice recording, text transcription, emotion data, and data analysis are stored and may be perused at one's leisure, _(not yet implemented)_ making Granny an ideal journaling app for the emotionally vulnerable.

Further details can be found [here](https://devpost.com/software/granny).


## Platform

Currently only Android is supported.


## Usage

1. Make sure your devices are set up as outlined [here](https://facebook.github.io/react-native/docs/running-on-device.html) and [AndroidStudio](https://developer.android.com/studio/index.html) installed.
2. Clone the project.
3. Register an [Azure Cognitive Services Account](https://azure.microsoft.com/en-us/services/cognitive-services/) on Emotion API and retrieve a key.
4. Under the root directory, create a file `config.js` and add:

  ```
  module.exports = {
    OcpApimSubscriptionKey: '[your-key]',
  };
  ```

5. Go to Granny's project directory, then run `npm install`.
6. Go to `./node_modules/react-native-audio/android/...../AudioRecorderManager.java` and add `body.putInt("maxAmplitude", recorder.getMaxAmplitude());` here:

  ```
  ...
  private void startTimer(){
    ...
      @Override
      public void run() {
        WritableMap body = Arguments.createMap();
        body.putInt("currentTime", recorderSecondsElapsed);
        body.putInt("maxAmplitude", recorder.getMaxAmplitude());        // <-- ADD HERE
        sendEvent("recordingProgress", body);
        recorderSecondsElapsed++;
      }
    ...
  }
  ...
  ```

7. Import Granny into AndroidStudio, and press __Run__.
8. Return to the root project directory, and run `react-native run-android`.


## Technical Components

The app is built on [React Native](https://facebook.github.io/react-native/) and embedded with [Microsoft Azure Emotion API](https://www.microsoft.com/cognitive-services/en-us/emotion-api) to understand people's emotion in near real-time. We use [react-native camera](https://github.com/lwansbrough/react-native-camera) to capture user's face and call the emotion API every several seconds (thanks to [react-native-fetch-blob](https://github.com/wkh237/react-native-fetch-blob)).

To detect whether the user has done talking, we modified [react-native-audio](https://github.com/jsierles/react-native-audio) to return `maxAmplitude` during audio recording process and compare it with the background amplitude to decide whether or not to continue to the next question. The background amplitude is collected during the opening - that's why you need to keep calm and wait for Granny.

Granny's voice is contributed by [react-native-tts](https://github.com/ak1394/react-native-tts). Granny's actions are contributed by [react-native-animatable](https://github.com/oblador/react-native-animatable).

The charts in the report is supported by [react-native-pathjs-charts](https://github.com/capitalone/react-native-pathjs-charts).
