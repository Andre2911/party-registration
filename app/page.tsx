'use client';
import styles from "./page.module.css";
import {Suspense, useEffect, useState} from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import useCurrentTime from "@/app/hooks/useCurrentTime";
import useBarCodeScanner from "@/app/hooks/useBarCodeScanner";
import {getUserData} from "@/app/lib/actions";

interface User{
    name: string;
    lastName: string;
    isInvited: boolean;
    hasEntered: string | undefined | null
}

export default function Home() {

    const [ user, setUser ] = useState<User>({
        name: "Bienvenido a ",
        lastName: "Apec Perú",
        isInvited: false,
        hasEntered: null,
    })
    const [loading, setLoading] = useState(false);

    const [ dni, setDni ] =  useState('');
    const currentTime = useCurrentTime();

    const handleScan = async (barcode: string) => {
        console.log('Código escaneado:', barcode);
        setLoading(true);
        try {
            const userData = await getUserData(barcode);
            setUser({
                name: userData.name,
                lastName: userData.lastName,
                isInvited: userData.is_invited,
                hasEntered: userData.hasEntered
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Detener el loader una vez que se completa la operación
        }
    };

    useBarCodeScanner(handleScan);

    const chipStyle = user.isInvited ? styles.invited : styles.notInvited;
    return (
        <div className={styles.container}>
            <Header/>
            <main className={styles.main}>
                {loading ? (
                    <p className={styles.loader}>Cargando...</p> // Puedes reemplazar esto con un spinner o cualquier otro indicador visual
                ) : (
                    <>
                        <h1 className={styles.description}>
                            {user.name + ' ' + user.lastName}
                        </h1>
                        <p className={`${styles.chip} ${chipStyle}`}>{user.isInvited ? 'Invitado' : 'No Invitado'}</p>
                        {user.hasEntered === "Ya ingresó" && (
                            <p className={`${styles.chip} ${styles.hasentered}`}>{user.hasEntered}</p>
                        )}
                        <Suspense>
                            <p className={styles.hour}>{currentTime?.toLocaleTimeString()}</p>
                        </Suspense>
                    </>
                )}
            </main>
            <Footer/>
        </div>
    );
}

