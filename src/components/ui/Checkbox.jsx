import { twMerge } from 'tailwind-merge';

export default function Checkbox({
  id = 'checkbox',
  labelText = 'Checkbox Label',
  value = false,
  onChange = () => {},
  styles = '',
  disabled = false,
}) {
  return (
    <div className={twMerge(['flex gap-4', styles])}>
      <label className="cursor-pointer" htmlFor={id}>
        {labelText}
      </label>
      <input
        className="w-6 h-6 justify-self-center accent-accent"
        disabled={disabled}
        type="checkbox"
        checked={value}
        onChange={onChange}
        id={id}
      />
    </div>
  );
}
