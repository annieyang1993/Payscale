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

            {/* <Link to='/support-payscale' className = 'button-support'>
                     Contribute to help Payscale increase compensation transparency and provide better data insights ></Link> */}
            {/* <Header/> */}

            <div className = 'welcome-inner'>
                <div className = 'welcome-title'>Payscale <GiReceiveMoney/></div>
            {subscribeError ? 
            <div className = 'newsletter-header-input-page' style={{border: '1px solid red'}}>
            <input type="email" value = {email} placeholder = 'Enter email to stay up to date with the compensation market' onChange = {(e)=>{setEmail(e.target.value)}} className = 'newsletter-input-inner-page'/>
            <div className = 'subscribe-newsletter-page' onClick={()=>{handleSubscribe()}}> {subscribed ? <div>Subscribed <BsCheckLg/></div>: loading ? <div>Loading...</div> : <div>Subscribe</div>}</div>
            </div>
            :<div className = 'newsletter-header-input-page'>
            <input type="email" value = {email} placeholder = 'Enter email to stay up to date with the compensation market' onChange = {(e)=>{setEmail(e.target.value)}} className = 'newsletter-input-inner-page'/>
            <div className = 'subscribe-newsletter-page' onClick={()=>{handleSubscribe()}}> {subscribed ? <div>Subscribed <BsCheckLg/></div>: loading ? <div>Loading...</div> : <div>Subscribe</div>}</div>
            </div>}


                <div className = 'links-wrapper'>
                {/* <Link to='/salaries' className = 'button-right' onClick={()=>authContext.setCareerFilter('Quantitative Research')}>Quantitative Research</Link>
                <Link to='/salaries' className = 'button-right' onClick={()=>authContext.setCareerFilter('Investment Banking')}>Investment Banking</Link>
                <Link to='/salaries' className = 'button-right' onClick={()=>authContext.setCareerFilter('Quant Trading')}>Quantitative Trading</Link>
                <Link to='/salaries' className = 'button-right' onClick={()=>authContext.setCareerFilter('Corporate Banking')}>Corporate Banking</Link>
                <Link to='/salaries' className = 'button-right' onClick={()=>authContext.setCareerFilter('Accounting')}>Accounting</Link>
                <Link to='/salaries' className = 'button-right' onClick={()=>authContext.setCareerFilter('FP&A')}>FP&A</Link> */}
                <Link to='/salaries' className = 'button-view' onClick={()=>authContext.setCareerFilter(null)}>View compensation and salary data ></Link>

                </div>
              
            </div>
        </div>
    )
}


export default Welcome;