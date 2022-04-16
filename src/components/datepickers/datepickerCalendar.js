import React, { useState } from 'react';
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';

const styles = {
  dayWithDotContainer: {
    position: 'relative',
  },
  dayWithDot: {
    position: 'absolute',
    height: 0,
    width: 0,
    border: '2px solid',
    borderRadius: 4,
    borderColor: 'orange',
    right: '50%',
    transform: 'translateX(1px)',
    top: '80%',
  },
};

export default function DatePickerWithCalendar(props) {
  const dateList = [];
  for (var i = 0; i < 12; i++) {
    dateList.push([]);
  }

  props.selectedDays.map((date) => {
    const curDate = moment(date).toDate();
    const month = curDate.getMonth();
    const day = curDate.getDate();
    dateList[month].push(day);
  });

  const today = moment().toDate();
  const [selectedDays, setSelectedDays] = useState(
    dateList[today.getMonth()] || []
  );
  const [selectedDate, setSelectedDate] = useState(today);

  const handleDateChange = (day) => {
    setSelectedDate(day);
    props.setSelectedDate(day);
  };

  const handleMonthChange = async (date) => {
    const month = moment(date).toDate().getMonth();
    return new Promise((resolve) => {
      setTimeout(() => {
        setSelectedDays(dateList[month]);
        resolve();
      }, 1000);
    });
  };

  const customRenderDay = (
    day,
    selectedDate,
    isInCurrentMonth,
    dayComponent
  ) => {
    const date = moment(day).toDate().getDate();
    const isSelected = isInCurrentMonth && selectedDays.includes(date);
    return isSelected ? (
      <div style={styles.dayWithDotContainer}>
        {dayComponent}
        <div style={styles.dayWithDot} />
      </div>
    ) : (
      dayComponent
    );
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DatePicker
        disableToolbar
        variant="inline"
        value={selectedDate}
        onMonthChange={handleMonthChange}
        onChange={handleDateChange}
        renderDay={customRenderDay}
      />
    </MuiPickersUtilsProvider>
  );
}
