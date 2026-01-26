import { twMerge } from 'tailwind-merge';

export default function Dropdown({
  value,
  onChange = () => {},
  options = [],
  optionKey = 'id',
  optionValue = 'id',
  optionLabel = 'name',
  optionsAreObjects = true,
  styles = '',
  optionStyles = '',
}) {
  console.log(options.length);
  return options.length === 1 ? (
    <h1 className="text-2xl mx-2 ">
      {optionsAreObjects ? options[0][optionLabel] : options[0]}
    </h1>
  ) : (
    <select
      className={twMerge([
        styles,
        ' text-2xl bg-primary cursor-pointer text-center w-auto',
      ])}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => {
        return (
          <option
            className={twMerge([
              optionStyles,
              'bg-secondary cursor-pointer text-center',
            ])}
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
