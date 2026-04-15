import { Button } from "@/shared/components/form/Button"

export const UpgradePlanCard = () => {
  return (
    <>
      <div className="mb-4 bg-linear-to-br from-indigo-200 to-purple-200 dark:from-indigo-800/20 dark:to-purple-800/20 shadow p-4 rounded-4xl">
        <h3 className="text-xl text-mist-900 dark:text-mist-50 font-extrabold mb-1">
          Pasate a Pro
        </h3>
        <p className="text-mist-700 dark:text-mist-400 mb-2">
          Obtené funciones que te ayudarán a hacer crecer tu negocio
        </p>

        <Button className="button-primary w-full">Mejorar plan</Button>
      </div>
    </>
  )
}
