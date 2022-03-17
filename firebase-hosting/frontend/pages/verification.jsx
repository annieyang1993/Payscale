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
    const [email, setEmail] = useState(window.localStorage.getItem('emailForSignIn'));
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
        // if (auth.isSignInWithEmailLink(window.location.href)) {
        //             let email = window.localStorage.getItem('emailForSignIn');
        //             if (!email) {
        //                 // User opened the link on a different device. To prevent session fixation
        //                 // attacks, ask the user to provide the associated email again. For example:
        //                 email = window.prompt('Please provide your email for confirmation');
        //             }
        //             auth.signInWithEmailLink(email, window.location.href)
        //                 .then((result) => {
        //                 window.localStorage.removeItem('emailForSignIn');
        //                 // Clear email from storage.
        //                 // You can access the new user via result.user
        //                 // Additional user info profile not available via:
        //                 // result.additionalUserInfo.profile == null
        //                 // You can check if the user is new or existing:
        //                 // result.additionalUserInfo.isNewUser
        //                 })
        //                 .catch((error) => {
        //                 // Some error occurred, you can inspect the code: error.code
        //                 // Common errors could be invalid email and invalid or expired OTPs.
        //                 });
        //             }
        
    }, [])


    const handleSubmit = async (e) =>{
        e.preventDefault();
        setSubmitClicked(true);
        setLoading(true);
        try {
            if (email !== '') {
                if (auth.isSignInWithEmailLink(window.location.href)) {
                    // Additional state parameters can also be passed via URL.
                    // This can be used to continue the user's intended action before triggering
                    // the sign-in operation.
                    // Get the email if available. This should be available if the user completes
                    // the flow on the same device where they started it.
                    
                    // The client SDK will parse the code from the link for you.
                    auth.signInWithEmailLink(email, window.location.href)
                        .then((result) => {
                            window.localStorage.removeItem('emailForSignIn');
                            
                        // Clear email from storage.
                        // You can access the new user via result.user
                        // Additional user info profile not available via:
                        // result.additionalUserInfo.profile == null
                        // You can check if the user is new or existing:
                        // result.additionalUserInfo.isNewUser
                        })
                        .catch((error) => {
                        // Some error occurred, you can inspect the code: error.code
                        // Common errors could be invalid email and invalid or expired OTPs.
                        });
                    }
                
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
        {!authContext.userInfo === true ?
            <form autocomplete="off" onSubmit={(e)=>{handleSubmit(e)}} className = 'form'>
            <div className='label' style={{fontWeight: 'bold', fontSize: '1.5rem', width: '100%', textAlign: 'center', marginBottom: '30px'}}>Thanks For Signing In!</div>

            {email === null ? 
            <div>
           
           <div style={{width: '100%', textAlign: 'center', fontSize: '0.9rem'}}>
                Please re-enter your email to confirm sign-in.
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
            
            
            <br/>
            <input value = {loading ? 'Loading...' : 'Verify'} type="submit"/>
            <div style={{width: '100%', marginTop: '20px', textAlign: 'center', color: 'rgba(255, 0, 0, 0.514)'}}>{signupError}</div>
            <div className = 'error'>{loginError}</div>
            </div>

            :

            <input disabled = {loading} value = {loading ? 'Loading...' : 'Continue'} type="submit"/>}

            </form> : authContext.userData.contribution ? 
            <form className = 'form'>
            <div className = 'general-info'>
                <div className='thank-you'>Welcome back, {authContext.userData.firstname}!</div>
                <div className = 'thank-you-inner'>
                    
                    <br/> 
                        {feedbackSent ? <div>Thank you! We highly appreciate your feedback and will evaluate it closely when deploying the next version of this website. </div> : <div>
                        
                        <div>We will continue to add more data and analysis to help you gain more career insights! Please feel free to let us know any comments/feedback/improvements you may have in the meantime! </div>                              
                        <br/><br/>
                        <textarea className = 'feedback' onChange={(e)=>{e.preventDefault(); setFeedback(e.target.value)}}/>
                        
                        <div className = 'feedback-button' onClick={()=>sendFeedback()}> {feedbackloading ?  'Loading...': 'Send Feedback' }</div>
                        </div>}
                    <br/>
                    
                    <Link to='/' className = 'back-2'>See compensation and salary insights ></Link>
                </div>
            </div> </form>: 
            <SalaryForm/>

        
        
        
        }

        


            <div className = 'bottom-spacer'></div>
        </div> 
    );
}

export default Signin;