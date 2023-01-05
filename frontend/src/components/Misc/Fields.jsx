import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon, QuestionMarkCircleIcon, StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { FuelGauge } from "../Images/Icons";
import Tooltip from "./Tooltip";

const fieldClassname = {
    white: "block w-full bg-white [[changed_&]]:border-blue-400 focus:[[changed_&]]:border-blue-500 [&:not([empty])]:invalid:border-red-500 [&:not([empty])]:invalid:focus:border-red-600 disabled:cursor-not-allowed disabled:bg-theme-50 disabled:text-theme-500 shadow-sm rounded-md border border-transparent px-3 py-2.5 text-theme-800 placeholder-gray-400 transition-colors focus:border-theme-300 focus:outline-none focus:ring-0 sm:text-sm",
    theme: "block w-full bg-theme-50 [[changed_&]]:border-blue-400 focus:[[changed_&]]:border-blue-500 [&:not([empty])]:invalid:border-red-500 [&:not([empty])]:invalid:focus:border-red-600 disabled:cursor-not-allowed disabled:bg-theme-50 disabled:text-theme-500 shadow-sm rounded-md border border-theme-200 px-3 py-2.5 text-theme-800 placeholder-gray-400 transition-colors focus:border-theme-300 focus:outline-none focus:ring-0 sm:text-sm",
};

export function Label({ optinal, children, showRequired, variant = "white", tooltip, className, id }) {
    return (<label
        htmlFor={id}
        className={clsx("mb-2 block text-sm font-medium", variant === "white" ? "text-white" : "text-theme-800", className, showRequired && "after:content-['_*'] after:text-red-600")}
    >
        {children}
        {optinal && <span className='text-xs text-gray-500 ml-2'>({optinal})</span>}
        {tooltip && <Tooltip className="inline ml-2 cursor-help" content={tooltip}><QuestionMarkCircleIcon className='w-[1.4rem] text-gray-400 inline' /></Tooltip>}
    </label>);
}

export function Field({ Element, defaultValue = "", className, showChanged, unit, variant = "white", forwardRef, value: dvalue, onChange, ...props }) {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if (!value && defaultValue) setValue(defaultValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    const Parent = unit ? "div" : Fragment;
    const p = {};
    if (unit) p.className = "relative";

    return (<Parent {...p}>
        <Element empty={dvalue ? undefined : !value ? "true" : undefined} ref={forwardRef} value={dvalue || value} changed={dvalue ? undefined : defaultValue || showChanged ? value === defaultValue ? undefined : "true" : undefined} onChange={onChange || (e => setValue(e.target.value))} {...props} className={clsx(fieldClassname[variant], className)} />
        {unit && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">
                {unit}
            </span>
        </div>}
    </Parent>);
}

export function TextField({
    id,
    label,
    type = 'text',
    className = '',
    inputClassName = '',
    optinal,
    variant,
    showRequired,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={className}>
            {label && <Label showRequired={showRequired} id={id} variant={variant} optinal={optinal}>{label}</Label>}
            {type === "password" ?
                <div className='relative overflow-hidden group'>
                    <Field variant={variant} Element="input" id={id} type={showPassword ? "text" : "password"} {...props} className={clsx("peer pr-10", inputClassName)} />
                    <input id={"show-" + id} name='show' checked={showPassword} onChange={e => setShowPassword(e.target.checked)} className='hidden' type="checkbox" />
                    <label htmlFor={"show-" + id} className={clsx('transition-transform absolute flex items-center mr-3 right-0 top-0 h-full peer-hover:translate-y-0 peer-focus:translate-y-0 hover:translate-y-0 cursor-pointer', showPassword ? "translate-y-0" : "-translate-y-full")}>
                        <EyeIcon className={clsx('stroke-theme-500 stroke-1 hover:stroke-theme-700', showPassword ? "hidden" : "")} width="22" />
                        <EyeSlashIcon className={clsx('stroke-1 stroke-theme-500 hover:stroke-theme-700', !showPassword ? "hidden" : "")} width="22" />
                    </label>
                </div>
                :
                <Field variant={variant} className={inputClassName} Element="input" id={id} type={type} {...props} />
            }
        </div >
    )
}

export function SelectMenuField({
    id,
    label,
    className = '',
    inputClassName = '',
    optinal,
    variant,
    showRequired,
    children,
    ...props
}) {
    return (
        <div className={className}>
            {label && <Label showRequired={showRequired} id={id} variant={variant} optinal={optinal}>{label}</Label>}
            <Field variant={variant} className={inputClassName} Element="select" id={id} {...props}>
                {children}
            </Field>
        </div >
    )
}

export function StarRatingField({
    label,
    className = '',
    optinal,
    variant,
    showRequired,
    required
}) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    return (<div className={clsx(className, "flex flex-col")}>
        <Label optinal={optinal} variant={variant} showRequired={showRequired}>{label}</Label>
        <div className="flex items-center flex-1 relative">
            {[...Array(5)].map((star, index) => {
                return (
                    <button
                        type="button"
                        key={index + 1}
                        onClick={() => setRating(index + 1)}
                        onMouseEnter={() => setHover(index + 1)}
                        onMouseLeave={() => setHover(rating)}
                        className="focus:outline-none"
                    >
                        {index + 1 <= (hover || rating) ? <StarIcon className="text-theme-500 w-6" /> : <StarIconOutline className="text-theme-400 w-6" />}
                    </button>
                );
            })}
            <input min={0} max={5} className="opacity-0 pointer-events-none z-0 absolute top-0 left-0 h-full" type="number" name="star" id="star" onChange={() => { }} value={rating === 0 ? "" : rating} required={required} />
        </div>
    </div>);
}

export function FuelGaugeField({ id, variant, className, optinal, showRequired, label, required }) {
    const [fuel, setFuel] = useState(0);

    return (<div className={className}>
        <Label variant={variant} optinal={optinal} showRequired={showRequired}>{label}</Label>
        <div className="flex items-center gap-3">
            <FuelGauge percentage={fuel} canChange={true} onChange={setFuel} className="w-20 text-theme-900" />
            <TextField
                id={id}
                variant="theme"
                type="number"
                inputClassName="!py-1 !w-[5.25rem] pr-7"
                unit="%"
                value={String(fuel)}
                min={0}
                max={100}
                onChange={e => setFuel(e.target.value)}
                required={required} />
        </div>
    </div>);
}