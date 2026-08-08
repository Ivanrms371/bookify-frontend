interface BadgeProps {
  children: React.ReactNode;
  variant: 'red' | 'green' | 'blue' | 'yellow' | 'gray' | 'violet';
}
export const Badge = ({ children, variant }: BadgeProps) => {
  const colorClasses = {
    red: 'bg-red-50 text-red-700',
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    gray: 'bg-gray-50 text-gray-700',
    violet: 'bg-violet-50 text-violet-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[variant]}`}>{children}</span>
  );
};
