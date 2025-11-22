import { twMerge } from "tailwind-merge";

export default function Input({
  id = "",
  withLabel = false,
  labelText = "",
  type = "text",
  placeholder = "...",
  value = null,
  onChange = () => {},
  outerStyles = "",
  labelStyles = "",
  inputStyles = "",
  disabled = false,
  required = false,
}) {
  return (
    <div className={twMerge(["flex gap-2 items-center text-lg ", outerStyles])}>
      {withLabel && (
        <label
          htmlFor={id}
          className={twMerge([, `hover:cursor-pointer`, labelStyles])}
        >
          {labelText}
        </label>
      )}
      <input
        required={required}
        disabled={disabled}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={twMerge([
          "outline-none p-2 border-white/40 border-b text-center rounded-md text-lg",
          inputStyles,
        ])}
      ></input>
    </div>
  );
}
