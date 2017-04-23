import { emotions, positiveEmotions, negativeEmotions } from './emotionList';
import { weekdayNames as weekdays, monthNamesShort as months } from './timeNames';
import { enum_const } from './constants';

const { CHART_TYPE } = enum_const;

/*
  Converting hex color value to RGB representation.

  Sample Input:
    #ffffff (or #fff)
  Sample Output:
    {
      'r': 255,
      'g': 255,
      'b': 255
    }

  reference: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
*/
const hexToRgb = (hex) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        'r': parseInt(result[1], 16),
        'g': parseInt(result[2], 16),
        'b': parseInt(result[3], 16)
    } : null;
};

const hexToRgba = (hex, a) => {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
};

const parseChartData = (data, chartType) => {
  let parsedData = [];

  if (chartType === CHART_TYPE.PIE) {
    const dataEmotions = data.emotions;
    emotions.forEach((emotion) => {
      const part = {
        'name': emotion,
        'score': parseFloat(dataEmotions[emotion]),
      };
      parsedData.push(part);
    });
  } else {
    const dataEmotions = data.emotions;
    let parsedLineData = []
    dataEmotions.forEach((emotion, i) => {
      const part = {
        'day': i + 1,
        'emotionID': emotions.indexOf(emotion),
      };
      parsedLineData.push(part);
    });
    parsedData.push(parsedLineData);
  }

  return parsedData;
};

const parseReportTitleDate = (data) => {
  const day = (data && weekdays[data.time.day]) || 'Monday';
  const startTime = new Date(data.time.startTime);
  return `${day}, ${startTime.getDate()} ${months[startTime.getMonth()]} ${startTime.getFullYear()}`;
};

const parseInfoPanelData = (unparsedData) => {
  console.log(unparsedData);
  const { initialData, lastData, data } = unparsedData;
  let initialEmotion;
  let lastEmotion;
  let improvement = unparsedData.improvement;

  if (initialData) {
    // max initial/last emotion
    const initialEmotions = initialData.emotions;
    const lastEmotions = lastData.emotions;
    const maxInitialEmotion = Math.max.apply(null, Object.values(initialEmotions));
    const maxLastEmotion = Math.max.apply(null, Object.values(lastEmotions));

    initialEmotion = Object.keys(initialEmotions).filter(x => initialEmotions[x] === maxInitialEmotion)[0];
    lastEmotion = Object.keys(lastEmotions).filter(x => lastEmotions[x] === maxLastEmotion)[0];

    // improvement
    if (!improvement) improvement = getEmotionImprovements(initialEmotions, lastEmotions);
  } else {
    initialEmotion = lastEmotion = 'happiness';
    improvement = 0;
  }
    // duration
  const duration = new Date(new Date(data.time.endTime) - new Date(data.time.startTime));

  return { initialEmotion, lastEmotion, improvement, duration };
};

const getEmotionImprovements = (initialEmotions, lastEmotions) => {
  const initialPositiveEmotions = positiveEmotions.reduce((prev, emotion) => {
    return prev + initialEmotions[emotion];
  }, 0);
  const initialNegativeEmotions = negativeEmotions.reduce((prev, emotion) => {
    return prev + initialEmotions[emotion];
  }, 0);
  const lastPositiveEmotions = positiveEmotions.reduce((prev, emotion) => {
    return prev + lastEmotions[emotion];
  }, 0);
  const lastNegativeEmotions = negativeEmotions.reduce((prev, emotion) => {
    return prev + lastEmotions[emotion];
  }, 0);

  return Math.round(((lastPositiveEmotions - initialPositiveEmotions) + (initialNegativeEmotions - lastNegativeEmotions)) * 100 / 2);
};

module.exports = {
  hexToRgb,
  hexToRgba,
  parseChartData,
  parseReportTitleDate,
  parseInfoPanelData,
  getEmotionImprovements,
};
