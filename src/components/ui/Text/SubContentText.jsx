import { twMerge } from 'tailwind-merge';

export default function SubContentText({ text = 'DEFAULT_TEXT', styles = '' }) {
  return (
    <h4 className={twMerge(['text-base w-full text-text-primary', styles])}>
      {text}
    </h4>
  );
}

