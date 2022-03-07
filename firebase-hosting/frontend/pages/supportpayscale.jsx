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
import Header from '../components/header'


import {BiSupport} from 'react-icons/bi'
//import {Firebase, db} from '../config/firebase';
require('react-dom');
const stripePromise = loadStripe('pk_live_51KF8tcBYQrX4euNOzkjju7cHk43H5p0dfIUeXb0CZeWrGickBX1Tm24nEzDzANGaxopQpBs1IcieppTFNCG67Tf800Z7ThIlbu');


const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [stripeError, setStripeError] = useState(false);
    const [firebaseError, setFirebaseError] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const [donationAmount, setDonationAmount] = useState([false, false, false, false, false])
    const [donationIndex, setDonationIndex] = useState(null);
    const [customAmount, setCustomAmount] = useState(null);
    const amounts = [{value: 1, label: '$ 1'}, {value: 5, label: '$ 5'}, {value: 10, label: '$ 10'}, {value: 20, label: '$ 20'}, {value: true, label: 'Enter Amount'}]


        const handleSubmitPayment = async (event) => {
            // We don't want to let default form submission happen here,
            // which would refresh the page.
            event.preventDefault();
            setLoadingIndicator(true);
            setStripeError(false);
            setFirebaseError(false);
            var amount = 0;
            if (donationIndex === 4){
                amount = Number(customAmount);
            } else{
                amount = amounts[donationIndex].value;
            }

            await new Promise((resolve)=>setTimeout(resolve, 200))

            if (!stripe || !elements) {
              // Stripe.js has not yet loaded.
              // Make sure to disable form submission until Stripe.js has loaded.
              return;
            }

            const cardElement = await elements.getElement("card");

            const billingDetails={
                name: 'Annie Yang',
                email: 'annieqiyang@gmail.com'
            }


            const paymentMethodReq = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: billingDetails
            })

            if (paymentMethodReq.error){
                setStripeError(true);
                setLoadingIndicator(false);
            } else{
                    const data = await fetch('https://us-central1-web3careers-88177.cloudfunctions.net/createPaymentIntent', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        payment_id: paymentMethodReq.paymentMethod.id,
                        email: 'annieqiyang@gmail.com',
                        amount: amount
                    })
                })

                const responseJson = await data.json();

                
                const {error} = await stripe.confirmCardPayment(responseJson.client_secret, {
                    payment_method: paymentMethodReq.paymentMethod.id
                })
                
                    setLoadingIndicator(false);
                    setSuccessful(true);
            
            }

           if (firebaseError === true || stripeError === true){
               setLoadingIndicator(false);
           }
        }

        

        return (
            <div>
            <div class="autocomplete-radio">
                <br/>
                {amounts.map((amount, i)=>{
                    return (
                        <div className = 'radio-sections' style={{display: 'flex', flexWrap: 'wrap'}}>
                            <input id='switch' name="apply-by2" type='radio' checked={donationAmount[i]} onClick={()=>{var boolTemp = [false, false, false, false, false]; boolTemp[i] = true; setDonationIndex(i); setDonationAmount(boolTemp)}}/>

                            {i ===4 ? 
                            <div className = 'custom' style={{display: 'flex', flexWrap: 'wrap'}}>$ <input type='number' placeholder = 'Enter amount' style={{float: 'left', height: '30px', marginTop: '-5px', borderBottom: '1px solid gray', background: 'transparent', marginLeft: '2px'}} onChange={(e)=>{var boolTemp = [false, false, false, false, false]; boolTemp[i] = true; setDonationAmount(boolTemp); setCustomAmount(e.target.value)}}/> </div>:
                            <label for='switch' style={{fontSize:'1rem', color: 'gray'}} checked={donationAmount[i]} name="apply-by2" >{amount.label}</label>}
                        </div>
                    )

                })}

            </div>
            

            <form >
                <div className='label-and-entry'>
                    <div className = 'card'>
                        <CardElement options={{style:{base:{color: 'black', marginTop: '10px', width: '95%'}}}}/>
                    </div>
                </div>

                <div className = 'feedback-button' onClick={(e)=>handleSubmitPayment(e)}> {loadingIndicator ?  'Loading...': successful ? 'Thank you!' : 'Confirm Payment' }</div>

                {stripeError ? <div className = 'error'>Your credit card information could not be processed. Please try again.</div> : null}
                {successful ? <div className = 'success'>Thank you for your support! This will go directly towards server/hosting costs and growing Payscale's compensation database. </div> : null}

           
                
                <br/>
            </form>
            </div> 
            
        )
};


function EntryForm() {
    const authContext = useContext(AuthContext);
    
    const [company, setCompany] = useState(null);
    const [division, setDivision] = useState(null);
    const [divisionOther, setDivisionOther] = useState(null);
    const [location, setLocation] = useState(null);

    const [submitted, setSubmitted] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [addClicked, setAddClicked] = useState(false);

    const [levels, setLevels] = useState([]);
    const [levelsOther, setLevelsOther] = useState([]);
    const [minYears, setMinYears] = useState([]);
    const [maxYears, setMaxYears] = useState([]);

    const [level, setLevel] = useState(null);
    const [levelOther, setLevelOther] = useState(null);
    const [minYear, setMinYear] = useState(null);
    const [maxYear, setMaxYear] = useState(null);

    const [addError, setAddError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const [feedback, setFeedback] = useState('');
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [feedbackloading, setFeedbackLoading] = useState(false);

    useEffect(async () => {
    }, []) 

    const sendFeedback = async () => {
        setFeedbackLoading(true);
        await Firebase.firestore().collection('feedback').doc().set({
            feedback: feedback
        })
        setFeedbackLoading(false);
        setFeedbackSent(true);
        setFeedback('');
    }


    

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setSubmitClicked(true);
        var submit = true;

        if (company===null || company==='' || division === null || division === '' ||location === null || location===''){
            submit = false;
            setGeneralError('* Please fill-out all highlighted fields.')
        } else if (division === 'Other'){
            if (divisionOther === null || divisionOther === ''){
                submit = false;
                setGeneralError('* Please fill-out all highlighted fields.')
            }
        } else if (levels.length<1){
            submit = false;
            setGeneralError('* Please fill out leveling information.')
        } else{
            setGeneralError('')
        }




        if (submit === true){
            setLoading(true)
            await Firebase.firestore().collection('leveling').doc('leveling').collection(company.toLowerCase()).doc().set(
                {company_name: company,
                division: division,
                division_other: divisionOther, 
                location: location,
                levels: levels,
                levels_other: levelsOther,
                min_years: minYears,
                max_years: maxYears}
            )
            setSubmitted(true);
            setLoading(false);
            setSubmitClicked(true);
            
        }
        setLoading(false);

    }

    /*An array containing all the country names in the world:*/


    return (
        <div className = "content">
        <div className = 'header-wrapper'>
            <Header/>
        </div>
        <div className = 'under-header'>
        <div className = 'support-title'>Support Payscale</div>

        <div className = 'support-subtitle'> The goal is to provide you with increasingly comprehensive data that's accurate, useful, and easy to access. If you think increased compensation and information transparency is beneficial to you, consider supporting Payscale in one of the following ways: </div> <br/>

        <div className = 'support-point-wrapper' style={{borderTopLeftRadius: '10px', borderTopRightRadius: '10px', background: 'rgb(231, 231, 243)', padding: '10px', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '20px'}}>
                <div className = 'support-point' >1. Making a small contribution </div>
        <div className = 'support-point-explanation'>Your contribution helps run the site smoothly, and helps provide you and others with more granular data and useful insights. Server and hosting costs ~$100/month before scaling, and your contribution would go towards maintaining server costs and growing the database

        <br/> <br/>
       
        <Elements stripe={stripePromise}>
            <CheckoutForm/>
        </Elements>
        </div>

        </div>

        <div style={{borderLeft: '1px solid rgb(231, 231, 243)', borderRight: '1px solid rgb(231, 231, 243)', padding: '10px', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '20px'}}>

        <div className = 'support-point' >2. Sending in comments and suggestions on ways to improve the site.</div>
        <div className = 'support-point-explanation'>Any improvement you have is valuable feedback for Payscale! </div> <br/>
        <textarea className = 'feedback' onChange={(e)=>{e.preventDefault(); setFeedback(e.target.value)}}/>
        <div className = 'feedback-button' onClick={()=>sendFeedback()}> {feedbackloading ?  'Loading...': feedbackSent ? 'Thank you!' : 'Send Feedback' }</div>
        </div>

        <div style={{borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', background: 'rgb(231, 231, 243)', padding: '10px', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '20px'}}>
        
        <div className = 'support-point'>3. Filling out compensation information and sending the site along to other finance professionals. </div> 
        <div className = 'support-point-explanation'>Please fill out one of the below forms: <br/> <br/>
        <Link className = 'form-link' to='/salary-form'>+ Add Compensation</Link> <br/>
        <Link className = 'form-link' to='/ops-form'>+ Add Entry/Exit Op</Link> <br/>
        <Link className = 'form-link' to='/titlesform'>+ Add Team Structure/Promotion Timeline</Link>
        </div>
         
        </div>
         

        <br/>
        <br/>
        <div className = 'thank-you-support'>Thank you for your support!</div>



        
        </div>

        
        </div> 
    );
}

export default EntryForm;