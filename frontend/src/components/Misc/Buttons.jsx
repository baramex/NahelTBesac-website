import clsx from "clsx";

export function Button({
    children,
    className,
    ...props
}) {
    return (
        <button {...props} className={clsx('transition-colors px-4 py-2 text-sm rounded-md focus:outline-none hover:bg-theme-50 hover:text-theme-800 text-theme-700 bg-white', className)}>
            {children}
        </button>
    )
}