import { twMerge } from "tailwind-merge";

export default function Dropdown({
  value,
  onChange = () => {},
  options = [],
  optionKey = "id",
  optionValue = "id",
  optionLabel = "name",
  optionsAreObjects = true,
  styles = "",
  optionStyles = "",
}) {
  return (
    <select
      className={twMerge([styles, "bg-slate-900"])}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => {
        return (
          <option
            className={twMerge([optionStyles, "bg-slate-800"])}
            key={optionsAreObjects ? option[optionKey] : option}
            value={optionsAreObjects ? option[optionValue] : option}
          >
            {optionsAreObjects ? option[optionLabel] : option}
          </option>
        );
      })}
    </select>
  );
}
