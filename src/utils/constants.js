import { Dimensions } from 'react-native';
import { emotionEmojis } from './emotionList';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const chartSize = 200;
const ringThickness = 20;
const reportContainerPadding = 20;
const labelFunction = (v) => {
  return emotionEmojis[v];
};
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
      strokeWidth: 0,
      r: chartSize/2 - ringThickness,
      R: chartSize/2,
      label: {
        color: 'transparent',
      }
    },
    stockLine: {
      width: screenWidth - reportContainerPadding * 4,
      height: chartSize,
      color: '#11B2B2',
      opacity: 1,
      margin: {
        top: reportContainerPadding,
        left: reportContainerPadding,
        bottom: reportContainerPadding,
        right: reportContainerPadding + 5,
      },
      animate: {
        type: 'delayed',
        duration: 200
      },
      axisX: {
        showAxis: false,
        showLines: false,
        showLabels: true,
        showTicks: false,
        zeroAxis: false,
        orient: 'bottom',
        tickValues: [],
        gridColor: '#dddddd',
        label: {
          fontFamily: 'Arial',
          fontSize: 8,
          fontWeight: true,
          fill: '#34495E',
          color: '#bbbbbb',
        }
      },
      axisY: {
        showAxis: false,
        showLines: true,
        showLabels: true,
        showTicks: false,
        zeroAxis: false,
        orient: 'left',
        tickValues: [],
        gridColor: '#dddddd',
        label: {
          fontFamily: 'Arial',
          fontSize: 10,
          fontWeight: true,
          fill: '#34495E',
          color: '#bbbbbb',
        },
        labelFunction,
      }
    }
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
    CAPTURE_IMAGE_INTERVAL: 3000, 
  },
  timeout_const: {
    END_TALK_TIMEOUT: 3000,
    OPENING_TIMEOUT: 10000, 
    RETRIEVE_DATA_TIMEOUT: 3000,
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
    CONTAINER_PADDING: reportContainerPadding,
    REPORT_TITLE: 'mood analysis of speech',
    REPORT_TITLE_DAY: 'your mood over DAY',
    REPORT_TITLE_MONTH: 'your mood over MONTH',
    REPORT_TITLE_YEAR: 'your mood over YEAR',
    DEFAULT_NAVBAR_TITLE: 'Report',
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
      },
      improvement: 0,
    },
    DEFAULT_EMOTION_DATA: {
      happiness: 0.5,
      sadness: 0.2,
      anger: 0.1,
      fear: 0.05,
      surprise: 0.05,
      contempt: 0.05,
      disgust: 0.05,
      neutral: 0.00,
    },
    DEFAULT_SPEECH_TEXT: "The group project I'm working on really disgusted me. I want to suicide. Of course I'm kidding, I went to the park instead. Let it go. Let it go. Probably thinking about those groupmates failing in the future makes me more comfortable. I love you Granny!",
    DEFAULT_KEYWORDS: [
      {
        "text": "suicide",
        "emotion": "anger"
      },
      {
        "text": "group project",
        "emotion": "disgust"
      },
      {
        "text": "park",
        "emotion": "happiness"
      }
    ],
    DEFAULT_TRANSCRIPT: [
      {
        "answer" : "Umm...",
        "questionID" : 0
      },
      {
        "answer" : "10",
        "questionID" : 1
      },
      {
        "answer" : "The group project I'm working on really disgusted me.",
        "questionID" : 2
      },
      {
        "answer" : "I want to suicide.",
        "questionID" : 3
      },
      {
        "answer" : "Of course I'm kidding, I went to the park instead.",
        "questionID" : 4
      },
      {
        "answer" : "Let it go. Let it go.",
        "questionID" : 5
      },
      {
        "answer" : "Probably thinking about those groupmates failing in the future makes me more comfortable.",
        "questionID" : 4
      },
      {
        "answer" : "Yes",
        "questionID" : 9
      },
      {
        "answer" : "I love you Granny!",
        "questionID" : 10
      } 
    ],
    DEFAULT_MONTH_DATA: [
      'happiness', 'sadness', 'anger', 'neutral', 
      'surprise', 'sadness', 'disgust', 'happiness', 
      'contempt', 'anger', 'anger', 'happiness', 
      'sadness', 'disgust', 'happiness', 'happiness', 
      'neutral', 'sadness', 'anger', 'happiness', 
      'sadness', 'disgust', 'anger', 'happiness', 
      'happiness', 'surprise', 'sadness', 'happiness', 
      'sadness', 'neutral'
    ],
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
  drawer_const: {
    HEIGHT: 50,
  },
  granny_const: {
    BOUNCING_DURATION: 1500,
    HEIGHT: 606,
    WIDTH: 483,
  },
  env_const: {
    WINDOW_WIDTH: screenWidth,
    WINDOW_HEIGHT: screenHeight,
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
      BGGrey: '#EEEEEE',
    }
  },
  enum_const: {
    DATA_TYPE: {
      DAY: 0,
      MONTH: 1,
      YEAR: 2,
    },
    CHART_TYPE: {
      PIE: 0,
      STOCK_LINE: 1,
    }
  }
};
