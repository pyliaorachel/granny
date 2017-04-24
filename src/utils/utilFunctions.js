import { emotions, positiveEmotions, negativeEmotions } from './emotionList';
import { weekdayNames as weekdays, monthNamesShort as months } from './timeConsts';
import { enum_const } from './constants';
import { monthDays } from './timeConsts';

const { CHART_TYPE, DATA_TYPE } = enum_const;


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
  return {
    ...rgb,
    a,
  };
};

const hexToRgbaStr = (hex, a) => {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
};

/* source: http://stackoverflow.com/questions/21576092/convert-rgba-to-hex */
const rgbaToRgb = (color) => {
  const alpha = color.a;
  const bg = {r: 255, g: 255, b: 255};

  return {
      'r': (1 - alpha) * bg.r + alpha * color.r,
      'g': (1 - alpha) * bg.g + alpha * color.g,
      'b': (1 - alpha) * bg.b + alpha * color.b
  };
}

const parseChartData = (data, chartType, paddingUntil = 0) => {
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
    let prev = null;
    dataEmotions.forEach((emotion, i) => {
      const part = {
        'day': i + 1,
        'emotionID': emotions.indexOf(emotion),
      };
      if (prev) {
        parsedData.push([prev, part]);
      }
      prev = part;
    });
    if (parsedData.length < paddingUntil) {
      for (let i = parsedData.length; i < paddingUntil; i++) {
        const dummy = {
          'day': i,
          'emotionID': 0,
        };
        parsedData.push([dummy, dummy]);
      }
    }
  }
  return parsedData;
};

const parseReportTitleDate = (data) => {
  const day = (data && weekdays[data.time.day]) || 'Monday';
  const startTime = new Date(data.time.startTime);
  return `${day}, ${startTime.getDate()} ${months[startTime.getMonth()]} ${startTime.getFullYear()}`;
};

const parseInfoPanelData = (unparsedData) => {
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
    if (!improvement) improvement = getEmotionImprovement(initialEmotions, lastEmotions);
  } else {
    initialEmotion = lastEmotion = 'happiness';
    improvement = 0;
  }
    // duration
  const duration = new Date(new Date(data.time.endTime) - new Date(data.time.startTime));

  return { initialEmotion, lastEmotion, improvement, duration };
};

const getEmotionImprovement = (initialEmotions, lastEmotions) => {
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

const isLeapYear = (y) => {
  return ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0);
};

const getPaddingUntil = (dataType, m, y) => {
  return (dataType === DATA_TYPE.MONTH) ? ((m === 2 && isLeapYear(y)) ? 29 : monthDays[m-1]) : 12;
};

const getMaxEmotion = (data) => {
  let max = -1; let maxI = -1;
  emotions.forEach((emotion, i) => {
    if (data[emotion] >= max) { // choose the more positive ones, so >= instead of >
      max = data[emotion];
      maxI = i;
    }
  });
  return emotions[maxI];
};

module.exports = {
  hexToRgb,
  hexToRgba,
  hexToRgbaStr,
  rgbaToRgb,
  parseChartData,
  parseReportTitleDate,
  parseInfoPanelData,
  getEmotionImprovement,
  getPaddingUntil,
  getMaxEmotion,
};
