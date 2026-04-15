export const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500 dark:text-red-700";
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-600";
    return "text-mist-400 dark:text-mist-500";
}

export const getBarColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-400 dark:bg-red-800";
    if (percentage >= 70) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-mist-300 dark:bg-mist-600";
}