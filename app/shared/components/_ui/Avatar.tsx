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
    <div className="size-12 flex justify-center items-center bg-gray-200 text-gray-950 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 dark:text-gray-200 rounded-full font-medium">
      {initials}
    </div>
  );
};
