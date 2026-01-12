import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { GetDateObjFromDateTimeString } from '../../lib/GetDateObjectFromDateTimeString';
import { ResetIcon } from '../ui/Icons/Icons';

export default function AvailabilityCheck({ setAvailabilityFilterDates }) {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [startTime, setStartTime] = useState('11:00:00');
  const [endDate, setEndDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [endTime, setEndTime] = useState('16:00:00');

  const [applyFilter, setApplyFilter] = useState(false);

  useEffect(() => {
    if (!applyFilter) {
      setAvailabilityFilterDates(null);
      return;
    }

    if (!startTime || !startDate || !endTime || !endDate) {
      setAvailabilityFilterDates(null);
      return;
    }

    const startDateObj = GetDateObjFromDateTimeString(startDate, startTime);
    const endDateObj = GetDateObjFromDateTimeString(endDate, endTime);
    setAvailabilityFilterDates({ start: startDateObj, end: endDateObj });
  }, [
    startDate,
    startTime,
    endDate,
    endTime,
    applyFilter,
    setAvailabilityFilterDates,
  ]);

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full gap-4 min-h-12  items-center">
      <Button
        styles={`h-fit ${
          applyFilter ? 'bg-accent/60 hover:bg-accent/80' : 'opacity-50'
        } `}
        text={
          applyFilter ? 'Availability Filter On' : 'Availability Filter Off'
        }
        onClick={() => {
          setApplyFilter(!applyFilter);
        }}
      />
      {applyFilter && (
        <div className="flex gap-2 md:gap-0 flex-col md:flex-row w-full lg:w-auto lg:grow items-center justify-around   ">
          <div className="flex flex-col sm:flex-row">
            <Input
              type="date"
              id="startDate"
              withLabel
              labelText="Start"
              value={startDate}
              outerStyles="flex-col sm:flex-row"
              onChange={(e) => {
                console.log(startDate);
                console.log(e.target.value);
                setStartDate(e.target.value);
              }}
            />
            <Input
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row">
            <Input
              outerStyles="flex-col sm:flex-row"
              type="date"
              id="endDate"
              withLabel
              labelText="End"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
            />
          </div>
          <Button
            text="Reset"
            iconPos="left"
            icon={<ResetIcon styles={'hover:scale-100 w-6'} />}
            onClick={() => {
              setAvailabilityFilterDates(null);
              setEndDate(new Date().toISOString().substring(0, 10));
              setEndTime('16:00:00');
              setStartDate(new Date().toISOString().substring(0, 10));
              setStartTime('11:00:00');
            }}
          />
        </div>
      )}
    </div>
  );
}
