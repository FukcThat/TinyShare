import { twMerge } from "tailwind-merge";

export default function Checkbox({
  id = "checkbox",
  withLabel = true,
  labelText = "Checkbox Label",
  value = false,
  onChange = () => {},
  styles = "",
  disabled = false,
}) {
  return (
    <div className={twMerge([styles, "flex gap-4"])}>
      <label htmlFor={id}>{labelText}</label>
      <input
        disabled={disabled}
        type="checkbox"
        checked={value}
        onChange={onChange}
        id={id}
      />
    </div>
  );
}
