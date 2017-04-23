import * as firebase from 'firebase';
import db from './config';
import { report_const, enum_const } from '../constants';
import { getEmotionImprovement } from '../utilFunctions';

const { CHART_TYPE } = enum_const;

const mockUserID = 'abcde';
const userID = mockUserID;
const userJournals = db.ref(`user-journals/${userID}`);
const entries = userJournals.child('entries');
const summaries = userJournals.child('summaries');

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
};

module.exports = {
    getDayData,
    getMonthData,
    getYearData,
    uploadJourney,
};