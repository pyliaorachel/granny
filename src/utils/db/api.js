import * as firebase from 'firebase';
import db from './config';
import { report_const, enum_const } from '../constants';
import { emotions } from '../emotionList';
import { getEmotionImprovement, getMaxEmotion } from '../utilFunctions';

const { CHART_TYPE } = enum_const;

const mockUserID = 'abcde';
const userID = mockUserID;
const userJournals = db.ref(`user-journals/${userID}`);
const entries = userJournals.child('entries');
const summaries = userJournals.child('summaries');

const getDayMetaData = (cb) => {
  summaries.child(`day/meta`).on('value', (snapshot) => {
    return cb({ dayMetaData: snapshot.val() });
  });
};

const getDayData = (cb, d = (new Date().getDate()), m = (new Date().getMonth() + 1), y = (new Date().getFullYear())) => {
  summaries.child(`day/${d}`).on('value', (snapshot) => {
    return cb({ summaryData: snapshot.val() });
  });
  entries.child(`${y}/${m}/${d}`).on('value', (snapshot) => {
    return cb({ allData: snapshot.val() });
  });
};

const getMonthData = (cb, m = (new Date().getMonth() + 1), y = (new Date().getFullYear())) => {
  summaries.child(`month/${m}`).on('value', (snapshot) => {
    return cb({ summaryData: snapshot.val() });
  });
};

const getYearData = (cb, y = (new Date().getFullYear())) => {
  summaries.child(`year/${y}`).on('value', (snapshot) => {
    return cb({ summaryData: snapshot.val() });
  });
};

const getMockData = (chartType) => {
  let summaryData;
  if (chartType === CHART_TYPE.PIE) {
    summaryData = {
      ...report_const.DEFAULT_DATA,
      counts: {
        entries: 4,
        improvements: 2,
        streak: 5,
      },
    };
  } else {
    summaryData = {
      emotions: report_const.DEFAULT_MONTH_DATA,
      counts: {
        entries: 4,
        improvements: 2,
        streak: 5,
      },
    };
  }
  return {
    summaryData,
    allData: [
      {
        id: '0',
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        id: '1',
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        id: '2',
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        id: '3',
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        id: '4',
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        id: '5',
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        id: '6',
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        id: '7',
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
    ],
  };
};

const uploadJourney = (data) => {
  // post data
  const improvement = getEmotionImprovement(data.initialData.emotions, data.lastData.emotions);
  const postData = Object.assign({}, data, {
    improvement,
  });

  // path
  const endTime = (data.data) ? new Date(data.data.time.endTime) : new Date();
  const y = endTime.getFullYear();
  const m = endTime.getMonth() + 1;
  const d = endTime.getDate();

  const path = `${y}/${m}/${d}`;
  const newEntry = entries.child(path).push();
  newEntry.set(postData);

  // update other related data - sum & increment counters
  let maxDayEmotion;
  let maxMonthEmotion;    
  let newStreak;
  summaries.child(`day/${d}`).transaction((summary) => {
    // day
    if (summary) {
      if (summary.meta) {
        summary.meta.entries++;
        summary.meta.improvements += (improvement > 0) ? 1 : 0;
      }

      if (summary.emotions) {
        let max = -1; let maxI = -1;
        emotions.forEach((emotion, i) => {
          const sum = summary.emotions[emotion] + data.data.emotions[emotion];
          summary.emotions[emotion] = sum;
          if (sum >= max) { // choose the more positive ones, so >= instead of >
            max = sum;
            maxI = i;
          }
        });
        maxDayEmotion = emotions[maxI];
      }
    } else {
      summary = {
        emotions: data.data.emotions,
        meta: {
          entries: 1,
          improvements: (improvement > 0) ? 1 : 0,
        },
      };
      maxDayEmotion = getMaxEmotion(data.data.emotions);
    }
    return summary;
  }, () => {
    // day meta
    summaries.child(`day/meta`).transaction((meta) => {
      if (meta) {
          const streakStartDay = new Date(meta.streakStart).getDate();
          if (streakStartDay === d-1) meta.streak++;
          else if (streakStartDay < d-1) meta.streak = 0; // count over
          newStreak = meta.streak;
          meta.streakStart = data.data.time.endTime;
      } else {
        meta = {
          streak: 1,
          streakStart: data.data.time.endTime,
        };
        newStreak = 1;
      }
      return meta;
    }, () => {
      // month
      summaries.child(`month/${m}`).transaction((summary) => {
        if (summary) {
          if (!summary.emotions) summary.emotions = [];

          const lastEntry = summary.emotions.length;
          for (let i = lastEntry; i < d; i++) {
            summary.emotions.push('anger');
          }
          summary.emotions[d-1] = maxDayEmotion;

          if (summary.meta) {
            summary.meta.entries++;
            summary.meta.improvements += (improvement > 0) ? 1 : 0;
            if (newStreak > summary.meta.streak) summary.meta.streak = newStreak;
          }

          if (summary.emotionSums) {
            let max = -1; let maxI = -1;
            emotions.forEach((emotion, i) => {
              const sum = summary.emotionSums[emotion] + data.data.emotions[emotion];
              summary.emotionSums[emotion] = sum;
              if (sum >= max) { // choose the more positive ones, so >= instead of >
                max = sum;
                maxI = i;
              }
            });
            summary.emotions[d-1] = emotions[maxI];
            maxMonthEmotion = emotions[maxI];
          }
        } else {
          const newEmotions = [];
          for (let i = 0; i < d; i++) {
            newEmotions.push('anger');
          }
          newEmotions[d-1] = maxDayEmotion;
          summary = {
            emotions: newEmotions,
            emotionSums: data.data.emotions,
            meta: {
              entries: 1,
              improvements: (improvement > 0) ? 1 : 0,
              streak: newStreak,
            },
          };
          maxMonthEmotion = maxDayEmotion;
        }
        return summary;
      }, () => {
        // year
        summaries.child(`year/${y}`).transaction((summary) => {
          if (summary) {
            if (!summary.emotions) summary.emotions = [];

            const lastEntry = summary.emotions.length;
            for (let i = lastEntry; i < m; i++) {
              summary.emotions.push('anger');
            }
            summary.emotions[m-1] = maxMonthEmotion;

            if (summary.meta) {
              summary.meta.entries++;
              summary.meta.improvements += (improvement > 0) ? 1 : 0;
              if (newStreak > summary.meta.streak) summary.meta.streak = newStreak;
            }

            if (summary.emotionSums) {
              let max = -1; let maxI = -1;
              emotions.forEach((emotion, i) => {
                const sum = summary.emotionSums[emotion] + data.data.emotions[emotion];
                summary.emotionSums[emotion] = sum;
                if (sum >= max) { // choose the more positive ones, so >= instead of >
                  max = sum;
                  maxI = i;
                }
              });
              summary.emotions[m-1] = emotions[maxI];
            }
          } else {
            const newEmotions = [];
            for (let i = 0; i < m; i++) {
              newEmotions.push('anger');
            }
            newEmotions[m-1] = maxMonthEmotion;
            summary = {
              emotions: newEmotions,
              emotionSums: data.data.emotions,
              meta: {
                entries: 1,
                improvements: (improvement > 0) ? 1 : 0,
                streak: newStreak,
              },
            };
          }
          return summary;
        });
      });
    });
  });
};

module.exports = {
  getDayMetaData,
  getDayData,
  getMonthData,
  getYearData,
  uploadJourney,
};