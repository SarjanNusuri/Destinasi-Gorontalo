import { useState, useEffect, useRef } from "react";

export function useInView(options = {}) {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1, ...options }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return [ref, isInView];
}

export function useCountUp(target, duration = 2000, active = false) {
    const [count, setCount] = useState(0);
    const numericTarget = parseInt(target.replace(/[^0-9]/g, ""));
    const suffix = target.replace(/[0-9]/g, "");

    useEffect(() => {
        if (!active) return;
        let start = 0;
        const increment = numericTarget / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= numericTarget) {
                setCount(numericTarget);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [active, numericTarget, duration]);

    return `${count}${suffix}`;
}
