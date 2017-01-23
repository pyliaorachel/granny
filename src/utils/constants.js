import { Dimensions } from 'react-native';

module.exports = {
  interval_const: {
    CAPTURE_IMAGE_INTERVAL: 4000,
  },
  timeout_const: {
    END_TALK_TIMEOUT: 3000,
    OPENING_TIMEOUT: 10000,
  },
  config_const: {
    TTS_DEFAULT_RATE: 0.4,
    TTS_DEFAULT_LANG: 'en-US',
    BG_SCALE: 4,
    BG_CUMULATE_CNT: 3,
    AUDIO_FILE_PATH: '/dev/null',
    AUDIO_OPTIONS: {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000,
    },
  },
  report_const: {
    DEFAULT_DATA: {
      emotions: {
        happiness: 0.125,
        sadness: 0.125,
        anger: 0.125,
        fear: 0.125,
        surprise: 0.125,
        contempt: 0.125,
        disgust: 0.125,
        neutral: 0.125,
      },
      time: {
        startTime: '2017-02-21T13:45:30',
        endTime: '2017-02-21T13:55:31'
      }
    },
    DEFAULT_PARSED_DATA: [{
      'name': 'happiness',
      'score': 0.1
    }, {
      'name': 'anger',
      'score': 0.1
    }, {
      'name': 'fear',
      'score': 0.2
    }, {
      'name': 'surprise',
      'score': 0.2
    }, {
      'name': 'contempt',
      'score': 0.1
    }, {
      'name': 'disgust',
      'score': 0.1
    }, {
      'name': 'neutral',
      'score': 0.1
    }, {
      'name': 'sadness',
      'score': 0.1
    }],
  },
  chart_options: {
    pie: {
      margin: {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      },
      width: 300,
      height: 300,
      color: '#2980B9',
      r: 20,
      R: 100,
    },
  },
  granny_const: {
    BOUNCING_DURATION: 1500,
  },
  env_const: {
    WINDOW_WIDTH: Dimensions.get('window').width,
    WINDOW_HEIGHT: Dimensions.get('window').height,
  },
};
