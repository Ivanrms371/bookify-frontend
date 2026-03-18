interface Props {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: Props) => {
  return (
    <div className="flex flex-col gap-6 justify-center w-full max-w-lg px-6">
      {children}
    </div>
  );
};
