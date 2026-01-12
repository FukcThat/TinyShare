import { twMerge } from 'tailwind-merge';
import SubContentText from './Text/SubContentText';

export default function Button({
  text = 'Button TEST',
  onClick = () => {},
  type = 'button',
  styles = '',
  disabled = false,
  icon = null,
  iconPos = 'center',
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={twMerge([
        ` bg-primary px-4 py-2 flex items-center justify-center rounded-md hover:bg-primary/80 hover:scale-105 active:scale-95 active:bg-primary/60 cursor-pointer disabled:opacity-20 disabled:hover:bg-slate-600`,
        styles,
        iconPos === 'center'
          ? 'flex-col'
          : iconPos === 'right'
          ? 'flex-row-reverse'
          : 'flex-row',
      ])}
      type={type}
    >
      {icon && icon}
      <SubContentText text={text} />
    </button>
  );
}
