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



    useEffect(async () => {
    }, []) 

    

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
        Support Payscale <br/> <br/>

        The goal of this website is to increase information transparency in finance by collecting as much data as possible around compensation, break in/exit ops, and promotion timelines. <br/>

         <br/>

        Consider helping Payscale increase compensation transparency for finance professionals in one of the following ways: <br/> <br/>

        1. Filling out compensation information and sending the site along to other finance professionals. <br/> <br/>

        2. Sending in comments and suggestions on ways to improve the site. <br/> <br/>

        3. Consider making a small donation to support Payscale <br/>
        The donation goes directly towards server and hosting costs, which currently total ~$100/month for this project. Your donation would help keep the site up and running smoothly as well as help grow the site to provide more granular data for finance professionals! 

        <br/>
        <br/>
        Thank you for your support!



        </div>

        
        </div> 
    );
}

export default EntryForm;