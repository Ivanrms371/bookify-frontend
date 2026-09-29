import React, { useState } from 'react';
import { PlanGrid } from './plan-grid';
import { Heading } from '@/shared/components/typography';
import { cn } from '@/shared/utils';

export const Plans = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <>
      <Heading className="font-semibold text-4xl md:text-5xl text-center mb-6">Selecciona un plan</Heading>
      <div className="relative mb-8 flex w-72 gap-4 rounded-full border border-gray-100 bg-white p-1 mx-auto">
        <button
          onClick={() => setIsAnnual(false)}
          className="z-10 flex w-full flex-1 cursor-pointer items-center justify-center rounded-full bg-transparent py-2 text-sm font-medium text-gray-800 transition-colors duration-300"
          type="button"
        >
          Mensual
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          className="z-10 flex w-full flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-transparent py-2 text-sm font-medium text-gray-800 transition-colors duration-300"
          type="button"
        >
          Anual
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600">-20%</span>
        </button>
        <span
          className={cn(
            'absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] translate-x-0 rounded-full border border-gray-300 bg-gray-100 transition-transform duration-300 ease-in-out',
            isAnnual && 'translate-x-full',
          )}
        />
      </div>
      <PlanGrid isAnnual={isAnnual} />
    </>
  );
};
