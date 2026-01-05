import { twMerge } from 'tailwind-merge';

export default function TextArea({
  disabled = false,
  value = '',
  onChange = () => {},
  inputStyles = '',
  containerStyles = '',
  maxLength = 100,
  id = '',
}) {
  return (
    <div className={twMerge(['relative w-full h-full', containerStyles])}>
      <textarea
        id={id}
        className={twMerge([
          ' border border-white/40 text-start text-lg focus:border-accent w-full rounded-md p-2 outline-0',
          inputStyles,
        ])}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e)}
        maxLength={maxLength}
      />
      <div
        className={`absolute right-1 bottom-1 text-sm text-text-primary/80 ${
          value.length === maxLength && 'text-warning'
        }`}
      >
        {value.length} / {maxLength}
      </div>
    </div>
  );
}
