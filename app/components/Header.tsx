import styles from './Header.module.css'
import Image from "next/image";

export default function Header(){
    return(
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Image
                    src="/logotipo.jpg"
                    alt="Logotipo de la empresa"
                    width={150}
                    height={100}
                />
            </div>
        </header>
    )
}