import { twMerge } from 'tailwind-merge';
import SubContentText from './Text/SubContentText';

export default function Button({
  text = 'Button TEST',
  onClick = () => {},
  type = 'button',
  styles = '',
  disabled = false,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={twMerge([
        ` bg-slate-600 px-4 py-2 rounded-md hover:bg-slate-500 cursor-pointer disabled:opacity-20 disabled:hover:bg-slate-600`,
        styles,
      ])}
      type={type}
    >
      <SubContentText text={text} />
    </button>
  );
}
