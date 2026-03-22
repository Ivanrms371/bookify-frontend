import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

type Props = React.HTMLAttributes<HTMLAnchorElement> & {
  center?: boolean;
};

export const TurnifyLogo = ({ className, center = false, ...props }: Props) => {
  return (
    <Link
      to="/"
      className={twMerge(
        className,
        center && "flex justify-center mx-auto ",
        "bg-mist-800 dark:bg-mist-950  size-18 flex justify-center items-center rounded-full",
      )}
      {...props}
    >
      {/* <img
        src="/turnify/bookify-2.png"
        alt="Turnify Logo"
        className="rounded-full"
      /> */}
      <span className="font-bold font-mono text-mist-100">Bookify</span>
    </Link>
  );
};
