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

    // const [currentCareerType, setCurrentCareerType] = useState(null);
    // const [currentTitle, setCurrentTitle] = useState(null);
    // const [currentGroup, setCurrentGroup] = useState(null);
    // const [currentLocation, setCurrentLocation] = useState(null);
    // const [currentCareerTypeOther, setCurrentCareerTypeOther] = useState(null);
    // const [currentTitleOther, setCurrentTitleOther] = useState(null);

    // const [university, setUniversity] = useState(null);
    // const [educationType, setEducationType] = useState(null);

    // const [otherInfo, setOtherInfo] = useState(null);

    // const [gender, setGender] = useState(null);
    // const [race, setRace] = useState(null);
    // const [academic, setAcademic] = useState(null);

    // const [generalError, setGeneralError] = useState(null);

    // const [info, setInfo] = useState({})

    // const [additionalComments, setAdditionalComments] = useState(null);


    useEffect(async () => {
        autocomplete(document.getElementById("company"), authContext.companies, setCompany)
        autocomplete(document.getElementById("location"), locations, setLocation)
        
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

        document.getElementsByClassName('header')[0].scrollIntoView(false, { behavior: 'smooth', block: 'start' });
    }, []) 

    const addLevel = () => {
        var add = true;
        setAddClicked(true);
        if (level===null || level==='' || minYear === null || maxYear === null || minYear === '' || maxYear===''){
            add = false;
        } else if (level==='Other'){
            if (levelOther === null || levelOther===''){
                add = false;
            }
        }

        if (add===true){
            setAddClicked(false);
            var levelsTemp = levels.map((x)=>x);
            var levelsOtherTemp = levelsOther.map((x)=>x);
            var minYearsTemp = minYears.map((x)=>x);
            var maxYearsTemp = maxYears.map((x)=>x);

            levelsTemp.push(level);
            levelsOtherTemp.push(levelOther);
            minYearsTemp.push(minYear);
            maxYearsTemp.push(maxYear);


            setLevels(levelsTemp);
            setLevelsOther(levelsOtherTemp);
            setMinYears(minYearsTemp);
            setMaxYears(maxYearsTemp);

            setLevel('');
            setLevelOther('');
            setMinYear('');
            setMaxYear('');      
        }


    }

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
            if (x) {func(x[0].innerText); 
                x[currentFocus].click()
            }
        }}
    });

    inp.addEventListener("click", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        x = x.getElementsByTagName("div");
            func(x[0].innerText); 
            
        
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

            if (!authContext.userInfo === false){
                await Firebase.firestore().collection('users').doc(authContext.uid).set({
                    contribution: true,
                    timeline: true
                }, {merge: true})

                var dataTemp = authContext.userData;
                dataTemp['contribution'] = true;
                dataTemp['timeline'] = true;
                authContext.setUserData(dataTemp);
            }
            await Firebase.firestore().collection('leveling').doc('leveling').collection(company.toLowerCase()).doc().set(
                {company_name: company,
                division: division,
                division_other: divisionOther, 
                location: location,
                levels: levels,
                levels_other: levelsOther,
                min_years: minYears,
                max_years: maxYears,
                created_on: new Date(),
                uid: authContext.uid
                })
            setSubmitted(true);
            setLoading(false);
            setSubmitClicked(true);
            
        }
        setLoading(false);

    }

    /*An array containing all the country names in the world:*/

    var roles=['Investment Banking', 'Private Equity', 'Sales and Trading - Sales', 'Sales and Trading - Trading', 'Proprietary trading', 'Quant trading', 'Quantitative Research', 'Corporate Banking', 'Equity Research', 'Accounting', 'Investment Analyst', 'Management Consulting', 'Hedge Fund', 'Venture Capital', 'Private Banking', 'Asset Management', 'Operations', 'FP&A', 'Other']
    var titles=['Analyst', 'Senior Analyst', 'Associate', 'Director', 'Vice President', 'Managing Director', 'Partner', 'Portfolio Manager', 'Senior Vice President', 'Associate Vice President', 'Associate Director', 'Executive Director', 'Intern', 'Other']
    
    var locations=['Toronto, Ontario', 'Montreal, Quebec', 'Vancouver, British Columbia', 'Calgary, Alberta', 'New York, New York', 'Ottawa, Ontario', 'Edmonton, Alberta', 'Missisauga, Ontario', 'Winnipeg, Manitoba', 
    'Brampton, Ontario', 'Hamilton, Ontario', 'San Francisco, California', 'Los Angeles, California', 'Chicago, Illinois', 'San Mateo, California', 'Houston, Texas', 'Phoenix, Arizona', 'Philadelphia, Pennsylvania', 'San Antonio, Texas', 'San Diego, California', 'San Jose, California', 'Dallas, Texas',
    'Austin, Texas', 'San Jose, California', 'Forth Worth, Texas', 'Jacksonville, Florida', 'Charlotte, North Carolina', 'Seattle, Washington', 'Denver, Colorado', 'Washington, DC', 'Boston, Massachussetts', 'Detroit, Michigan', 'Portland, Oregon',  'Remote', 'MCOL', 'HCOL', 'LCOL', 'Other', 'Beijing, China', 'Shanghai, China', 'India', 'Indonesia', 'Pakistan',
    'Brazil', 'Nigeria', 'Bangladesh', 'Russia', 'Mexico', 'Japan', 'Ethiopia', 'Philippines', 'Egypt', 'Vietnam', 'DR Congo', 'Germany', 'Turkey', 'Iran', 'Thailand', 'United Kingdom', 'France', 'Italy', 'South Africa', 'Tanzania', 'Myanmar', 'Kenya', 'South Korea', 'Colombia', 'Spain', 'Argentina', 'Uganda', 'Ukraine', 'Algeria', 'Sudan', 'Iraq', 'Afghanistan',
    'Poland', 'Morocco', 'Saudi Arabia', 'Uzbekistan', 'Peru', 'Malaysia', 'Angola', 'Mozambique', 'Yemen', 'Ghana', 'Nepal', 'Venezuela', 'Madagascar', 'North Korea', 'Ivory Coast', 'Cameroon', 'Australia', 'Taiwan', 'Netherlands', 'Belgium', 'Sweden', 'United Arab Emirates', 'Austria', 'Switzerland', 'Hong Kong', 'Singapore', 'Denmark', 'Finland', 'Ireland', 'New Zealand']


    return (
        <div className = "content">
        <div className = 'header-wrapper'>
            <div className = "header">
                <Link  to='/' className = 'logo-wrap' >
                    Payscale <GiReceiveMoney/>
                </Link>
            </div>
        </div>

        {submitted === false ? 
            <form autocomplete="off" onSubmit={(e)=>{handleSubmit(e)}} className = 'form'>

        <div className='title'>Team Structure and Promotion Timeline</div>
        <div className='title-second' style={{fontStyle: 'italic'}}>Please help employees better understand a division's team and promotion structure by filling out the titles up to MD (or equivalent), and the minimum + average years at each level! </div>

            <div className='subtitle'>General Information</div>
            <div className = 'general-info'>


             <div class="autocomplete" >
                <label for='company' className='label'>Company</label><br/>
                {submitClicked===true && (company === null || company==='')  ? 
                <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value = {company} onChange={(e)=>{setCompany(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setCompany(e.target.value)}} placeholder="Company"/>
                : <input id="company" className = 'input' type="text" name="myCompany" value = {company} onChange={(e)=>{setCompany(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setCompany(e.target.value)}} placeholder="Company"/>
                } <br/>
            </div> <br/>

            <div class="autocomplete" >
                <label for='role' className='label'>Career Type</label><br/>

                {submitClicked===true && (division === null || division==='')  ? 
                <select id="role" style={{border: '0.5px solid red'}} onChange={(e)=>{e.preventDefault(); setDivision(e.target.value)}} className = 'input' name="myRole">
                    <option value='disabled' disabled selected className = 'option-select' >Please select a career/role</option>

                    {roles.map((role, i)=>{
                        return(
                            <option value={role} className = 'option' key={i}>{role}</option>
                        )
                    })}
                </select> : 
                <select id="role" className = 'input' name="myRole" onChange={(e)=>{e.preventDefault(); setDivision(e.target.value)}}>
                    <option value='disabled' disabled selected className = 'option-select'>Please select a career/role</option>

                    {roles.map((role, i)=>{
                        return(
                            <option value={role} className = 'option' key={i}>{role}</option>
                        )
                    })}
                </select>}<br/>

            </div><br/>

                {division === 'Other' ? submitClicked === true && (divisionOther === null || divisionOther === '') ? 
                            <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Career Type</label><br/>
                            <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value = {divisionOther} onChange={(e)=>{setDivisionOther(e.target.value)}} placeholder="Please Specify Career Type"/> <br/>
                            </div> : <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Career Type</label><br/>
                            <input id="company" className = 'input' type="text" name="myCompany" value = {divisionOther} onChange={(e)=>{setDivisionOther(e.target.value)}} placeholder="Please Specify Career Type"/> <br/>
                            </div> : null }


            <div class="autocomplete" >
                <label for='location'>Location</label><br/>
                {submitClicked===true && (location === null || location ==='')  ? 
                <input id="location" className = 'input' style={{border: '0.5px solid red'}} type="text" value = {location} onChange={(e)=>{setLocation(e.target.value)}} name="myTitle" placeholder="Location (in City, Country format)"/> : 
                <input id="location" className = 'input' type="text" value = {location} onChange={(e)=>{setLocation(e.target.value)}} name="myTitle" placeholder="Location (City, State/Province)"/>}<br/>
            </div>
            </div>

            <div className='subtitle'>Levels</div>
                <div className = 'general-info'>

                {levels.map((level, i)=>{
                    return (

                        <div class="autocomplete">

                            <label for='title'>Title</label><br/>
                            <select id="role" className = 'input' onChange={(e)=>{
                                var levelsTemp = levels.map((x)=>x);
                                levelsTemp[i] = e.target.value;
                                setLevels(levelsTemp);
                                }} name="myRole">
                                <option value='disabled' disabled selected className = 'option-select'>{level}</option>
                                {titles.map((title, i)=>{
                                    return(
                                        <option value={title} key={i}>{title}</option>
                                    )
                                })}

                            </select>
                            <br/>

                            {level === "Other" ? 

                            <div>
                            <br/>
                            <label for='title'>Other - Specific Title</label><br/>
                            <input id="location" className = 'input' type="text" value = {levelsOther[i]} onChange={(e)=>{
                                var levelsOtherTemp = levelsOther.map((x)=>x);
                                levelsOtherTemp[i] = e.target.value;
                                setLevelsOther(levelsOtherTemp);
                            }} />
                            </div>
                            : null}

                            <br/>

                            <div className = 'experience-wrapper'>
                            <label for='title'>Min Years</label><br/>
                            <input id="title" className = 'half-input-titles-left' type="number" value = {minYears[i]} onChange={(e)=>{
                                var minYearsTemp = minYears.map((x)=>x);
                                minYearsTemp[i] = e.target.value;
                                setminYears(minYearsTemp);
                                }} name="myTitle" placeholder="Min Years Before Promo"/> 
                            
                            </div>

                            <div className = 'experience-wrapper-right'>
                            <label for='title' className = 'experience-right'>Average Years</label><br/>
                            <input id="title" className = 'half-input-titles-right' type="number" value = {maxYears[i]} onChange={(e)=>{
                                var maxYearsTemp = maxYears.map((x)=>x);
                                maxYearsTemp[i] = e.target.value;
                                setmaxYears(maxYearsTemp);}} name="myTitle" placeholder="Avg Years Before Promo"/>
                            </div>
                        <br/>
                        <div className = 'add-level' style={{marginTop: '15px'}} onClick={()=>{
                                var levelsTemp = levels.map((x)=>x);
                                var levelsOtherTemp = levelsOther.map((x)=>x);
                                var minYearsTemp = minYears.map((x)=>x);
                                var maxYearsTemp = maxYears.map((x)=>x);

                                levelsTemp.splice(i, 1);
                                levelsOtherTemp.splice(i, 1);
                                minYearsTemp.splice(i, 1);
                                maxYearsTemp.splice(i, 1);



                                setLevels(levelsTemp);
                                setLevelsOther(levelsOtherTemp);
                                setMinYears(minYearsTemp);
                                setMaxYears(maxYearsTemp);

                        }}>- Delete This Level</div>
                        <br/>
                        <br/> 
                        <br/><br/><br/>                           
                        </div>

                    )

                    })}

                
                <div class="autocomplete" >
                <label for='role' className='label'>Title</label><br/>
                {addClicked===true && (level === null || level==='')  ? 

    
                <select id="role" className = 'input' style={{border: '0.5px solid red'}} value={level} onChange={(e)=>{setLevel(e.target.value)}} name="myRole">
                    <option value='disabled' selected className = 'option-select'>Please select a title</option>
                    {titles.map((title, i)=>{
                        return(
                            <option value={title} key={i}>{title}</option>
                        )
                    })}
                </select> : 
                <select id="role" className = 'input' value={level} style={{border: '0.5px dashed gray'}} onChange={(e)=>{setLevel(e.target.value)}} name="myRole">
                    <option value='disabled' selected className = 'option-select'>Please select a title</option>
                    {titles.map((title, i)=>{
                        return(
                            <option value={title} key={i}>{title}</option>
                        )
                    })}
                </select>}
                </div>

                {level === 'Other' ? addClicked === true && (levelOther === null || levelOther === '') ? 
                            <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Title</label><br/>
                            <input id="company" className = 'input' type="text" name="myCompany" style={{border: '0.5px solid red'}} value = {levelOther} onChange={(e)=>{setLevelOther(e.target.value)}} placeholder="Please Specify Title"/> <br/>
                            </div> : <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Title</label><br/>
                            <input id="company" className = 'input' type="text" name="myCompany" style={{border: '0.5px dashed gray'}} value = {levelOther} onChange={(e)=>{setLevelOther(e.target.value)}} placeholder="Please Specify Title"/> <br/>
                            </div> : null }

                <div class="autocomplete" >

                    {addClicked===true && (minYear === null || minYear==='')  ? 
                    <div className = 'experience-wrapper'>
                    <label for='title'>Min Years</label><br/>
                    <input id="title" className = 'half-input-titles-left' style={{border: '0.5px solid red'}} type="number" value = {minYear} onChange={(e)=>{setMinYear(e.target.value)}} name="myTitle" placeholder="Min Years Before Promo"/> 
                    
                    </div>:

                    <div className = 'experience-wrapper'>
                    <label for='title'>Min Years</label><br/>
                    <input id="title" className = 'half-input-titles-left' type="number" value = {minYear} style={{border: '0.5px dashed gray'}} onChange={(e)=>{setMinYear(e.target.value)}} name="myTitle" placeholder="Min Years Before Promo"/>
                    </div>}
                    {addClicked===true && (maxYear=== null || maxYear==='')  ? 

                    <div className = 'experience-wrapper-right'>
                    <label for='title' className = 'experience-right'>Average Years</label><br/>
                    <input id="title" className = 'half-input-titles-right' style={{border: '0.5px solid red'}} type="number" value = {maxYear} onFocus = {''} onChange={(e)=>{setMaxYear(e.target.value)}} name="myTitle" placeholder="Avg Years Before Promo"/>
                    </div> : 
                    <div className = 'experience-wrapper-right'>
                    <label for='title' className = 'experience-right'>Average Years</label><br/>
                    <input id="title" className = 'half-input-titles-right' type="number" style={{border: '0.5px dashed gray'}} onFocus = {''} value = {maxYear} onChange={(e)=>{setMaxYear(e.target.value)}} name="myTitle" placeholder="Avg Years Before Promo"/>
                    </div>}
                </div>

                <div className='title-second' style={{fontStyle: 'italic', marginLeft: '0px'}}> * Please enter -1 for both inputs if there is no definite timeframe at this level </div>

                            

            <div className = 'add-level' onClick={()=>{addLevel()}}>+ Add This Level</div>
            </div>

            <input type="submit" disabled={loading} value={loading ? "Loading..." : "Submit"}/>
            <div className = 'error'>{generalError}</div>

            </form> : 
            <form autocomplete="off" onSubmit={(e)=>{handleSubmit(e)}} className = 'form'>
                <br/><br/>
            <div className = 'general-info'>
                <div className='thank-you'>Thank You</div>
                <div className = 'thank-you-inner'>

                    <div>Your submission helps increase information around opportunities and career progression within finance. </div>
                    <br/><br/><br/>
                    
                    <Link to='/salaries' className = 'back'>Back to salaries ></Link>
                </div>
            </div>
            </form>}

            <div className = 'bottom-spacer'></div>

        </div> 
    );
}

export default EntryForm;