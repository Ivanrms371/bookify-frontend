import { ClockIcon, PhotoIcon, TagIcon } from '@heroicons/react/24/outline';
import type { Service } from '../../types/services.types';
import { formatDurationMinutesSmall } from '../../constants/service-duration';
import { ServiceActions } from './service-actions';

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const { name, durationMinutes, price, imageUrl, discountPercentage, discountFixed } = service;
  const hasDiscount = discountPercentage > 0 || discountFixed > 0;

  return (
    <div className="border border-gray-100 relative w-full max-w-sm overflow-hidden rounded-2xl bg-white hover:bg-gray-100 group cursor-pointer">
      {/* Image */}
      <div className="relative h-48 w-full pt-2 px-2">
        {imageUrl && <img src={imageUrl} alt="Service" className="h-full w-full object-cover rounded-lg transition duration-300" />}
        {!imageUrl && (
          <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
            <PhotoIcon className="size-12 text-gray-400" />
          </div>
        )}

        {/* Options */}
        <div className="group-hover:opacity-100 transition-all duration-300 opacity-0 absolute right-4 top-4">
          <ServiceActions service={service} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5 px-4 py-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">$450,00</p>
            <div className="flex items-center gap-1.5">
              <ClockIcon className="size-5 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">{formatDurationMinutesSmall(durationMinutes)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
