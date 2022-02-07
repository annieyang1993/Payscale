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
    

    const [submitClicked, setSubmitClicked] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [job, setJob] = useState(false);
    const [school, setSchool] = useState(false);

    const [currentCompany, setCurrentCompany] = useState(null);
    const [currentCareerType, setCurrentCareerType] = useState(null);
    const [currentTitle, setCurrentTitle] = useState(null);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [currentCareerTypeOther, setCurrentCareerTypeOther] = useState(null);
    const [currentTitleOther, setCurrentTitleOther] = useState(null);

    const [university, setUniversity] = useState(null);
    const [educationType, setEducationType] = useState(null);

    const [otherInfo, setOtherInfo] = useState(null);

    const [gender, setGender] = useState(null);
    const [race, setRace] = useState(null);
    const [academic, setAcademic] = useState(null);

    const [generalError, setGeneralError] = useState(null);

    const [info, setInfo] = useState({})

    const [additionalComments, setAdditionalComments] = useState(null);

    function PreviousJob(){

    const [oldCompany, setOldCompany] = useState(info['old_company']);
    const [oldCareerType, setOldCareerType] = useState(info['old_career_type']);
    const [oldTitle, setOldTitle] = useState(info['old_title']);
    const [oldGroup, setOldGroup] = useState(info['old_group']);
    const [oldLocation, setOldLocation] = useState(info['old_location']);
    const [oldCareerTypeOther, setOldCareerTypeOther] = useState(info['old_career_type_other']);
    const [oldTitleOther, setOldTitleOther] = useState(info['old_title_other']);
    const [yearsWorking, setYearsWorking] = useState(info['old_years']);

    const [decrease, setDecrease] = useState(info['salary_change']==='decrease');
    const [same, setSame] = useState(info['salary_change']==='same' ? true : false);
    const [increase, setIncrease] = useState(info['salary_change']==='increase' ? true : false);

    const [change, setChange] = useState(info['salary_change_percentage']);

    useEffect(async () => {
        autocomplete(document.getElementById("company2"), authContext.companies, 'old_company', setOldCompany)
       
        autocomplete(document.getElementById("location1"), locations, 'old_location', setOldLocation)
        
        document.addEventListener("wheel", function(event){
            if(document.activeElement.type === "number"){
                document.activeElement.blur();
            }
        });
        

    }, [])

        return (
            <div>

            <div className='subtitle'>Previous Role</div>
            <div className = 'general-info'>


            <div class="autocomplete" >
                <label for='company2' className='label'>Company</label><br/>
                {submitClicked===true && (oldCompany === null || oldCompany==='')  ? 
                <input id="company2" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value  = {oldCompany} onChange={(e)=>{setOldCompany(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setOldCompany(e.target.value)}} placeholder="Company"/>
                : <input id="company2" className = 'input' type="text" name="myCompany" value = {oldCompany} onChange={(e)=>{setOldCompany(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setOldCompany(e.target.value)}} placeholder="Company"/>
                } <br/>
            </div> <br/>

            <div class="autocomplete" >
                <label for='role' className='label'>Career Type</label><br/>

                {submitClicked===true && (oldCareerType === null || oldCareerType==='')  ? 
                <select id="role" style={{border: '0.5px solid red'}} value={oldCareerType} onChange={(e)=>{e.preventDefault(); var infoTemp = info; infoTemp['old_career_type'] = e.target.value; setInfo(infoTemp); setOldCareerType(e.target.value)}} className = 'input' name="myRole">
                    <option value='disabled' disabled selected className = 'option-select' >Please select a career/role</option>

                    {roles.map((role, i)=>{
                        return(
                            <option value={role} className = 'option' key={i}>{role}</option>
                        )
                    })}
                </select> : 
                <select id="role" className = 'input' name="myRole" value={oldCareerType} onChange={(e)=>{e.preventDefault(); var infoTemp = info; infoTemp['old_career_type'] = e.target.value; console.log(infoTemp); setInfo(infoTemp); setOldCareerType(e.target.value)}}>
                    <option value='disabled' disabled selected className = 'option-select'>Please select a career/role</option>

                    {roles.map((role, i)=>{
                        return(
                            <option value={role} className = 'option' key={i}>{role}</option>
                        )
                    })}
                </select>}<br/>

            </div><br/>

                {oldCareerType === 'Other' ? submitClicked === true && (oldCareerTypeOther === null || oldCareerTypeOther === '') ? 
                            <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Career Type</label><br/>
                            <input id="company" style={{border: '0.5px solid red'}} value={oldCareerTypeOther} className = 'input' type="text" name="myCompany" value = {oldCareerTypeOther} onChange={(e)=>{setOldCareerTypeOther(e.target.value); var infoTemp = info; infoTemp['old_career_type_other'] = e.target.value; setInfo(infoTemp);}} placeholder="Please Specify Career Type"/> <br/>
                            </div> : <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Career Type</label><br/>
                            <input id="company" className = 'input' type="text" name="myCompany" value = {oldCareerTypeOther} onChange={(e)=>{setOldCareerTypeOther(e.target.value); var infoTemp = info; infoTemp['old_career_type_other'] = e.target.value; setInfo(infoTemp);}} placeholder="Please Specify Career Type"/> <br/>
                            </div> : null }

            <div class="autocomplete" >
                <label for='role' className='label'>Title</label><br/>
                {submitClicked===true && (oldTitle === null || oldTitle ==='')  ? 
                <select id="role" style={{border: '0.5px solid red'}} className = 'input' value={oldTitle} onChange={(e)=>{setOldTitle(e.target.value); var infoTemp = info; infoTemp['old_title'] = e.target.value; setInfo(infoTemp);}} name="myRole">
                    <option value='disabled' disabled selected className = 'option-select'>Please select a title</option>
                    {titles.map((title, i)=>{
                        return(
                            <option value={title} key={i}>{title}</option>
                        )
                    })}
                </select> : 
                <select id="role" className = 'input' value={oldTitle} onChange={(e)=>{setOldTitle(e.target.value); var infoTemp = info; infoTemp['old_title'] = e.target.value; setInfo(infoTemp);}} name="myRole">
                    <option value='disabled' disabled selected className = 'option-select'>Please select a title</option>
                    {titles.map((title, i)=>{
                        return(
                            <option value={title} key={i}>{title}</option>
                        )
                    })}
                </select>}<br/>
            </div><br/>

                {oldTitle === 'Other' ? submitClicked === true && (oldTitleOther === null || oldTitleOther === '') ? 
                            <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Title</label><br/>
                            <input id="company" style={{border: '0.5px solid red'}} value={oldTitleOther} className = 'input' type="text" name="myCompany" value = {oldTitleOther} onChange={(e)=>{setOldTitleOther(e.target.value); var infoTemp = info; infoTemp['old_title_other'] = e.target.value; setInfo(infoTemp);}} placeholder="Please Specify Title"/> <br/>
                            </div> : <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Title</label><br/>
                            <input id="company" className = 'input' type="text" name="myCompany" value = {oldTitleOther} onChange={(e)=>{setOldTitleOther(e.target.value); var infoTemp = info; infoTemp['old_title_other'] = e.target.value; setInfo(infoTemp);}} placeholder="Please Specify Title"/> <br/>
                            </div> : null }


            <div class="autocomplete" >
                <label for='title'>Group</label><br/>
                {submitClicked===true && (oldGroup === null || oldGroup==='')  ? 
                <input id="title" className = 'input' style={{border: '0.5px solid red'}} type="text" value={oldGroup} onChange={(e)=>{setOldGroup(e.target.value); var infoTemp = info; infoTemp['old_group'] = e.target.value; setInfo(infoTemp);}} name="myTitle" placeholder="E.g. M&amp;A, Generalist, Options, Derivatives"/>
                : <input id="title" className = 'input' type="text" value={oldGroup} onChange={(e)=>{setOldGroup(e.target.value); var infoTemp = info; infoTemp['old_group'] = e.target.value; setInfo(infoTemp);}} name="myTitle" placeholder="E.g. M&amp;A, Generalist, Options, Derivatives"/>}<br/>
            </div>

            <div class="autocomplete" >
                <label for='location1'>Location (Not Required) </label><br/>
                <input id="location1" className = 'input' type="text" value = {oldLocation} onChange={(e)=>{setOldLocation(e.target.value); var infoTemp = info; infoTemp['old_location'] = e.target.value; setInfo(infoTemp);}} name="myTitle" placeholder="Location (City, State/Province)"/><br/>
            </div>

            <div class="autocomplete" >
                <label for='title'>Number of Years in Role</label><br/>
                {submitClicked===true && (oldGroup === null || oldGroup==='')  ? 
                <input id="title" className = 'input' style={{border: '0.5px solid red'}} type="number" value={yearsWorking} onChange={(e)=>{setYearsWorking(e.target.value); var infoTemp = info; infoTemp['old_years'] = e.target.value; setInfo(infoTemp);}} name="myTitle" placeholder="Years in this Role"/>
                : <input id="title" className = 'input' type="number" value={yearsWorking} onChange={(e)=>{setYearsWorking(e.target.value); var infoTemp = info; infoTemp['old_years'] = e.target.value; setInfo(infoTemp);}} name="myTitle" placeholder="Years in this Role"/>}<br/>
            </div>

            {submitClicked===true && (decrease === false && same === false && increase === false)  ? 

            <div class="autocomplete">
                <br/>
                <label for='title'>Total Compensation Change After Switching</label><br/>
                <input id='switch' name="apply-by2" type='radio' checked={decrease} onClick={()=>{setDecrease(true); setSame(false); setIncrease(false); var infoTemp = info; infoTemp['salary_change'] = 'decrease'; infoTemp['school'] = false; setInfo(infoTemp);}}/>
                <label for='switch' style={{color: 'red', fontSize:'0.9rem'}} checked={decrease} checked={decrease} name="apply-by2" onClick={()=>{setDecrease(true); setSame(false); setIncrease(false); var infoTemp = info; infoTemp['salary_change'] = 'decrease'; infoTemp['school'] = false; setInfo(infoTemp);}}>Decreased</label>
                <spacer width="50">   </spacer> 
                <input id='switch' name="apply-by2" type='radio' checked={same} onClick={()=>{setDecrease(false); setSame(true); setIncrease(false); var infoTemp = info; infoTemp['salary_change'] = 'same'; infoTemp['school'] = false; setInfo(infoTemp);}} />
                <label for='switch' style={{color: 'red', fontSize:'0.9rem'}} checked={same} name="apply-by2" onClick={()=>{setDecrease(false); setSame(true); setIncrease(false); var infoTemp = info; infoTemp['salary_change'] = 'same'; infoTemp['school'] = false; setInfo(infoTemp);}}>Stayed the same</label>

                <input id='switch' name="apply-by2" type='radio' checked={increase} onClick={()=>{setDecrease(false); setSame(false); setIncrease(true); var infoTemp = info; infoTemp['salary_change'] = 'increase'; infoTemp['school'] = false; setInfo(infoTemp);}} />
                <label for='switch' style={{color: 'red', fontSize:'0.9rem'}} checked={increase} name="apply-by2" onClick={()=>{setDecrease(false); setSame(false); setIncrease(true); var infoTemp = info; infoTemp['salary_change'] = 'increase'; infoTemp['school'] = false; setInfo(infoTemp);}}>Increased</label>
            </div> : 
            <div class="autocomplete" >
                <br/>
                <label for='title' >Total Compensation After Switching</label><br/>
                <input id='switch' name="apply-by2" type='radio' checked={decrease} onClick={()=>{setDecrease(true); setSame(false); setIncrease(false); var infoTemp = info; infoTemp['salary_change'] = 'decrease'; infoTemp['school'] = false; setInfo(infoTemp);}}/>
                <label for='switch' style={{color: 'gray', fontSize:'0.9rem'}} checked={decrease} name="apply-by2" onClick={()=>{setDecrease(true); setSame(false); setIncrease(false); var infoTemp = info; infoTemp['salary_change'] = 'decrease'; infoTemp['school'] = false; setInfo(infoTemp);}}>Decreased</label>
                <spacer width="50">   </spacer> 
                <input id='switch' name="apply-by2" type='radio' checked={same} onClick={()=>{setDecrease(false); setSame(true); setIncrease(false); var infoTemp = info; infoTemp['salary_change'] = 'same'; infoTemp['school'] = false; setInfo(infoTemp);}} />
                <label for='switch' style={{color: 'gray', fontSize:'0.9rem'}} checked={same} name="apply-by2" onClick={()=>{setDecrease(false); setSame(true); setIncrease(false); var infoTemp = info; infoTemp['salary_change'] = 'same'; infoTemp['school'] = false; setInfo(infoTemp);}}>Stayed the same</label>

                <input id='switch' name="apply-by2" type='radio' checked={increase} onClick={()=>{setDecrease(false); setSame(false); setIncrease(true); var infoTemp = info; infoTemp['salary_change'] = 'increase'; infoTemp['school'] = false; setInfo(infoTemp);}} />
                <label for='switch' style={{color: 'gray', fontSize:'0.9rem'}} checked={increase} name="apply-by2" onClick={()=>{setDecrease(false); setSame(false); setIncrease(true); var infoTemp = info; infoTemp['salary_change'] = 'increase'; infoTemp['school'] = false; setInfo(infoTemp);}}>Increased</label>
            </div>}

            <div class="autocomplete" >
                <label for='location1'>Total Compensation Change in % (Not Required) </label><br/>
                <input id="location1" className = 'input' type="number" value = {change} onChange={(e)=>{setChange(e.target.value); var infoTemp = info; infoTemp['salary_change_percentage'] = e.target.value; setInfo(infoTemp);}} name="myTitle" placeholder="Enter 20 for 20%"/><br/>
            </div>

            
            </div>
            </div> 

        )
    }
    




    useEffect(async () => {
        autocomplete(document.getElementById("company"), authContext.companies, 'current_company', setCurrentCompany)
       
        autocomplete(document.getElementById("location"), locations, 'current_location', setCurrentLocation)
        
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

    function autocomplete(inp, arr, key, func) {
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
                var infoTemp = info;
                infoTemp[key] = inp.value;
                setInfo(infoTemp);
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
            if (x) {func(x[0].innerText); console.log(x[0].innerText); 
                var infoTemp = info;
                infoTemp[key] = x[0].innerText
                setInfo(infoTemp); 
                x[currentFocus].click()};
            }
        }
    });

    inp.addEventListener("click", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        x = x.getElementsByTagName("div");
            func(x[0].innerText); 
            var infoTemp = info;
            infoTemp[key] = x[0].innerText
            setInfo(infoTemp); 
            console.log(x[0].innerText);
            
        
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
        if (info['current_company'] === undefined || info['current_company'] === null || info['current_company'] === '' 
        || info['current_career_type'] === undefined || info['current_career_type'] === null || info['current_career_type'] === '' 
        || info['current_title'] === undefined || info['current_title'] === null || info['current_title'] === ''
        || info['current_group'] === undefined || info['current_group'] === null || info['current_group'] === ''
        || info['job'] === undefined && info['school'] === undefined || info['job'] === false && info['school'] === false
        ){
            setGeneralError('* Please fill-out all highlighted fields.')
            submit = false;
        } else if (info['current_career_type'] === 'Other' && (info['current_career_type_other'] === undefined || info['current_career_type_other'] === null || info['current_career_type_other'] === '')){
            setGeneralError('* Please fill-out all highlighted fields.')
            submit = false;
        }  else if (info['current_title_type'] === 'Other' && (info['current_title_type_other'] === undefined || info['current_title_type_other'] === null || info['current_title_type_other'] === '')){
            setGeneralError('* Please fill-out all highlighted fields.')
            submit = false;
        } else if (info['job']===true){
             if (info['old_company'] === undefined || info['old_company'] === null || info['old_company'] === '' 
                || info['old_career_type'] === undefined || info['old_career_type'] === null || info['old_career_type'] === '' 
                || info['old_title'] === undefined || info['old_title'] === null || info['old_title'] === ''
                || info['old_group'] === undefined || info['old_group'] === null || info['old_group'] === ''
                || info['old_years'] === undefined || info['old_years'] === null || info['old_years'] === ''
                || info['salary_change'] === undefined || info['salary_change'] === null || info['salary_change'] === ''
                ){
                    setGeneralError('* Please fill-out all highlighted fields.')
                    submit = false;
                } else if (info['old_career_type'] === 'Other' && (info['old_career_type_other'] === undefined || info['old_career_type_other'] === null || info['old_career_type_other'] === '')){
                    setGeneralError('* Please fill-out all highlighted fields.')
                    submit = false;
                }  else if (info['old_title_type'] === 'Other' && (info['old_title_type_other'] === undefined || info['old_title_type_other'] === null || info['old_title_type_other'] === '')){
                    setGeneralError('* Please fill-out all highlighted fields.')
                    submit = false;
                }

        } else if (info['school']===true){

            if (info['university'] === undefined || info['university'] === null || info['university'] === '' 
                || info['education_type'] === undefined || info['education_type'] === null || info['education_type'] === '' 
                ){
                    setGeneralError('* Please fill-out all highlighted fields.')
                    submit = false;
                } 
        }
        
        
        
        else{
            setGeneralError('')
        }




        if (submit === true){
            setLoading(true)
            await Firebase.firestore().collection('opportunities').doc().set(
                info
            )
            setSubmitted(true);
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
    var academics = ['High school or equivalent', 'Technical or occupational certificate', 'Associate Degree', "Bachelor's degree", "MBA", "Master's degree", 'Doctorate (PhD)']
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
                

            <div className='subtitle'>New Role</div>
            <div className='subtitle-1'>New/latest role you started</div>
            <div className = 'general-info'>

                    {/* const [currentCompany, setCurrentCompany] = useState(null);
    const [currentCareerType, setCurrentCareerType] = useState(null);
    const [currentTitle, setCurrentTitle] = useState(null);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null); */}

             <div class="autocomplete" >
                <label for='company' className='label'>Company</label><br/>
                {submitClicked===true && (currentCompany === null || currentCompany==='')  ? 
                <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value = {currentCompany} onChange={(e)=>{setCurrentCompany(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setCurrentCompany(e.target.value)}} placeholder="Company"/>
                : <input id="company" className = 'input' type="text" name="myCompany" value = {currentCompany} onChange={(e)=>{setCurrentCompany(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setCurrentCompany(e.target.value)}} placeholder="Company"/>
                } <br/>
            </div> <br/>

            <div class="autocomplete" >
                <label for='role' className='label'>Career Type</label><br/>

                {submitClicked===true && (currentCareerType === null || currentCareerType==='')  ? 
                <select id="role" style={{border: '0.5px solid red'}} onChange={(e)=>{e.preventDefault(); var infoTemp = info; infoTemp['current_career_type'] = e.target.value; setInfo(infoTemp); setCurrentCareerType(e.target.value)}} className = 'input' name="myRole">
                    <option value='disabled' disabled selected className = 'option-select' >Please select a career/role</option>

                    {roles.map((role, i)=>{
                        return(
                            <option value={role} className = 'option' key={i}>{role}</option>
                        )
                    })}
                </select> : 
                <select id="role" className = 'input' name="myRole" onChange={(e)=>{e.preventDefault();var infoTemp = info; infoTemp['current_career_type'] = e.target.value; setInfo(infoTemp);  setCurrentCareerType(e.target.value)}}>
                    <option value='disabled' disabled selected className = 'option-select'>Please select a career/role</option>

                    {roles.map((role, i)=>{
                        return(
                            <option value={role} className = 'option' key={i}>{role}</option>
                        )
                    })}
                </select>}<br/>

            </div><br/>

                {currentCareerType === 'Other' ? submitClicked === true && (currentCareerTypeOther === null || currentCareerTypeOther === '') ? 
                            <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Career Type</label><br/>
                            <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value = {currentCareerTypeOther} onChange={(e)=>{var infoTemp = info; infoTemp['current_career_type_other'] = e.target.value; setInfo(infoTemp);setCurrentCareerTypeOther(e.target.value)}} placeholder="Please Specify Career Type"/> <br/>
                            </div> : <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Career Type</label><br/>
                            <input id="company" className = 'input' type="text" name="myCompany" value = {currentCareerTypeOther} onChange={(e)=>{setCurrentCareerTypeOther(e.target.value); var infoTemp = info; infoTemp['current_career_type_other'] = e.target.value; setInfo(infoTemp);}} placeholder="Please Specify Career Type"/> <br/>
                            </div> : null }

            <div class="autocomplete" >
                <label for='role' className='label'>Title</label><br/>
                {submitClicked===true && (currentTitle === null || currentTitle ==='')  ? 
                <select id="role" style={{border: '0.5px solid red'}} className = 'input' onChange={(e)=>{setCurrentTitle(e.target.value); var infoTemp = info; infoTemp['current_title'] = e.target.value; setInfo(infoTemp);}} name="myRole">
                    <option value='disabled' disabled selected className = 'option-select'>Please select a title</option>
                    {titles.map((title, i)=>{
                        return(
                            <option value={title} key={i}>{title}</option>
                        )
                    })}
                </select> : 
                <select id="role" className = 'input' onChange={(e)=>{setCurrentTitle(e.target.value); var infoTemp = info; infoTemp['current_title'] = e.target.value; setInfo(infoTemp);}} name="myRole">
                    <option value='disabled' disabled selected className = 'option-select'>Please select a title</option>
                    {titles.map((title, i)=>{
                        return(
                            <option value={title} key={i}>{title}</option>
                        )
                    })}
                </select>}<br/>
            </div><br/>

                {currentTitle === 'Other' ? submitClicked === true && (currentTitleOther === null || currentTitleOther === '') ? 
                            <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Title</label><br/>
                            <input id="company" style={{border: '0.5px solid red'}} className = 'input' type="text" name="myCompany" value = {currentTitleOther} onChange={(e)=>{setCurrentTitleOther(e.target.value); var infoTemp = info; infoTemp['current_title_other'] = e.target.value; setInfo(infoTemp);}} placeholder="Please Specify Title"/> <br/>
                            </div> : <div class="autocomplete" >
                            <label for='company' className='label'>Please Specify Title</label><br/>
                            <input id="company" className = 'input' type="text" name="myCompany" value = {currentTitleOther} onChange={(e)=>{setCurrentTitleOther(e.target.value); var infoTemp = info; infoTemp['current_title_other'] = e.target.value; setInfo(infoTemp);}} placeholder="Please Specify Title"/> <br/>
                            </div> : null }


            <div class="autocomplete" >
                <label for='title'>Group</label><br/>
                {submitClicked===true && (currentGroup === null || currentGroup==='')  ? 
                <input id="title" className = 'input' style={{border: '0.5px solid red'}} type="text" onChange={(e)=>{setCurrentGroup(e.target.value); var infoTemp = info; infoTemp['current_group'] = e.target.value; setInfo(infoTemp);}} name="myTitle" placeholder="E.g. M&amp;A, Generalist, Options, Derivatives"/>
                : <input id="title" className = 'input' type="text" onChange={(e)=>{setCurrentGroup(e.target.value); var infoTemp = info; infoTemp['current_group'] = e.target.value; setInfo(infoTemp);}} name="myTitle" placeholder="E.g. M&amp;A, Generalist, Options, Derivatives"/>}<br/>
            </div>

            <div class="autocomplete" >
                <label for='location'>Location (Not Required)</label><br/>
                <input id="location" className = 'input' type="text" value = {currentLocation} onChange={(e)=>{setCurrentLocation(e.target.value); var infoTemp = info; infoTemp['current_location'] = e.target.value; setInfo(infoTemp);}} name="myTitle" placeholder="Location (City, State/Province)"/><br/>
            </div>

            </div>

            <div className='subtitle'>You Were Previously</div>

             <div className = 'general-info'>

            {submitClicked===true && job === false && school===false  ? 
            
            <div class="autocomplete"  style={{color: 'red'}} >
                <input id='switch' name="apply-by1" type='radio' onClick={()=>{setJob(true); setSchool(false); var infoTemp = info; infoTemp['job'] = true; infoTemp['school'] = false; setInfo(infoTemp);}}/>
                <label for='switch' name="apply-by1" value={job} onClick={()=>{setJob(true); setSchool(false); var infoTemp = info; infoTemp['job'] = true; infoTemp['school'] = false; setInfo(infoTemp)}}>Employed at another job</label>
                <spacer width="50">   </spacer> 
                <input id='switch' name="apply-by1" type='radio' onClick={()=>{setSchool(true); setJob(false); var infoTemp = info; infoTemp['job'] = false; infoTemp['school'] = true; setInfo(infoTemp)}} />
                <label for='switch' name="apply-by1" value={school} onClick={()=>{setSchool(true); setJob(false); var infoTemp = info; infoTemp['job'] = false; infoTemp['school'] = true; setInfo(infoTemp)}}>In school</label>
            </div> :
                        <div class="autocomplete" >
                <input id='switch' name="apply-by1" type='radio' onClick={()=>{setJob(true); setSchool(false); var infoTemp = info; infoTemp['job'] = true; infoTemp['school'] = false; setInfo(infoTemp);}}/>
                <label for='switch' name="apply-by1" value={job} onClick={()=>{setJob(true); setSchool(false); var infoTemp = info; infoTemp['job'] = true; infoTemp['school'] = false; setInfo(infoTemp)}}>Employed at another job</label>
                <spacer width="50">   </spacer> 
                <input id='switch' name="apply-by1" type='radio' onClick={()=>{setSchool(true); setJob(false); var infoTemp = info; infoTemp['job'] = false; infoTemp['school'] = true; setInfo(infoTemp)}} />
                <label for='switch' name="apply-by1" value={school} onClick={()=>{setSchool(true); setJob(false); var infoTemp = info; infoTemp['job'] = false; infoTemp['school'] = true; setInfo(infoTemp)}}>In school</label>
            </div>
                } 


            </div>

            {/* SECOND SECTION!!!*/}

            {job ? <PreviousJob/> : null}

            {school ? <div>

            <div className='subtitle'>Education Information</div>

            <div className = 'general-info'>
                <label for='title'>School/University</label><br/>

                <div class="autocomplete" >
                    {submitClicked===true && (university === null || university==='')  ? 
                    <input id="title" className = 'input' style={{border: '0.5px solid red'}} type="text" onChange={(e)=>{setUniversity(e.target.value); var infoTemp = info; infoTemp['university'] = e.target.value; setInfo(infoTemp)}} name="myTitle" placeholder="School Name"/>
                    : <input id="title" className = 'input' type="text" onChange={(e)=>{setUniversity(e.target.value); var infoTemp = info; infoTemp['university'] = e.target.value; setInfo(infoTemp)}} name="myTitle" placeholder="School Name"/>}<br/>
                </div>

            <div class="autocomplete" >
                <label for='title'>Academic Level</label><br/>
                    {submitClicked===true && (educationType === null || educationType==='')  ? 
                <select id="academic" style={{border: '0.5px solid red'}} onChange={(e)=>{if (e.target.value === 'Please select your previous academic level') {setEducationType(null); var infoTemp = info; infoTemp['education_type'] = null; setInfo(infoTemp)} else{setEducationType(e.target.value); var infoTemp = info; infoTemp['education_type'] = e.target.value; setInfo(infoTemp)}}} className = 'input' name="myAcademic">
                    <option value={null} selected className = 'option-select'>Please select your previous academic level</option>
                    {academics.map((academic, i)=>{
                        return(
                            <option value={academic}  key={i}>{academic}</option>
                        )
                    })}
                </select> :
                <select id="academic" onChange={(e)=>{if (e.target.value === 'Please select your previous academic level') {setEducationType(null); var infoTemp = info; infoTemp['education_type'] = null; setInfo(infoTemp)} else{setEducationType(e.target.value); var infoTemp = info; infoTemp['education_type'] = e.target.value; setInfo(infoTemp)}}} className = 'input' name="myAcademic">
                    <option value={null} selected className = 'option-select'>Please select your previous academic level</option>
                    {academics.map((academic, i)=>{
                        return(
                            <option value={academic}  key={i}>{academic}</option>
                        )
                    })}
                </select>}
                
                
                <br/>
            </div>



            </div>

            </div> : null}



            <div className='subtitle'>Comments, Advice, Resources (Not Required)</div>

            <div className = 'general-info'>
                <textarea className = 'additional-info-form' onChange={(e)=>{setAdditionalComments(e.target.value); var infoTemp = info; console.log(infoTemp); infoTemp['advice'] = e.target.value; setInfo(infoTemp)}}/>
            </div>


            <input type="submit" disabled={loading} value={loading ? "Loading..." : "Submit"}/>

            <div className = 'error'>{generalError}</div>

            </form> : 
            <form autocomplete="off" onSubmit={(e)=>{handleSubmit(e)}} className = 'form'>
                <br/><br/>
            <div className = 'general-info'>
                <div className='thank-you'>Thank You!</div>
                <div className = 'thank-you-inner'>

                    <div>Your submission increase information around opportunities and career progression within finance. </div>
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