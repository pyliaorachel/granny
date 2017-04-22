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
        happiness: 0.5,
        sadness: 0.2,
        anger: 0.1,
        fear: 0.05,
        surprise: 0.05,
        contempt: 0.05,
        disgust: 0.05,
        neutral: 0.00,
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
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      },
      width: 200,
      height: 200,
      color: '#2980B9',
      r: 80,
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
