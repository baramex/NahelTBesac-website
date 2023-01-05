import clsx from "clsx";

export default function Tooltip({ children, content, className, ...props }) {
    return <>
        <div className={clsx("group relative", className)} {...props}>
            {children}
            <div role="tooltip" className="w-max max-w-xs bottom-full md:top-full left-1/2 mt-1 -translate-x-1/2 absolute invisible z-50 py-2 px-3 text-sm text-theme-700 bg-gray-50 border border-theme-200 rounded-lg shadow-md opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
                {content}
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
        </div>
    </>;
}