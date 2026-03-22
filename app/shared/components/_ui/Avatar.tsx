interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "size-10", md: "size-12", lg: "size-14" };

export const Avatar = ({ src, name, size = "md" }: AvatarProps) => {
  const initials = name?.substring(0, 2).toUpperCase() ?? "??";

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "Profile"}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className="size-12 flex justify-center items-center bg-mist-200 text-mist-950 dark:bg-mist-900 border border-mist-300 dark:border-mist-800 dark:text-mist-200 rounded-full font-medium">
      {initials}
    </div>
  );
};
