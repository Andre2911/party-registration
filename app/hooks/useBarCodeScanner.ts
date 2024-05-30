import {useEffect, useState} from "react";

export  default function useBarCodeScanner(onScan: (a: string) => void ) {
    const [ input, setInput ] = useState<string>('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Enter') {
                setInput(prev => prev + event.key);
            }else{
                onScan(input)
                setInput('')
            }
        }
        window.addEventListener("keydown", handleKeyDown);

        return ()=>{
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [input, onScan]);

    return input;
}