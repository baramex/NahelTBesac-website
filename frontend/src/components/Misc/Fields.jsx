import clsx from "clsx";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Label({ optinal, children, id }) {
    return (<label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-white"
    >
        {children}
        {optinal && <span className='text-xs text-gray-500 ml-2'>({optinal})</span>}
    </label>);
}

function Field({ Element, defaultValue = "", className, showChanged, forwardRef, ...props }) {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if (!value && defaultValue) setValue(defaultValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    return (
        <Element empty={!value ? "true" : undefined} ref={forwardRef} value={value} changed={defaultValue || showChanged ? value === defaultValue ? undefined : "true" : undefined} onChange={e => setValue(e.target.value)} {...props} className={clsx("block w-full bg-white [[changed_&]]:border-blue-400 focus:[[changed_&]]:border-blue-500 [&:not([empty])]:invalid:border-red-500 [&:not([empty])]:invalid:focus:border-red-600 disabled:cursor-not-allowed disabled:bg-theme-50 disabled:text-theme-500 appearance-none shadow-sm rounded-md border border-transparent px-3 py-2.5 text-theme-800 placeholder-gray-400 transition-colors focus:border-theme-300 focus:outline-none focus:ring-0 sm:text-sm", className)} />
    );
}

export function TextField({
    id,
    label,
    type = 'text',
    className = '',
    optinal,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={className}>
            {label && <Label id={id} optinal={optinal}>{label}</Label>}
            {type === "password" ?
                <div className='relative overflow-hidden group'>
                    <Field Element="input" id={id} type={showPassword ? "text" : "password"} {...props} className="peer pr-10" />
                    <input id={"show-" + id} name='show' checked={showPassword} onChange={e => setShowPassword(e.target.checked)} className='hidden' type="checkbox" />
                    <label htmlFor={"show-" + id} className={clsx('transition-transform absolute flex items-center mr-3 right-0 top-0 h-full peer-focus:translate-y-0 hover:translate-y-0 cursor-pointer', showPassword ? "translate-y-0" : "-translate-y-full")}>
                        <EyeIcon className={clsx('stroke-theme-500 stroke-1 hover:stroke-theme-700', showPassword ? "hidden" : "")} width="22" />
                        <EyeSlashIcon className={clsx('stroke-1 stroke-theme-500 hover:stroke-theme-700', !showPassword ? "hidden" : "")} width="22" />
                    </label>
                </div>
                :
                <Field Element="input" id={id} type={type} {...props} />
            }
        </div >
    )
}