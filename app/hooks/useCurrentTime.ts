import {useEffect, useState} from "react";

export default function useCurrentTime() {
    const [ currentTime, setCurrentTime ] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000)
        return () => clearInterval(timer)
    }, [])
    return currentTime
}