import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom'
import AuthContext from '../../context/Context'
import {useStripe, useElements, PaymentElement, CardElement,} from '@stripe/react-stripe-js';
import {Elements, StripeProvider} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {Firebase, db, functions} from '../../config/firebase';
import {GiReceiveMoney} from 'react-icons/gi'
import {BsCoin} from 'react-icons/bs'
import {BsCheckLg} from 'react-icons/bs'
import {BsFillCalendarCheckFill, BsNewspaper} from 'react-icons/bs'
import {AiOutlineLineChart, AiTwotoneCalendar} from 'react-icons/ai'
import Resizer from 'react-image-file-resizer'
import ReactMarkdown from 'react-markdown';
import Footer from '../components/footer'
import Select from 'react-select'


import {BiSupport} from 'react-icons/bi'
//import {Firebase, db} from '../config/firebase';
require('react-dom');

function Welcome(){
    const authContext = useContext(AuthContext);
    var entries = 0;

    function currencyFormat(num) {
        return '$' + String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return(
        <div className = 'content'>
            <div className = 'title-wrapper-welcome'>
            <div className='title-welcome'>Payscale <GiReceiveMoney className='icon-welcome'/></div>
            </div>

            <div className = 'welcome-inner'>
                <Link to='/paths' className = 'button-left'>Titles</Link> <br/>
                <Link to='/salaries' className = 'button-right'>Salaries</Link>
                <Link to='/paths' className = 'button-right'>Support Payscale</Link>
            </div>
        </div>
    )
}


export default Welcome;