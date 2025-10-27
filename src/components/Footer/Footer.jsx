import React from 'react'
import styles from "./Footer.module.css"
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer>
      {/* Top of the Div */}
      <div className="footer sm:footer-horizontal bg-[#083365] text-base-content p-10">
  <aside>
     <Link href="/" className={styles.logocontainer}>
            <Image
              src="/logo.jpeg"
              alt="GammaDevs Logo"
              className={styles.img}
              fill
            />
          </Link>
    <p>
      GammaDevs Technologies Limited.
      <br />
      Providing reliable tech since 1992
    </p>
  </aside>
  <nav>
    <h6 className="footer-title">Services</h6>
    <span className="link link-hover">Development</span>
    <span className="link link-hover">Design</span>
    <span className="link link-hover">Consulations</span>
    <span className="link link-hover">Bulding</span>
  </nav>
  <nav>
    <h6 className="footer-title">Company</h6>
    <Link href="#home" className="link link-hover">Home</Link>
    <Link href="#about" className="link link-hover">About us</Link>
    <Link href="#team" className="link link-hover">Meet the Team</Link>
    <Link href="#projects" className="link link-hover">Projects</Link>
  </nav>
  <nav>
    <h6 className="footer-title">Legal</h6>
    <a className="link link-hover">Terms of use</a>
    <a className="link link-hover">Privacy policy</a>
  </nav>
</div>
{/* Bottom of the Footer */}
  <div className="footer sm:footer-horizontal footer-center bg-[#000000] text-base-content p-4">
  <aside>
    <p>Copyright © {new Date().getFullYear()} - All right reserved by GammaDevs Technologies Limited</p>
  </aside>
</div>
    </footer>
  )
}

export default Footer
