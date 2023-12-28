import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useField } from 'formik';
import { memo, useRef, useState } from 'react';
import { IReportWindowForm } from '../ReportWindow';

const OtherFieldDate = () => {
  const [, meta, args] = useField<IReportWindowForm['willCreateAt']>('willCreateAt');
  const [date, setDate] = useState(() => dayjs(new Date()));
  const ref = useRef(null);
  return (
    <div className='reportWindow-form-start'>
      <span className='reportWindow-form-start-title'>Start from:</span>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          ref={ref}
          disablePast
          defaultValue={date}
          // value={date}
          className={`${meta.error ? 'errorInput' : ''}`}
          onChange={(newValue) => {
            if (!newValue) return;
            setDate(newValue);
            args.setValue(newValue.valueOf());
          }}
        ></DateTimePicker>
      </LocalizationProvider>
    </div>
  );
};

export default memo(OtherFieldDate);
