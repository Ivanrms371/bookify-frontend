type Props = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ children, ...props }: Props) => {
  return (
    <label
      {...props}
      className="font-medium text-mist-600 dark:text-mist-400 text-sm"
    >
      {children}
    </label>
  );
};
