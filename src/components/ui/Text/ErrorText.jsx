import { twMerge } from 'tailwind-merge';

export default function ErrorText({ text = 'DEFAULT_TEXT', styles = '' }) {
  return (
    <h5
      className={twMerge([
        'text-xs text-text-warning w-full text-center',
        styles,
      ])}
    >
      {text}
    </h5>
  );
}

