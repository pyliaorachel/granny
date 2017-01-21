# granny

## Usage

`npm install`

Goto `node_module/react-native-audio/...../AudioRecorderManager.java` and add `body.putInt("maxAmplitude", recorder.getMaxAmplitude());`

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

Then run `react-native run-android`
