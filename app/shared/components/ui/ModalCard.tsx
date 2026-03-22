import { CheckIcon, ClockIcon } from "lucide-react";
import React from "react";

export const ModalCard = () => {
  return (
    <>
      {/* Overlay */}
      <div className="bg-mist-800/60 fixed inset-0 z-50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="bg-mist-50 p-10 rounded-4xl z-50 fixed top-1/2 left-1/2 
        transform -translate-x-1/2 -translate-y-1/2 max-w-4xl w-full"
      >
        <div className="flex flex-col items-center text-center">
          {/* Title */}
          <h2 className="text-4xl font-bold text-mist-900 mb-3">
            Bienvenido a Turnify, Iván.
          </h2>

          <p className="text-mist-500 text-lg mb-8">
            Vamos a hacer una configuración rápida de tu negocio.
          </p>

          {/* Steps indicator */}
          <div className="flex gap-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-mist-900" />
            <span className="w-2 h-2 rounded-full bg-mist-300" />
            <span className="w-2 h-2 rounded-full bg-mist-300" />
            <span className="w-2 h-2 rounded-full bg-mist-300" />
          </div>

          {/* Checklist */}
          <ul className="text-sm text-mist-600 space-y-2 mb-10">
            <li className="flex items-center gap-2">
              <CheckIcon className="size-5 text-mist-400" /> Datos básicos del
              negocio
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="size-5 text-mist-400" /> Servicios y precios
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="size-5 text-mist-400" /> Horarios de
              atención
            </li>
          </ul>

          {/* Time */}
          <p className="flex items-center gap-2 text-sm text-mist-500 mb-8">
            <ClockIcon className="size-5 text-mist-400" /> Esto te llevará menos
            de 3 minutos
          </p>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              className="bg-mist-50 border border-mist-200 text-mist-700 px-6 py-3 rounded-full font-medium hover:bg-mist-100"
            >
              Más tarde
            </button>

            <button
              type="button"
              className="text-white bg-mist-900 px-6 py-3 rounded-full font-medium"
            >
              Comenzar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
