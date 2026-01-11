import { twMerge } from 'tailwind-merge';
import ContentText from './Text/ContentText';

export default function Input({
  id = '',
  withLabel = false,
  labelText = '',
  type = 'text',
  placeholder = '',
  value = null,
  onChange = () => {},
  outerStyles = '',
  labelStyles = '',
  inputStyles = '',
  disabled = false,
  required = false,
  maxLength = 25,
}) {
  return (
    <div className={twMerge(['flex gap-2 items-center text-lg ', outerStyles])}>
      {withLabel && (
        <label
          htmlFor={id}
          className={twMerge([`hover:cursor-pointer`, labelStyles])}
        >
          <ContentText text={labelText} />
        </label>
      )}
      <div className={twMerge(['relative w-full rounded-md   ', inputStyles])}>
        <input
          required={required}
          disabled={disabled}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          checked={value}
          onChange={onChange}
          className={twMerge([
            ' outline-none text-center w-full text-lg border border-white/40 py-2 focus:border-accent rounded-md',
          ])}
        />
        {type != 'time' && type != 'date' && (
          <div
            className={`absolute right-1 bottom-1 text-sm text-text-primary/80  ${
              value.length === maxLength && 'text-warning'
            }`}
          >
            {value.length} / {maxLength}
          </div>
        )}
      </div>
    </div>
  );
}
