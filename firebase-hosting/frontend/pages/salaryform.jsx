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

import {BiSupport} from 'react-icons/bi'
//import {Firebase, db} from '../config/firebase';
require('react-dom');


function SalaryPost() {
    const authContext = useContext(AuthContext);
    const [companyName, setCompanyName] = useState(null);
    const [careerType, setCareerType] = useState(null);
    const [careerTypeOther, setCareerTypeOther] = useState(null);
    const [title, setTitle] = useState(null);
    const [titleOther, setTitleOther] = useState(null);
    const [group, setGroup] = useState(null);
    const [experience, setExperience] = useState(null);
    const [experienceAtCompany, setExperienceAtCompany] = useState(null);
    const [location, setLocation] = useState(null);
    
    const[generalError, setGeneralError] = useState('')

    const [annualComp, setAnnualComp] = useState(null);
    const [baseSalary, setBaseSalary] = useState(null);
    const [bonus, setBonus] = useState(null);
    const [signing, setSigning] = useState(null);
    const [compensationError, setCompensationError] = useState('');
    const [year, setYear] = useState(null);

    const [gender, setGender] = useState(null);
    const [race, setRace] = useState(null);
    const [academic, setAcademic] = useState(null);
    const [otherInfo, setOtherInfo] = useState(null);

    const [submitClicked, setSubmitClicked] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        autocomplete(document.getElementById("company"), authContext.companies, setCompanyName)
        autocomplete(document.getElementById("location"), locations, setLocation)
        document.getElementsByClassName('header')[0].scrollIntoView(false, { behavior: 'smooth', block: 'start' });

        document.addEventListener("wheel", function(event){
            if(document.activeElement.type === "number"){
                document.activeElement.blur();
            }
        });
        //autocomplete(document.getElementById("role"), roles)
        // companies.map(async (company, i)=>{
        //     var hash = {}
        //     hash[company] = false
        //     await Firebase.firestore().collection('companies').doc('companies').set(hash, {merge: true})
        // })
    }, [])

    function autocomplete(inp, arr, func) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                func(inp.value)
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) {func(x[0].innerText); console.log(x[0].innerText); x[currentFocus].click()};
            }
        }
    });

    inp.addEventListener("click", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        x = x.getElementsByTagName("div");
            func(x[0].innerText); console.log(x[0].innerText);
            
        
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
        }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setSubmitClicked(true);
        var submit = true;
        if (companyName === null || companyName === '' || careerType === null || careerType === ''
        || title === null || title === '' || group === null || group === '' || experience === null || experience === ''
        || experienceAtCompany === null || experienceAtCompany === '' || location === null || location === '' 
        ){
            setGeneralError('* Please fill-out all highlighted fields.')
            submit = false;
        } else if (careerType === 'Other' && (careerTypeOther === null || careerTypeOther === '')){
            setGeneralError('* Please fill-out all highlighted fields.')
            submit = false;
        } else if (title === 'Other' && (titleOther === null || titleOther === '')){
            setGeneralError('* Please fill-out all highlighted fields.')
            submit = false;
        } else if (location.split(',').length!==2){
            setGeneralError('* Please ensure location is in City, Country/Province/State format.')
            submit = false;
        } else{
            setGeneralError('')
        }

        if (annualComp === null || annualComp === '' || baseSalary === null || baseSalary === '' || bonus === null || bonus === '' || signing === null || signing === ''){
            submit = false;
            setCompensationError('* Please fill-out all highlighted fields.')
        } else if (annualComp < 10000){
            setCompensationError('* Please ensure numbers represent annualized compensation.')
            submit = false;
        } else if (!(Number(annualComp) === (Number(baseSalary) + Number(bonus)))){
            setCompensationError('* Please ensure annual compensation is equal to the sum of base salary, and annualized bonus.')
            submit = false;
        } else{
            setCompensationError('')
        }

        if (submit === true){
            setLoading(true)
            await Firebase.firestore().collection('salaries').doc().set({
                company_name: companyName,
                career_type: careerType,
                career_type_other: careerTypeOther,
                title: title,
                title_other: titleOther,
                group: group,
                experience_total: experience,
                experience_company: experienceAtCompany,
                location: location,
                annual_compensation: annualComp,
                salary: baseSalary,
                bonus: bonus,
                signing_bonus: signing,
                annualized: false,
                gender: gender,
                race: race,
                academic_information: academic,
                year: year,
                other_details: otherInfo,
                created_on: new Date()
            })
            if (authContext.companies.includes(companyName)){
                await Firebase.firestore().collection('comps').doc('comps').collection(companyName).doc().set({
                    company_name: companyName,
                    career_type: careerType,
                    career_type_other: careerTypeOther,
                    title: title,
                    title_other: titleOther,
                    group: group,
                    experience_total: experience,
                    experience_company: experienceAtCompany,
                    location: location,
                    annual_compensation: annualComp,
                    salary: baseSalary,
                    bonus: bonus,
                    signing_bonus: signing,
                    annualized: false,
                    gender: gender,
                    race: race,
                    academic_information: academic,
                    other_details: otherInfo,
                    year: year,
                    created_on: new Date()
                })
                setSubmitted(true);
            } else{
                await Firebase.firestore().collection('comps').doc('comps').collection('Other').doc().set({
                    company_name: companyName,
                    career_type: careerType,
                    career_type_other: careerTypeOther,
                    title: title,
                    title_other: titleOther,
                    group: group,
                    experience_total: experience,
                    experience_company: experienceAtCompany,
                    location: location,
                    annual_compensation: annualComp,
                    salary: baseSalary,
                    bonus: bonus,
                    signing_bonus: signing,
                    annualized: false,
                    gender: gender,
                    race: race,
                    academic_information: academic,
                    year: year,
                    other_details: otherInfo,
                    created_on: new Date()
                })
                setSubmitted(true);
            }
            setLoading(false);
            setSubmitClicked(true);
            
        }

    }

    /*An array containing all the country names in the world:*/

    var roles=['Investment Banking', 'Private Equity', 'Sales and Trading - Sales', 'Sales and Trading - Trading', 'Proprietary trading', 'Quant trading', 'Quantitative Research', 'Corporate Banking', 'Equity Research', 'Accounting', 'Investment Analyst', 'Management Consulting', 'Hedge Fund', 'Venture Capital', 'Private Banking', 'Asset Management', 'Operations', 'FP&A', 'Other']
    var titles=['Analyst', 'Senior Analyst', 'Associate', 'Director', 'Vice President', 'Managing Director', 'Partner', 'Portfolio Manager', 'Senior Vice President', 'Associate Vice President', 'Associate Director', 'Executive Director', 'Intern', 'Other']
    var locations=['Toronto, Ontario', 'Montreal, Quebec', 'Vancouver, British Columbia', 'Calgary, Alberta', 'New York, New York', 'Ottawa, Ontario', 'Edmonton, Alberta', 'Missisauga, Ontario', 'Winnipeg, Manitoba', 
    'Brampton, Ontario', 'Hamilton, Ontario', 'San Francisco, California', 'Los Angeles, California', 'Chicago, Illinois', 'San Mateo, California', 'Houston, Texas', 'Phoenix, Arizona', 'Philadelphia, Pennsylvania', 'San Antonio, Texas', 'San Diego, California', 'San Jose, California', 'Dallas, Texas',
    'Austin, Texas', 'San Jose, California', 'Forth Worth, Texas', 'Jacksonville, Florida', 'Charlotte, North Carolina', 'Seattle, Washington', 'Denver, Colorado', 'Washington, DC', 'Boston, Massachussetts', 'Detroit, Michigan', 'Portland, Oregon',  'Remote', 'MCOL', 'HCOL', 'LCOL', 'Other', 'Beijing, China', 'Shanghai, China', 'India', 'Indonesia', 'Pakistan',
    'Brazil', 'Nigeria', 'Bangladesh', 'Russia', 'Mexico', 'Japan', 'Ethiopia', 'Philippines', 'Egypt', 'Vietnam', 'DR Congo', 'Germany', 'Turkey', 'Iran', 'Thailand', 'United Kingdom', 'France', 'Italy', 'South Africa', 'Tanzania', 'Myanmar', 'Kenya', 'South Korea', 'Colombia', 'Spain', 'Argentina', 'Uganda', 'Ukraine', 'Algeria', 'Sudan', 'Iraq', 'Afghanistan',
    'Poland', 'Morocco', 'Saudi Arabia', 'Uzbekistan', 'Peru', 'Malaysia', 'Angola', 'Mozambique', 'Yemen', 'Ghana', 'Nepal', 'Venezuela', 'Madagascar', 'North Korea', 'Ivory Coast', 'Cameroon', 'Australia', 'Taiwan', 'Netherlands', 'Belgium', 'Sweden', 'United Arab Emirates', 'Austria', 'Switzerland', 'Hong Kong', 'Singapore', 'Denmark', 'Finland', 'Ireland', 'New Zealand']

    var genders=['Male', 'Female', 'Non-binary']
    var races=['Hispanic/Latino', 'American Indian or Alaska Native', 'Asian', 'Black or African American', 'Native Hawaiian or Other Pacific Islander', 'White', 'Other']
    var academics = ['High school or equivalent', 'Technical or occupational certificate', 'Associate Degree', "Bachelor's degree", "Master's degree", 'Doctorate (PhD)']
    var years = ['2017', '2018', '2019', '2020', '2021', 'Present']

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

            <div className='subtitle'>General</div>
            <div className = 'general-info'>
            <div class="autocomplete" >
                <label for='company' className='label'>Company</label><br/>
                {submitClicked===true && (companyName === null || companyName==='')  ? 
                <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value = {companyName} onChange={(e)=>{setCompanyName(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setCompanyName(e.target.value)}} placeholder="Company"/>
                : <input id="company" className = 'input' type="text" name="myCompany" value = {companyName} onChange={(e)=>{setCompanyName(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setCompanyName(e.target.value)}} placeholder="Company"/>
                } <br/>
            </div> <br/>

            <div class="autocomplete" >
                <label for='role' className='label'>Career Type</label><br/>

                {submitClicked===true && (careerType === null || careerType==='')  ? 
                <select id="role" style={{border: '0.5px solid red'}} onChange={(e)=>{e.preventDefault(); setCareerType(e.target.value)}} className = 'input' name="myRole">
                    <option value='disabled' disabled selected className = 'option-select' >Please select a career/role</option>

                    {roles.map((role, i)=>{
                        return(
                            <option value={role} className = 'option' key={i}>{role}</option>
                        )
                    })}
                </select> : 
                <select id="role" className = 'input' name="myRole" onChange={(e)=>{e.preventDefault(); setCareerType(e.target.value)}}>
                    <option value='disabled' disabled selected className = 'option-select'>Please select a career/role</option>

                    {roles.map((role, i)=>{
                        return(
                            <option value={role} className = 'option' key={i}>{role}</option>
                        )
                    })}
                </select>}<br/>

            </div><br/>

                {careerType === 'Other' ? submitClicked === true && (careerTypeOther === null || careerTypeOther === '') ? 
                            <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Career Type</label><br/>
                            <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value = {careerTypeOther} onChange={(e)=>{setCareerTypeOther(e.target.value)}} placeholder="Please Specify Career Type"/> <br/>
                            </div> : <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Career Type</label><br/>
                            <input id="company" className = 'input' type="text" name="myCompany" value = {careerTypeOther} onChange={(e)=>{setCareerTypeOther(e.target.value)}} placeholder="Please Specify Career Type"/> <br/>
                            </div> : null }

            <div class="autocomplete" >
                <label for='role' className='label'>Title</label><br/>
                {submitClicked===true && (title === null || title==='')  ? 
                <select id="role" style={{border: '0.5px solid red'}} className = 'input' onChange={(e)=>{setTitle(e.target.value)}} name="myRole">
                    <option value='disabled' disabled selected className = 'option-select'>Please select a title</option>
                    {titles.map((title, i)=>{
                        return(
                            <option value={title} key={i}>{title}</option>
                        )
                    })}
                </select> : 
                <select id="role" className = 'input' onChange={(e)=>{setTitle(e.target.value)}} name="myRole">
                    <option value='disabled' disabled selected className = 'option-select'>Please select a title</option>
                    {titles.map((title, i)=>{
                        return(
                            <option value={title} key={i}>{title}</option>
                        )
                    })}
                </select>}<br/>
            </div><br/>

                {title === 'Other' ? submitClicked === true && (titleOther === null || titleOther === '') ? 
                            <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Title</label><br/>
                            <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value = {titleOther} onChange={(e)=>{setTitleOther(e.target.value)}} placeholder="Please Specify Title"/> <br/>
                            </div> : <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Title</label><br/>
                            <input id="company" className = 'input' type="text" name="myCompany" value = {titleOther} onChange={(e)=>{setTitleOther(e.target.value)}} placeholder="Please Specify Title"/> <br/>
                            </div> : null }


            <div class="autocomplete" >
                <label for='title'>Group</label><br/>
                {submitClicked===true && (group === null || group==='')  ? 
                <input id="title" className = 'input' style={{border: '0.5px solid red'}} type="text" onChange={(e)=>{setGroup(e.target.value)}} name="myTitle" placeholder="E.g. M&amp;A, Generalist, TMT, Derivatives"/>
                : <input id="title" className = 'input' type="text" onChange={(e)=>{setGroup(e.target.value)}} name="myTitle" placeholder="E.g. M&amp;A, Generalist, TMT, Derivatives"/>}<br/>
            </div>

            <div class="autocomplete" >

                <label for='title'>Experience</label><br/>
                {submitClicked===true && (experience === null || experience==='')  ? 
                <input id="title" className = 'half-input1' style={{border: '0.5px solid red'}} type="number" onChange={(e)=>{setExperience(e.target.value)}} name="myTitle" placeholder="Years of Relevant Experience"/> :
                <input id="title" className = 'half-input1' type="number" onChange={(e)=>{setExperience(e.target.value)}} name="myTitle" placeholder="Years of Relevant Experience"/>}
                {submitClicked===true && (experienceAtCompany === null || experienceAtCompany ==='')  ? 
                <input id="title" className = 'half-input2' style={{border: '0.5px solid red'}} type="number" onChange={(e)=>{setExperienceAtCompany(e.target.value)}} name="myTitle" placeholder="Years at Company"/> : 
                <input id="title" className = 'half-input2' type="number" onChange={(e)=>{setExperienceAtCompany(e.target.value)}} name="myTitle" placeholder="Years at Company"/>}
                <br/>
            </div>

            <div class="autocomplete" >
                <label for='location'>Location</label><br/>
                {submitClicked===true && (location === null || location ==='')  ? 
                <input id="location" className = 'input' style={{border: '0.5px solid red'}} type="text" value = {location} onChange={(e)=>{setLocation(e.target.value)}} name="myTitle" placeholder="Location (in City, Country format)"/> : 
                <input id="location" className = 'input' type="text" value = {location} onChange={(e)=>{setLocation(e.target.value)}} name="myTitle" placeholder="Location (City, State/Province)"/>}<br/>
            </div>

             {/* <div class="autocomplete" >
                <label for='year' className='label'>Valid Year</label><br/>
                {submitClicked===true && (year === null || year==='')  ? 
                <select id="year" style={{border: '0.5px solid red'}} className = 'input' onChange={(e)=>{setYear(e.target.value)}} name="myYear">
                    <option value='disabled' disabled selected className = 'option-select'>Please select valid year</option>
                    {years.map((year, i)=>{
                        return(
                            <option value={year} key={i}>{year}</option>
                        )
                    })}
                </select> : 
                <select id="year" className = 'input' onChange={(e)=>{setYear(e.target.value)}} name="myYear">
                    <option value='disabled' disabled selected className = 'option-select'>Please select valid year</option>
                    {years.map((year, i)=>{
                        return(
                            <option value={year} key={i}>{year}</option>
                        )
                    })}
                </select>}
            </div> */}

            <div className = 'error'>{generalError}</div>

            </div>

            <div className='subtitle'>Compensation</div>
            <div className='subtitle-1'>Please ensure numbers are in USD</div>
            <div className = 'general-info'>

            <div class="autocomplete" >
                {submitClicked===true && (annualComp === null || annualComp ==='')  ? 
                <input id="title" type="number" className = 'input' style={{border: '0.5px solid red'}} onChange={(e)=>{setAnnualComp(e.target.value)}} name="myTitle" placeholder="Total Annual Compensation"/> : 
                <input id="title" type="number" className = 'input' onChange={(e)=>{setAnnualComp(e.target.value)}} name="myTitle" placeholder="Total Annual Compensation"/>}<br/>
                <label for='location' className='label'></label><br/>
                
                {submitClicked===true && (baseSalary === null || baseSalary ==='')  ? 
                <input id="title" type="number" className = 'half-input1' style={{border: '0.5px solid red'}} onChange={(e)=>{setBaseSalary(e.target.value)}} name="myTitle" placeholder="Base Salary"/> : 
                <input id="title" type="number" className = 'half-input1' onChange={(e)=>{setBaseSalary(e.target.value)}} name="myTitle" placeholder="Base Salary"/>}

                {/* <label for='title'>Annual Bonus</label><br/> */}
                {submitClicked===true && (bonus === null || bonus ==='')  ? 
                <input id="title" type="number" className = 'half-input2' style={{border: '0.5px solid red'}} onChange={(e)=>{setBonus(e.target.value)}} name="myTitle" placeholder="Annualized Bonus"/> : 
                <input id="title" type="number" className = 'half-input2' onChange={(e)=>{setBonus(e.target.value)}} name="myTitle" placeholder="Annualized Bonus"/>}<br/>
            </div>
                {submitClicked===true && (signing === null || signing ==='')  ? 
                <input id="title" type="number" className = 'input' style={{border: '0.5px solid red'}} name="myTitle" onChange={(e)=>{setSigning(e.target.value)}} placeholder="Signing Bonus"/> : 
                <input id="title" type="number" className = 'input' name="myTitle" onChange={(e)=>{setSigning(e.target.value)}} placeholder="Signing Bonus"/>}<br/>
            
            
            <div className = 'error'>{compensationError}</div>
            </div>
            <div className='subtitle'>Optional Other Info</div>

            <div className = 'general-info'>
            <div class="autocomplete" >
                <label for='title'>Gender</label><br/>
                <select id="gender" className = 'input' onChange={(e)=>{if (e.target.value === 'Please select your gender') {setGender(null)} else{setGender(e.target.value)}}} name="myGender">
                    <option value={null} selected className = 'option-select'>Please select your gender</option>
                    {genders.map((gender, i)=>{
                        return(
                            <option value={gender}  key={i}>{gender}</option>
                        )
                    })}
                </select><br/>

            </div>
            <div class="autocomplete" >
                <label for='title'>Race</label><br/>
                <select id="race" onChange={(e)=>{if (e.target.value === 'Please select your race') {setRace(null)} else{setRace(e.target.value)}}} className = 'input' name="myRace">
                    <option value={null} selected className = 'option-select'>Please select your race</option>
                    {races.map((race, i)=>{
                        return(
                            <option value={race} key={i}>{race}</option>
                        )
                    })}
                </select><br/>

            </div>
            <div class="autocomplete" >
                <label for='title'>Academic Information</label><br/>
                <select id="academic" onChange={(e)=>{if (e.target.value === 'Please select your highest academic level achieved') {setAcademic(null)} else{setAcademic(e.target.value)}}} className = 'input' name="myAcademic">
                    <option value={null} selected className = 'option-select'>Please select your highest academic level achieved</option>
                    {academics.map((academic, i)=>{
                        return(
                            <option value={academic}  key={i}>{academic}</option>
                        )
                    })}
                </select><br/>
            </div>
            <div class="autocomplete" >
                <label for='title'>Other Details</label><br/>
                <input id="title" type="text"  className = 'input' onChange={(e)=>{setOtherInfo(e.target.value)}} name="myTitle" placeholder="Please enter any other information you'd like to include."/><br/>
            </div>
            </div>
            {loading ?  <div className = 'loading'>Loading...</div> :
            <input type="submit"/>}
            </form> : 
            <form autocomplete="off" onSubmit={(e)=>{handleSubmit(e)}} className = 'form'>
                <br/><br/>
            <div className = 'general-info'>
                <div className='thank-you'>Thank You!</div>
                <div className = 'thank-you-inner'>

                    <div>Your submission helps increase the transparency around total compensation within finance. </div>
                    <br/><br/><br/>
                    
                    <Link to='/salaries' className = 'back'>Back to salaries ></Link>
                </div>
            </div>
            </form>}


            <div className = 'bottom-spacer'></div>
        </div> 
    );
}

export default SalaryPost;