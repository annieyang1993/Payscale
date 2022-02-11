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


    const handleSubmit = async (e) =>{
        e.preventDefault();
        setSubmitClicked(true);
        setLoading(true);
        try {
            if (email !== '' && password !== '') {
                await auth.signInWithEmailAndPassword(email, password);
                setSubmitted(true);
                console.log('HELLO');
            }
        } catch (error) {
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
                <Link  to='/salaries' className = 'logo-wrap' >
                    Payscale <GiReceiveMoney/>
                </Link>
            </div>
        </div>
        {!authContext.userInfo === true ?
            <form autocomplete="off" onSubmit={(e)=>{handleSubmit(e)}} className = 'form'>
            <div className='label' style={{fontWeight: 'bold', fontSize: '1.5rem', width: '100%', textAlign: 'center', marginBottom: '30px'}}>Sign in</div>
           


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
            {submitClicked && password === '' ? 
            <div className="autocomplete" >
                <label for='company' className='label'>Enter Password</label><br/>
                <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="password" name="myCompany" value = {password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Enter password"/>
                <br/>
            </div> 
            :<div className="autocomplete" >
                <label for='company' className='label'>Enter Password</label><br/>
                <input id="company" className = 'input' type="password" name="myCompany" value = {password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Enter password"/>
                <br/>
            </div> }
            
            
            <br/>
            <input value = {loading ? 'Loading...' : 'Submit'} type="submit"/>
            <div style={{width: '100%', marginTop: '20px', textAlign: 'center', color: 'rgba(255, 0, 0, 0.514)'}}>{signupError}</div>
            <div className = 'error'>{loginError}</div>
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
                    
                    <Link to='/salaries' className = 'back-2'>Go to salaries ></Link>
                </div>
            </div> </form>: 
            <form className = 'form'>
            <div className = 'general-info'>
                <div className='thank-you'>Welcome back, {authContext.userData.firstname}!</div>
                <div className = 'thank-you-inner'>
                    <div style={{color: 'rgb(151, 151, 151)'}}>Please consider filling out one of the forms below to gain access to all of the website's features. They're quick to complete, and your input will help others make better career decisions and increase salary transparency for the finance community. </div>
                    <div className = 'buttons-container-2'>
                        <br/>
                        <Link to='/salary-form' className = 'form-link-login'>+ Add Compensation</Link> <br/><br/>
                        <Link to='/titlesform' className = 'form-link-login'>+ Add Team Structure and Promotion Timeline</Link> <br/><br/>
                        <Link to='/ops-form' className = 'form-link-login'>+ Add Break In/Exit Op</Link> <br/><br/>
                    </div> 
                    <br/>
                    <Link to='/salaries' className = 'back-2'>Go to salaries ></Link>
                    
                </div>
                    </div> </form>

        
        
        
        }


            <div className = 'bottom-spacer'></div>
        </div> 
    );
}

export default Signin;