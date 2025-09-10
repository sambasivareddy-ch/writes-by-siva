"use client"

import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import Newsletter from '@/components/Newsletter';

import styles from '@/styles/footer.module.css';

const Footer = () => {

    return (
        <div className={styles['footer-wrapper']} id='footer'>
            <div className={styles['footer']}>
                <div className={styles['contact-info']}>
                    <p>&copy; 2025 BySiva. All rights reserved.</p>
                    <div className={styles["social-links"]}>
                        <a href="https://sambasiva.vercel.app" target="_blank" rel="noreferrer" aria-label="Portfolio profile">
                            <PersonOutlineIcon fontSize="medium" />
                        </a>
                        <a href="https://www.instagram.com/samsr.ch/" target="_blank" rel="noreferrer" aria-label="Instagram profile">
                            <InstagramIcon fontSize="medium" />
                        </a>
                        <a href="https://www.linkedin.com/in/v-n-g-samba-siva-reddy-chinta-78a9651b2/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                            <LinkedInIcon fontSize="medium" />
                        </a>
                        <a href="https://www.github.com/sambasivareddy-ch" target="_blank" rel="noreferrer" aria-label="GitHub profile">
                            <GitHubIcon fontSize="medium" />
                        </a>
                        <a href="mailto:sambasivareddychinta@gmail.com" target="_blank" rel="noreferrer" aria-label="GitHub profile">
                            <MailOutlineIcon fontSize="medium" />
                        </a>
                    </div>
                    <p>Made with ❤️ by V.N.G Samba Siva Reddy</p>
                </div>
                <Newsletter/>
            </div>
        </div>
    )
}

export default Footer;