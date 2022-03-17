import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
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
import {Link} from 'react-router-dom'
import SalaryForm from './salaryform'
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
// import {AuthenticatedUserContext} from './AuthenticatedUserProvider'
import {doc, setDoc} from 'firebase/firestore'
const auth = Firebase.auth();

import {BiSupport} from 'react-icons/bi'
//import {Firebase, db} from '../config/firebase';
require('react-dom');


function Signin() {
    const authContext = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);
    const [signupError, setSignupError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loginError, setLoginError] = useState('');

    const [feedback, setFeedback] = useState('');
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [feedbackloading, setFeedbackLoading] = useState(false);

    const sendFeedback = async () => {
        setFeedbackLoading(true);
        await Firebase.firestore().collection('feedback').doc().set({
            feedback: feedback,
            uid: authContext.userInfo.uid,
            created_on: new Date()
        })
        setFeedbackLoading(false);
        setFeedbackSent(true);
        setFeedback('');
    }

    useEffect(async () => {
    }, [])

    const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://payscale.finance/#/sign-in-verification',
    // This must be true.
    handleCodeInApp: true,
    };


    const handleSubmit = async (e) =>{
        e.preventDefault();
        setSubmitClicked(true);
        setLoading(true);
        try {
            if (email !== '') {
                // await auth.sendSignInLinkToEmail(email, actionCodeSettings);

                auth.sendSignInLinkToEmail(email, actionCodeSettings)
                .then(() => {
                    // The link was successfully sent. Inform the user.
                    // Save the email locally so you don't need to ask the user for it again
                    // if they open the link on the same device.
                    window.localStorage.setItem('emailForSignIn', email);
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setLoginError("Sorry, the login link could not be sent to this email.");
                });
                
            }
                setSubmitted(true);
            
                
            
        } catch (error) {
            console.log(error);
            if (error.message==="The email address is badly formatted."){
                setLoginError("The email address you've entered is invalid.");
            } else{
                setLoginError("Invalid email/password combination.")
            }
        
        
        }
        setLoading(false)
    }
        
            
        

    

    return (
        <div className = "content">
        <div className = 'header-wrapper'>
            <div className = "header">
                <Link  to='/' className = 'logo-wrap' >
                    Payscale <GiReceiveMoney/>
                </Link>
            </div>
        </div>
            <form autocomplete="off" onSubmit={(e)=>{handleSubmit(e)}} className = 'form'>
            <div className='label' style={{fontWeight: 'bold', fontSize: '1.5rem', width: '100%', textAlign: 'center', marginBottom: '30px'}}>Sign in</div>
           
           <div style={{width: '100%', textAlign: 'center', fontSize: '0.9rem'}}>
                Please sign in to view detailed salary information. This helps change the overall culture around salary transparency and helps individuals make more informed career decisions.
            </div> <br/><br/>


            {submitClicked && email === '' ? 
            <div className="autocomplete" >
                <label for='company' className='label'>Email</label><br/>
                <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value = {email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter email address"/>
                <br/>
            </div> 
            : <div className="autocomplete" >
                <label for='company' className='label'>Email</label><br/>
                <input id="company" className = 'input' type="text" name="myCompany" value = {email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter email address"/>
                <br/>
            </div> }
            
            <br/>
            {/* {submitClicked && password === '' ? 
            <div className="autocomplete" >
                <label for='company' className='label'>Enter Password</label><br/>
                <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="password" name="myCompany" value = {password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Enter password"/>
                <br/>
            </div> 
            :<div className="autocomplete" >
                <label for='company' className='label'>Enter Password</label><br/>
                <input id="company" className = 'input' type="password" name="myCompany" value = {password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Enter password"/>
                <br/>
            </div> } */}
            
            
            <br/>
            <input disabled = {loading} value = {loading ? 'Loading...' : !submitted ? 'Sign In' : 'Email Sent'} type="submit" />
            <div style={{width: '100%', marginTop: '20px', textAlign: 'center', color: 'rgba(255, 0, 0, 0.514)'}}>{signupError}</div>
            <div className = 'error'>{loginError}</div>
            </form> 


            <div className = 'bottom-spacer'></div>
        </div> 
    );
}

export default Signin;