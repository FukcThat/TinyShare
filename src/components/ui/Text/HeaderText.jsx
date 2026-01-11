import { twMerge } from 'tailwind-merge';

export default function HeaderText({ text = 'DEFAULT_TEXT', styles = '' }) {
  return (
    <h1 className={twMerge([' text-2xl w-full text-text-primary', styles])}>
      {text}
    </h1>
  );
}
