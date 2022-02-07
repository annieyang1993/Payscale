import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import {Firebase, db} from '../../config/firebase';
import AuthContext from '../../context/Context';
import {AiOutlineSearch} from 'react-icons/ai'


export default function Footer() {
    const authContext = useContext(AuthContext);
    const [email, setEmail] = useState('');

  return (
        <div className = "footer">
            <div className = 'copyright'>© 2022 Payscale. All rights reserved.</div>
            <div className = 'contact'>
              Made with ❤️ in New York City</div>
            
        </div>


  );
}