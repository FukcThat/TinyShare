
import { twMerge } from 'tailwind-merge';

export default function SubFadedText({ text = 'DEFAULT_TEXT', styles = '' }) {
  return (
    <h6 className={twMerge(['text-xs w-full text-text-primary/75', styles])}>
      {text}
    </h6>
  );
}

