# Granny
<p align="center"><img src="https://github.com/pyliaorachel/granny/blob/master/img/jumping_granny.gif" /></p>
![HappyGranny](https://github.com/pyliaorachel/granny/blob/master/img/happy_granny.gif)
![SadNeutralGranny](https://github.com/pyliaorachel/granny/blob/master/img/sad_neutral_granny.gif)
![SurprisedAngryGranny](https://github.com/pyliaorachel/granny/blob/master/img/surprised_angry_granny.gif)

__Granny__ is an app aimed at helping people to understand their emotions without having to overcome many difficulties when trying to find an assistant. You can easily open the app and talk to Granny, and Granny will respond with a face reflective of your emotions. Emotion history will also be kepted as a diary _(not yet implemented)_. 

Details can be found [here](https://devpost.com/software/granny).

## Platform

Currently only Android is supported.

## Usage

1. Clone the project.
2. Run `npm install`
3. Go to `node_module/react-native-audio/...../AudioRecorderManager.java` and add `body.putInt("maxAmplitude", recorder.getMaxAmplitude());` here:

  ```
  ...

  @ReactMethod
    public void pauseRecording(Promise promise){
      // Added this function to have the same api for android and iOS, stops recording now
      stopRecording(promise);
    }

      private void startTimer(){
      stopTimer();
      timer = new Timer();
      timer.scheduleAtFixedRate(new TimerTask() {
        @Override
        public void run() {
          WritableMap body = Arguments.createMap();
          body.putInt("currentTime", recorderSecondsElapsed);
          body.putInt("maxAmplitude", recorder.getMaxAmplitude()); // <-- here
          sendEvent("recordingProgress", body);
          recorderSecondsElapsed++;
        }
      }, 0, 1000);
    }

  ...
  ```

4. Run `react-native run-android`, open up AndroidStudio and press __Run__.

## Technical Components

The app is built on [React Native](https://facebook.github.io/react-native/) and embedded with [Microsoft Azure Emotion API](https://www.microsoft.com/cognitive-services/en-us/emotion-api) to understand people's emotion in near real-time. We use [react-native camera](https://github.com/lwansbrough/react-native-camera) to capture user's face and call the emotion API every several seconds (thanks to [react-native-fetch-blob](https://github.com/wkh237/react-native-fetch-blob)).

To detect whether the user has done talking, we modified [react-native-audio](https://github.com/jsierles/react-native-audio) to return `maxAmplitude` during audio recording process and compare it with the background amplitude to decide whether or not to continue to the next question. The background amplitude is collected during the opening - that's why you need to keep calm and wait for Granny.

Granny's voice is contributed by [react-native-tts](https://github.com/ak1394/react-native-tts). Granny's actions are contributed by [react-native-animatable](https://github.com/oblador/react-native-animatable).

The charts in the report is supported by [react-native-pathjs-charts](https://github.com/capitalone/react-native-pathjs-charts).
