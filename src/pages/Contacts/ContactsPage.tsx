import React, { useState } from 'react';
import styles from './ContactsPage.module.css';

export const ContactsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });
    const [sent, setSent] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
        setTimeout(() => setSent(false), 4000);
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <h1 className={styles.bigTitle}>КОНТАКТИ</h1>
                <div className={styles.grid}>
                    <div className={styles.left}>
                        <h2 className={styles.sectionTitle}>Наші контакти</h2>

                        <ul className={styles.contactList}>
                            <li className={styles.contactItem}>
                                <span className={styles.contactIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                </span>
                                <span>+38 (067) 123-45-67</span>
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.contactIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </svg>
                                </span>
                                <span>info@dronex.com.ua</span>
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.contactIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </span>
                                <span>вул. Університетська, 22, м. Дніпро, 49000, Україна</span>
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.contactIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                </span>
                                <span>Пн–Пт: 10:00 — 18:00, Сб–Нд: вихідні</span>
                            </li>
                        </ul>

                        <div className={styles.socialBlock}>
                            <p className={styles.socialTitle}>Ми в соцмережах:</p>
                            <div className={styles.socialLinks}>
                                <a href="#" className={styles.socialLink} aria-label="Facebook">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                    </svg>
                                </a>
                                <a href="#" className={styles.socialLink} aria-label="Telegram">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 6.75a2.25 2.25 0 0 0 .126 4.238l3.264 1.068 1.543 4.872a1.5 1.5 0 0 0 2.489.615l2.078-2.086 3.788 2.898a2.25 2.25 0 0 0 3.52-1.388l2.25-15a2.25 2.25 0 0 0-1.536-2.182zM9.847 15.26l-.99 3.12-.888-2.804 7.196-7.205-5.318 6.889z"/>
                                    </svg>
                                </a>
                                <a href="#" className={styles.socialLink} aria-label="Instagram">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                        <circle cx="12" cy="12" r="4"/>
                                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={styles.right}>
                        <h2 className={styles.sectionTitle}>Зв'язатися з нами</h2>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.field}>
                                <label className={styles.label}>Ім'я</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Ваше Ім'я"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Телефон</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="+ 38 0"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>E-mail</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Ваш E-mail"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Повідомлення</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={styles.textarea}
                                    placeholder="Ваше повідомлення"
                                    rows={5}
                                />
                            </div>

                            {sent && <p className={styles.successMsg}>Повідомлення надіслано!</p>}

                            <button type="submit" className={styles.submitBtn}>
                                НАДІСЛАТИ
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};