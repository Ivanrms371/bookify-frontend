type Props = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ children, ...props }: Props) => {
  return (
    <label
      {...props}
      className="font-medium text-gray-600 dark:text-gray-400 text-sm"
    >
      {children}
    </label>
  );
};
