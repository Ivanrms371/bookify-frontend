import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

type Props = React.HTMLAttributes<HTMLAnchorElement> & {
  center?: boolean;
};

export const TurnifyLogo = ({ className, center = false, ...props }: Props) => {
  return (
    <Link
      to="/"
      className={twMerge(className, center && "flex justify-center mx-auto")}
      {...props}
    >
      <img src="/turnify/4.svg" alt="Turnify Logo" />
    </Link>
  );
};
