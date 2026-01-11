import { twMerge } from 'tailwind-merge';

export default function FadedText({ text = 'DEFAULT_TEXT', styles = '' }) {
  return (
    <h5 className={twMerge(['text-sm w-full text-text-primary/75', styles])}>
      {text}
    </h5>
  );
}

