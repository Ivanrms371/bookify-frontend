import { BellIcon } from "@heroicons/react/24/outline";

export const NotificationsBell = () => {
  const count = 5;
  return (
    <button className="size-12 flex justify-center items-center dark:bg-gray-900 bg-gray-200 rounded-full relative">
      <BellIcon className="size-5 text-gray-500 dark:text-gray-300" />
      {count > 0 && (
        <span className="absolute top-0 right-0 w-4.5 h-4.5 bg-red-500 text-gray-100 rounded-full text-[0.625rem] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
};
