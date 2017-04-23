import * as firebase from 'firebase';
import db from './config';
import { report_const, enum_const } from '../constants';

const { CHART_TYPE } = enum_const;

const mockUserID = 'abcde';
const userID = mockUserID;
const userJournals = db.ref(`user-journals/${userID}`);
const entries = userJournals.child('entries');
const summaries = userJournals.child('summaries');

const getDayData = (d = (new Date().getDate()), m = (new Date().getMonth() + 1), y = (new Date().getFullYear())) => {
  return Promise.all([summaries.child(`day/${d}`).once('value'), entries.child(`${y}/${m}/${d}`).once('value')])
    .then(snapshots => {
      console.log(snapshots);
      return {
        summaryData: snapshots[0].val(),
        allData: snapshots[1].val(),
      };
    });
};

const getMonthData = (m = (new Date().getMonth() + 1), y = (new Date().getFullYear())) => {
    console.log(y, m);
    return getMockData(CHART_TYPE.STOCK_LINE);
};

const getYearData = (y = (new Date().getFullYear())) => {
    console.log(y);
    return getMockData(CHART_TYPE.STOCK_LINE);
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

module.exports = {
    getDayData,
    getMonthData,
    getYearData,
};