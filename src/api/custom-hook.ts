import { useState, useEffect } from "react";
import { debounce } from "./utils";

export function useSize() {
    const getSize = () => {
        const { availWidth, availHeight } = window.screen;
        const { clientWidth, clientHeight } = window.document.documentElement;
        const width = Math.min(availWidth, clientWidth);
        const height = Math.min(availHeight, clientHeight);
        return { width, height }
    }

    const [size, setSize] = useState(() => getSize())

    useEffect(() => {
        function onResize() {
            setSize(getSize())
        }

        window.addEventListener('resize', debounce(onResize,300), false)
        return () => window.removeEventListener('resize', debounce(onResize,300), false)
    }, [])

    return [size, setSize]
}