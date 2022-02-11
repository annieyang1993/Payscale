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


function Signup() {
    const authContext = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);
    const [signupError, setSignupError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(async () => {
    }, [])


    const handleSubmit = async (e) =>{
        e.preventDefault();
        setSubmitClicked(true);
        setLoading(true);
        if (password === '' || passwordAgain === '' || firstName === '' || lastName === '' || email === ''){
            setSignupError('Please fill out all form fields.');
            setLoading(false)
        }
        else if (password!==passwordAgain){
        setSignupError('Please ensure that password match.')
        setLoading(false)
            } else{
        setSignupError('');
        await auth.createUserWithEmailAndPassword(email, password)
          .then(function(cred){
            Firebase.firestore().collection('users').doc(`${cred.user.uid}`).set({
              email: email,
              firstname: firstName,
              lastname: lastName,
              contribution: false,
              salary: false,
              exit_op: false,
              timeline: false
            }, {merge: true}).then(()=>{
          })
          setSubmitted(true);
          
          })
          .catch((error)=>{
            if (error.message === 'The email address is badly formatted.'){
              setSignupError('Please enter a valid email address.');
            } else{
              setSignupError(error.message);
            }

            
        });
        setLoading(false)
    }
        
            
        

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
        {submitted === false ? 
            <form autocomplete="off" onSubmit={(e)=>{handleSubmit(e)}} className = 'form'>
            <div className='label' style={{fontWeight: 'bold', fontSize: '1.5rem', width: '100%', textAlign: 'center', marginBottom: '30px'}}>Sign up</div>
            <div style={{width: '100%', textAlign: 'center', fontSize: '0.9rem'}}>
                This changes the overall culture around salary transparency and helps individuals make more informed career decisions.
            </div> <br/><br/>
            
                       {submitClicked && firstName === '' ? 
            <div className="autocomplete-half" style={{marginRight: '2%'}}>
                <label for='company' className='label'>First Name</label><br/>
                <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value = {firstName} onChange={(e)=>{setFirstName(e.target.value)}} placeholder="First name"/>
                <br/>
            </div> 
            : <div className="autocomplete-half" style={{marginRight: '2%'}}>
                <label for='company' className='label'>First Name</label><br/>
                <input id="company" className = 'input' type="text" name="myCompany" value = {firstName} onChange={(e)=>{setFirstName(e.target.value)}} placeholder="First name"/>
                <br/>
            </div> }

            {submitClicked && lastName === '' ? 
            <div className="autocomplete-half" >
                <label for='company' className='label'>Last Name</label><br/>
                <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value = {lastName} onChange={(e)=>{setLastName(e.target.value)}} placeholder="Last name"/>
                <br/>
            </div> 
            : <div className="autocomplete-half" >
                <label for='company' className='label'>Last Name</label><br/>
                <input id="company" className = 'input' type="text" name="myCompany" value = {lastName} onChange={(e)=>{setLastName(e.target.value)}} placeholder="Last name"/>
                <br/>
            </div> }

            <br/>


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

            {submitClicked && passwordAgain === '' ? 

            <div className="autocomplete" >
                <label for='company' className='label'>Re-enter Password</label><br/>
                <input id="company" visible={false} style={{border: '0.5px solid red'}} className = 'input' type="password" name="myCompany" value = {passwordAgain} onChange={(e)=>{setPasswordAgain(e.target.value)}} placeholder="Enter password again"/>
                <br/>
            </div> :
            <div className="autocomplete" >
                <label for='company' className='label'>Re-enter Password</label><br/>
                <input id="company" className = 'input' type="password" name="myCompany" value = {passwordAgain} onChange={(e)=>{setPasswordAgain(e.target.value)}} placeholder="Enter password again"/>
                <br/>
            </div>}<br/>

            <input value = {loading ? 'Loading...' : 'Submit'} type="submit"/>
            <div style={{width: '100%', marginTop: '20px', textAlign: 'center', color: 'rgba(255, 0, 0, 0.514)'}}>{signupError}</div>
            <div style={{width: '100%', textAlign: 'center', fontSize: '0.8rem'}}>
                If you've already filled out a salary form, please contact payscalefinance.info@gmail.com!
            </div>
            
            </form> : 
            <SalaryForm/>}


            <div className = 'bottom-spacer'></div>
        </div> 
    );
}

export default Signup;