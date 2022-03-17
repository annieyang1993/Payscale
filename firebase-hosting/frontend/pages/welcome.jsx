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
import Header from '../components/header'


import {BiSupport} from 'react-icons/bi'
//import {Firebase, db} from '../config/firebase';
require('react-dom');

function Welcome(){
    const authContext = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [subscribeError, setSubscribeError] = useState(false);
    const [loading, setLoading] = useState(false);

    function currencyFormat(num) {
        return '$' + String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    const handleSubscribe = async ()=>{
        if (subscribed === false){
            setLoading(true);
            if (email.includes('@')===false || email.includes('.')===false){
              setSubscribeError(true);
              setLoading(false);
            } else{
              setSubscribeError(false);
              var newSubscription = new Object();
              newSubscription[email] = true;
              const data = await Firebase.firestore().collection('emails').doc('emails').set(newSubscription, {merge: true})
              await new Promise((resolve)=>setTimeout(resolve, 300));
              setLoading(false);
              setSubscribed(true);
            }
            
            // var emailsArray = emails.emails;
            // emailsArray.push(email);

        }
    }

    return(
        <div className = 'content'>
            
        </div>
    )
}


export default Welcome;