import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">

            <div className="footer-content-left">
                <h1 className="footer-logo">Food Express</h1>

                <p>
                  Fast and fresh food delivered to your doorstep.
                  Order from your favorite restaurants anytime.
                </p>

                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="Facebook" />
                    <img src={assets.twitter_icon} alt="Twitter" />
                    <img src={assets.linkedin_icon} alt="LinkedIn" />
                </div>
            </div>

            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91 9876543210</li>
                    <li>support@foodexpress.com</li>
                </ul>
            </div>

        </div>

        <hr />

        <p className="footer-copyright">
            © 2024 Food Express. All rights reserved.
        </p>
    </div>
  )
}

export default Footer
