import { report_const } from './constants';

const getData = () => {
  return {
    summaryData: report_const.DEFAULT_DATA.emotions,
    allData: [
      {
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
      {
        data: report_const.DEFAULT_DATA,
        initialData: report_const.DEFAULT_DATA,
        lastData: report_const.DEFAULT_DATA,
      },
    ],
  };
};

module.exports = {
    getData,
};