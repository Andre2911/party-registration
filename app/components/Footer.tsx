import styles from './footer.module.css'

export default function Footer() {
    return(
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.item}>
                        © 2024 APEC Perú. Todos los derechos reservados.
                </div>
                <div className={styles.item}>
                        <a href="mailto:joniguevara1@gmail.com">Contacto: joniguevara1@gmail.com</a>
                </div>
            </div>
        </footer>
    )
}