import * as firebase from 'firebase';
import db from './config';
import { report_const } from '../constants';

const getMockData = (chartType) => {
  let summaryData;
  if (chartType === 'pie') {
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
    getMockData,
};