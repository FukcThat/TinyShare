import { twMerge } from 'tailwind-merge';

export default function ContentText({ text = 'DEFAULT_TEXT', styles = '' }) {
  return (
    <h3 className={twMerge(['text-lg w-full text-text-primary', styles])}>
      {text}
    </h3>
  );
}
