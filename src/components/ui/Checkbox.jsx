import { twMerge } from 'tailwind-merge';
import SubContentText from './Text/SubContentText';
import ContentText from './Text/ContentText';

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
        <ContentText text={labelText} />
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
