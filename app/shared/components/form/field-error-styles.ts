/** Soft red halo for invalid outline-based fields (Input, Select). */
export const fieldErrorOutlineClassName =
  'outline-red-500 ring-[3px] ring-red-500/20 transition-[outline-color,box-shadow] duration-300 ease-out focus:outline-red-500 focus:ring-[4px] focus:ring-red-500/30 dark:outline-red-500 dark:ring-red-400/25 dark:focus:ring-red-400/35';

/** Soft red halo for invalid border-based fields (Textarea, ImageInput). */
export const fieldErrorBorderClassName =
  'border-red-500 ring-[3px] ring-red-500/20 transition-[border-color,box-shadow] duration-300 ease-out focus:border-red-500 focus:ring-[4px] focus:ring-red-500/30 dark:border-red-500 dark:ring-red-400/25 dark:focus:ring-red-400/35';

/** Same halo for composite fields that use focus-within (e.g. slug prefix input). */
export const fieldErrorBorderFocusWithinClassName = fieldErrorBorderClassName.replaceAll('focus:', 'focus-within:');
