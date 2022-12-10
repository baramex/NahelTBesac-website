import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import clsx from 'clsx';

export default function Carousel({ children }) {
    const [current, setCurrent] = useState(0);
    const container = useRef();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(current => current < children.length - 1 ? current + 1 : 0);
        }, 2500);

        return () => {
            clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const element = container.current.querySelector("ul > li:nth-child(" + (current + 2) + ")");
        const left = element.offsetLeft;

        container.current.scrollTo({ left: left - container.current.offsetWidth / 2 + element.offsetWidth / 2, behavior: "smooth" });
    }, [current]);

    return (<div ref={container} className="w-full overflow-hidden">
        <ul className="flex w-max">
            <li key={-1} className="brightness-75">{children.at(-1)}</li>
            {children.map((child, index) => <li key={index} className={clsx("transition brightness-75", index === current ? "!brightness-100" : "")}>{child}</li>)}
            <li key={children.length} className="brightness-75">{children[0]}</li>
        </ul>
    </div>);
}