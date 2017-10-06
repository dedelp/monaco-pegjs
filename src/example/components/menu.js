import React from 'react'
import styles from './menu.scss'

export default props => {
    return (
        <ul className={styles.menuList}>
            <li className={styles.menuItem}>
                <a href="/trainer">
                    Trainer
                </a>
            </li>
            <li className={styles.menuItem}>
                <a href="/mapper">
                    Mapper
                </a>
            </li>
        </ul>
    )
}