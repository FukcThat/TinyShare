import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { GetDateObjFromDateTimeString } from "../../lib/GetDateObjectFromDateTimeString";
import { useItemContext } from "../../context/item_context/useItemContext";

export default function AvailabilityCheck() {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { setAvailabilityFilterDates } = useItemContext();

  // Submit Form handler
  const onSubmit = (e) => {
    e.preventDefault();

    if (startDate == "" || startTime == "" || endDate == "" || endTime == "") {
      window.alert(
        "You're missing something. Please check that all inputs are set."
      );
    }

    const startDateObj = GetDateObjFromDateTimeString(startDate, startTime);
    const endDateObj = GetDateObjFromDateTimeString(endDate, endTime);
    setAvailabilityFilterDates({ start: startDateObj, end: endDateObj });
  };

  return (
    <div>
      <Button
        text="Check Availability"
        onClick={() => setShowForm(!showForm)}
      />
      {showForm && (
        <form onSubmit={onSubmit} className="flex flex-col">
          <Input
            type="date"
            id="startDate"
            withLabel
            labelText="Start Date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
          />
          <Input
            type="time"
            id="startTime"
            withLabel
            labelText="Start Time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
            }}
          />
          <Input
            type="date"
            id="endDate"
            withLabel
            labelText="End Date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
          />
          <Input
            type="time"
            id="endTime"
            withLabel
            labelText="End Time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
            }}
          />
          <Button text="submit" type="submit" />
          <Button
            text="clear"
            onClick={() => {
              setAvailabilityFilterDates(null);
              setEndDate("");
              setEndTime("");
              setStartDate("");
              setStartTime("");
            }}
          />
        </form>
      )}
    </div>
  );
}
