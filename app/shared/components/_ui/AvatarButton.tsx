import { Avatar } from "./Avatar";

interface AvatarButtonProps {
  src?: string;
  name?: string;
  onClick: () => void;
}

export const AvatarButton = ({ src, name, onClick }: AvatarButtonProps) => {
  return (
    <button type="button" onClick={onClick}>
      <Avatar src={src} name={name} size="md" />
    </button>
  );
};
