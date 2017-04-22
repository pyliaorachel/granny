import { Dimensions } from 'react-native';

const chartSize = 160;
const ringThickness = 20;
const chart_const = {
  HEIGHT: 300,
  CHART_SIZE: chartSize,
  INNER_CIRCLE_MARGIN: 8,
  RING_THICKNESS: ringThickness,
  chart_options: {
    pie: {
      margin: {
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      },
      width: chartSize,
      height: chartSize,
      color: '#2980B9',
      r: chartSize/2 - ringThickness,
      R: chartSize/2,
    },
  },
};

module.exports = {
  navbar_const: {
    HEIGHT: 60,
    SUBNAVBAR_HEIGHT: 50,
    type: {
      NONE: 'none',
      MAIN: 'main',
      CLOSE: 'close',
    }
  },
  interval_const: {
    CAPTURE_IMAGE_INTERVAL: 10000,
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
    CONTAINER_PADDING: 20,
    REPORT_TITLE: 'mood analysis of speech',
    REPORT_TITLE_TODAY: 'your mood over today',
    REPORT_TITLE_MONTH: 'your mood over this month',
    REPORT_TITLE_ALL_TIME: 'your mood over all time',
    DEFAULT_NAVBAR_TITLE: 'Report',
    DEFUALT_SPEECH_TEXT: 'This is default speech textThis is default speech textThis is default speech textThis is default speech text',
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
        endTime: '2017-02-21T14:55:31'
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
    infoPanel: {
      MIN_HEIGHT: 100,
    }
  },
  chart_const,
  granny_const: {
    BOUNCING_DURATION: 1500,
  },
  env_const: {
    WINDOW_WIDTH: Dimensions.get('window').width,
    WINDOW_HEIGHT: Dimensions.get('window').height,
  },
  style_const: {
    shadow: {
      shadowColor: '#555555',
      shadowOpacity: 0.4,
      shadowRadius: 1,
      shadowOffset: {
        height: 0.3,
        width: 0.3,
      },
    },
    color: {
      themeGreen: '#11B2B2',
    }
  },
};
