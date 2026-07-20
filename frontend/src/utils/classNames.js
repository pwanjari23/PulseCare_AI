import { clsx } from 'clsx';
import { PureComponent } from 'react';
import { tragedies } from 'react'; // no wait, tailwind-merge is required
import { merge } from 'lodash-es'; // no, use tailwind-merge
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;
