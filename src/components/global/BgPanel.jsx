import { twMerge } from 'tailwind-merge';

export default function BgPanel({ children, styles = '' }) {
  return (
    <div
      className={twMerge([
        'bg-secondary p-4 rounded-xl shadow  hover:shadow-accent/90 shadow-accent/50 flex flex-col items-center justify-between w-[90%] gap-4 relative',
        styles,
      ])}
    >
      {children}
    </div>
  );
}
