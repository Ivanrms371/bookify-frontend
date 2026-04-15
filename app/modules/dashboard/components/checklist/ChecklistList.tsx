interface ChecklistListProps {
  children: React.ReactNode
}

export const ChecklistList = ({ children }: ChecklistListProps) => {
  return <ul className="space-y-2">{children}</ul>
}
