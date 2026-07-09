import { AvatarImageInput } from './components/avatar-image-input';
import { CardImageInput } from './components/card-image-input';
import { CompactImageInput } from './components/compact-image-input';
import { BannerImageInput } from './components/banner-image-input';
import { type ImageInputProps } from './image-input.types';

export const ImageInput = (props: ImageInputProps) => {
  switch (props.variant) {
    case 'avatar':
      return AvatarImageInput(props);
    case 'card':
      return CardImageInput(props);
    case 'compact':
      return CompactImageInput(props);
    case 'banner':
      return BannerImageInput(props);
  }
};
