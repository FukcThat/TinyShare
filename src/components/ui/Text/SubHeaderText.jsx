import { twMerge } from 'tailwind-merge';

export default function SubHeaderText({ text, styles }) {
  return (
    <h2 className={twMerge([' text-xl w-full text-text-primary', styles])}>
      {text}
    </h2>
  );
}
