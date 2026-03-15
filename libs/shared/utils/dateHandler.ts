import * as moment from 'moment';

const dateHandler = (date: Date) => {
  return moment(date, 'MM-DD-YYYY').utc(true).toISOString();
};

export default dateHandler;
