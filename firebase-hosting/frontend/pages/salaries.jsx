import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
import AuthContext from '../../context/Context'
import {useStripe, useElements, PaymentElement, CardElement,} from '@stripe/react-stripe-js';
import {Elements, StripeProvider} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {Firebase, db, functions} from '../../config/firebase';
import {GiRayGun, GiReceiveMoney} from 'react-icons/gi'
import {BsCoin} from 'react-icons/bs'
import {BsCheckLg} from 'react-icons/bs'
import {BsFillCalendarCheckFill, BsNewspaper} from 'react-icons/bs'
import {AiOutlineLineChart, AiTwotoneCalendar} from 'react-icons/ai'
import Resizer from 'react-image-file-resizer'
import ReactMarkdown from 'react-markdown';
import Footer from '../components/footer'
import Header from '../components/header'
import SalaryNav from '../components/salarynav'

import Select from 'react-select'
import {Link} from 'react-router-dom'
import Entry from './entryopsform'
import {BsChevronCompactDown} from 'react-icons/bs'


import {BiSupport} from 'react-icons/bi'
//import {Firebase, db} from '../config/firebase';
require('react-dom');

function Stats({companyName, title, division, yoe}){
    const authContext = useContext(AuthContext);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tenPercentExpand, setTenPercentExpand] = useState(false);
    const [medianExpand, setMedianExpand] = useState(false);
    const [ninetyPercentExpand, setNinetyPercentExpand] = useState(false);
    
    var minTemp = 0;
    var maxTemp = 0;
    var totalTemp = 0;
    var countTemp = 0;

    var salaries = [];
    var allInfo = [];

    const sort = (arr1, arr2) =>{
      if (arr1.length === 1 || arr1.length === 0){
        return [arr1, arr2];
      } else{
        var el = arr1[0];
        var left = [];
        var right = [];
        var left1 = [];
        var right1 = [];

        arr1.map((ele, i)=>{
          if (i!==0){
            if (ele<=el){
              left.push(ele);
              left1.push(arr2[i]);
            
            } else{
              right.push(ele);
              right1.push(arr2[i]);
            
            }
          }
          
        })

        var leftsorted = sort(left, left1);
        var rightsorted = sort(right, right1);


        return [leftsorted[0].concat(el).concat(rightsorted[0]), leftsorted[1].concat(arr2[0]).concat(rightsorted[1])];
      }
    }

    function currencyFormat(num) {
        return '$' + String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

     useEffect(async () => {
         
        // autocomplete(document.getElementById("company1"), authContext.companies, setCompanyName)
        // document.addEventListener("wheel", function(event){
        //     if(document.activeElement.type === "number"){
        //         document.activeElement.blur();
        //     }
        // });
        //autocomplete(document.getElementById("role"), roles)
        // companies.map(async (company, i)=>{
        //     var hash = {}
        //     hash[company] = false
        //     await Firebase.firestore().collection('companies').doc('companies').set(hash, {merge: true})
        // })
    }, [])

    authContext.salariesArr.map((salary, j)=>{
            var included = true
            if (authContext.salaries[salary].live === false){
                included = false;
            } else if (companyName!==null && companyName!== '' && !authContext.salaries[salary].company_name.toLowerCase().includes(companyName.toLowerCase())){
                included = false;
            } else if (title!==null && title!== '' && authContext.salaries[salary].title.toLowerCase() !== title.toLowerCase()){
                included = false;
            } else if (division!==null && division!=='' && authContext.salaries[salary].career_type.toLowerCase() !== division.toLowerCase()){
                if (authContext.salaries[salary].career_type_other === null || authContext.salaries[salary].career_type_other.toLowerCase() !== division.toLowerCase()){
                    included = false;
                }
                
            } else if (yoe!==null && yoe!=='' && Number(authContext.salaries[salary].experience_total)>=yoe){
                included = false;
            } else if (authContext.salaries[salary].title.trim().toLowerCase() === 'Intern'.toLowerCase()){
                included = false;
            }

            if (included === true && authContext.salaries[salary].title.toLowerCase()!=='Intern'){
                salaries.push(Number(authContext.salaries[salary]['annual_compensation']));
                allInfo.push(authContext.salaries[salary]);
                if (minTemp===0){
                    minTemp = Number(authContext.salaries[salary]['salary'])+Number(authContext.salaries[salary]['bonus']);
                } if (Number(authContext.salaries[salary].salary)+Number(authContext.salaries[salary].bonus) < minTemp){
                    minTemp = Number(authContext.salaries[salary].salary)+Number(authContext.salaries[salary].bonus)
                } else if (Number(authContext.salaries[salary].salary)+Number(authContext.salaries[salary].bonus) > maxTemp){
                    maxTemp = Number(authContext.salaries[salary].salary)+Number(authContext.salaries[salary].bonus)
                }

                countTemp += 1;
                totalTemp += Number(authContext.salaries[salary].salary)+Number(authContext.salaries[salary].bonus);
            } 

           
            

        })

        var sorted = sort(salaries, allInfo);
        console.log(sorted);
        var medianPackage = sorted[1][Math.floor(sorted[0].length/2)]
        var ninety = sorted[1][Math.floor(sorted[0].length*0.9)]
        var ten = sorted[1][Math.floor(sorted[0].length*0.1)]

    return (
        <div className = 'summary'>
            
        <div className = 'stats' onClick={()=>{}}>
            {/* <div className = 'stats-title'>Summary</div> */}

            {/* <div className = 'stats-min'>
                <div>
                    Min
                </div>
                <div>
                    {countTemp === 0 ? 'N/A' : currencyFormat(minTemp)}       
                </div>
                  
            </div> */}
            

            <div className = 'percentile-wrapper'>

            <h2 >10th Percentile Compensation</h2>

            <div className = 'ninety-percent' onClick={()=>{ tenPercentExpand ? setTenPercentExpand(false) : setTenPercentExpand(true)}}>
                <div className = 'stats-percentile-summary' style={{paddingBottom: '10px', borderRadius: '5px'}}>
                    {ten === undefined ? <div>N/A</div> : 

                    <div style={{fontSize: '1rem', }}>
                    <div className = 'undertext-title' style={{width: '100%', color: 'rgb(150, 150, 150)', marginLeft: '0px', fontSize: '0.9rem'}}>Annual Compensation</div>

                    {currencyFormat(Number(ten.annual_compensation).toFixed(0))} 
                    <div className = 'undertext-title' style={{width: '100%', color: 'rgb(150, 150, 150)',fontSize: '0.9rem', marginLeft: '0px'}}>{currencyFormat(Number(ten.salary).toFixed(0))} base | {currencyFormat(Number(ten.bonus).toFixed(0))} bonus</div>
                    
                    {Number(ten.signing_bonus) === 0 ? 
                    
                    <div style={{marginTop: '10px', fontSize: '1rem', color: 'transparent'}}>
                        <div className = 'undertext-title' style={{width: '100%', color: 'transparent', marginLeft: '0px', fontSize: '0.9rem'}}> Signing Bonus </div>
                         + {currencyFormat(Number(medianPackage.signing_bonus).toFixed(0))}
                    </div> :
                    <div style={{marginTop: '10px', fontSize: '1rem'}}>
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(150, 150, 150)', marginLeft: '0px', fontSize: '0.9rem'}}>Signing Bonus</div>
                        + {currencyFormat(Number(ten.signing_bonus).toFixed(0))}
                    </div>}
                    </div>}

                    <div className = 'undertext-title' style={{width: '100%', color: 'gray', marginLeft: '0px', marginTop: '0px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem'}}><BsChevronCompactDown/></div>      
                    
                </div>

                {tenPercentExpand ? 

                <div className = 'stats-percentile-summary' style={{paddingTop: '30px', background: 'rgba(255, 255, 255, 0.557)', borderTop: '0.5px solid rgb(150, 150, 150)', paddingBottom: '30px', color: 'rgb(80, 80, 80)'}}>
                    <div style={{textAlign: 'left', fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', marginLeft: '0px'}}>Company Name</div>

                    {ten.company_name}
                    </div>

                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', marginLeft: '0px'}}>Career</div>
                    
                    {ten.career_type}
                    </div>
                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', marginLeft: '0px'}}>Group</div>
                    
                    {ten.group}
                    </div>

                    <div style={{marginRight: '10px', marginBottom: '10px'}}>
                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Title</div>

                    {ten.title}
                    </div>

                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)',  fontWeight: 'normal', marginLeft: '0px'}}>YaC/YOE</div>
                    
                    {ten.experience_company}/{ten.experience_total}
                    </div>
                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)',  fontWeight: 'normal', marginLeft: '0px'}}>Location</div>
                    
                    {ten.location}
                    </div>
                    </div>

                    <div style={{width: '100%', height: '100%', padding: '2%', fontSize: '0.8rem', paddingTop: '30px', borderTop: '0.5px solid rgb(150, 150, 150)', display: 'flex', flexWrap: 'wrap', textAlign: 'left'}}>
                    {ten.academic_information === null ? null :
                        <div style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Academics</div>
                        {ten.academic_information}</div>}
                    {ten.gender === null ? null :
                      <div style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Gender</div>
                        {ten.gender}</div>}
                    {ten.race === null ? null :
                      <div  style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Race</div>
                        {ten.race}</div>}
                      <div  style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Date of Entry</div>
                        {new Date(ten.created_on.seconds*1000).toLocaleDateString()}</div>
                    

                </div>
                </div> : null}
            </div>
            </div>

            <div className = 'percentile-wrapper'>

            <h2 >Median Compensation Package</h2>

            <div className = 'ninety-percent' onClick={()=>{ medianExpand ? setMedianExpand(false) : setMedianExpand(true)}}>
                <div className = 'stats-percentile-summary' style={{paddingBottom: '10px', borderRadius: '5px'}}>
                    {medianPackage === undefined ? <div>N/A</div> : 

                    <div style={{fontSize: '1rem', }}>
                    <div className = 'undertext-title' style={{width: '100%', color: 'rgb(150, 150, 150)', marginLeft: '0px', fontSize: '0.9rem'}}>Annual Compensation</div>

                    {currencyFormat(Number(medianPackage.annual_compensation).toFixed(0))} 
                    <div className = 'undertext-title' style={{width: '100%', color: 'rgb(150, 150, 150)',fontSize: '0.9rem', marginLeft: '0px'}}>{currencyFormat(Number(medianPackage.salary).toFixed(0))} base | {currencyFormat(Number(medianPackage.bonus).toFixed(0))} bonus</div>
                    
                    {Number(medianPackage.signing_bonus) === 0 ? 
                    
                    <div style={{marginTop: '10px', fontSize: '1rem', color: 'transparent'}}>
                        <div className = 'undertext-title' style={{width: '100%', color: 'transparent', marginLeft: '0px', fontSize: '0.9rem'}}> Signing Bonus </div>
                         + {currencyFormat(Number(medianPackage.signing_bonus).toFixed(0))}
                    </div> :
                    <div style={{marginTop: '10px', fontSize: '1rem'}}>
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(150, 150, 150)', marginLeft: '0px', fontSize: '0.9rem'}}>Signing Bonus</div>
                        + {currencyFormat(Number(medianPackage.signing_bonus).toFixed(0))}
                    </div>}
                    </div>}

                   <div className = 'undertext-title' style={{width: '100%', color: 'gray', marginLeft: '0px', marginTop: '0px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem'}}><BsChevronCompactDown/></div>        

                    
                </div>

                {medianExpand ? 

                <div className = 'stats-percentile-summary' style={{paddingTop: '30px', background: 'rgba(255, 255, 255, 0.557)', borderTop: '0.5px solid rgb(150, 150, 150)', color: 'rgb(80, 80, 80)'}}>
                    <div style={{textAlign: 'left', fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', marginLeft: '0px'}}>Company Name</div>

                    {medianPackage.company_name}
                    </div>

                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', marginLeft: '0px'}}>Career</div>
                    
                    {medianPackage.career_type}
                    </div>
                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', marginLeft: '0px'}}>Group</div>
                    
                    {medianPackage.group}
                    </div>

                    <div style={{marginRight: '10px', marginBottom: '10px'}}>
                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Title</div>

                    {medianPackage.title}
                    </div>

                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)',  fontWeight: 'normal', marginLeft: '0px'}}>YaC/YOE</div>
                    
                    {medianPackage.experience_company}/{medianPackage.experience_total}
                    </div>
                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)',  fontWeight: 'normal', marginLeft: '0px'}}>Location</div>
                    
                    {medianPackage.location}
                    </div>
                    
                    
                  
                    
                    
                    </div>

                    <div style={{width: '100%', height: '100%', padding: '2%', fontSize: '0.8rem', paddingTop: '30px', borderTop: '0.5px solid rgb(150, 150, 150)', display: 'flex', flexWrap: 'wrap', textAlign: 'left'}}>
                    {medianPackage.academic_information === null ? null :
                        <div style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Academics</div>
                        {medianPackage.academic_information}</div>}
                    {medianPackage.gender === null ? null :
                      <div style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Gender</div>
                        {medianPackage.gender}</div>}
                    {medianPackage.race === null ? null :
                      <div  style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Race</div>
                        {medianPackage.race}</div>}
                      <div  style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Date of Entry</div>
                        {new Date(medianPackage.created_on.seconds*1000).toLocaleDateString()}</div>
                    

                </div>
                </div> : null}
            </div>
            </div>

            <div className = 'percentile-wrapper' onClick={()=>{ ninetyPercentExpand ? setNinetyPercentExpand(false) : setNinetyPercentExpand(true)}}>

                <h2 >90th Percentile Compensation</h2>

            <div className = 'ninety-percent'>
                <div className = 'stats-percentile-summary' style={{paddingBottom: '10px', borderRadius: '5px'}}>
                    {ninety === undefined ? <div>N/A</div> : 

                    <div style={{fontSize: '1rem', }}>
                    <div className = 'undertext-title' style={{width: '100%', color: 'rgb(150, 150, 150)', marginLeft: '0px', fontSize: '0.9rem'}}>Annual Compensation</div>

                    {currencyFormat(Number(ninety.annual_compensation).toFixed(0))} 
                    <div className = 'undertext-title' style={{width: '100%', color: 'rgb(150, 150, 150)',fontSize: '0.9rem', marginLeft: '0px'}}>{currencyFormat(Number(ninety.salary).toFixed(0))} base | {currencyFormat(Number(ninety.bonus).toFixed(0))} bonus</div>
                    
                    {Number(ninety.signing_bonus) === 0 ? 
                    
                    <div style={{marginTop: '10px', fontSize: '1rem', color: 'transparent'}}>
                        <div className = 'undertext-title' style={{width: '100%', color: 'transparent', marginLeft: '0px', fontSize: '0.9rem'}}> Signing Bonus </div>
                         + {currencyFormat(Number(ninety.signing_bonus).toFixed(0))}
                    </div> :
                    <div style={{marginTop: '10px', fontSize: '1rem'}}>
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(150, 150, 150)', marginLeft: '0px', fontSize: '0.9rem'}}>Signing Bonus</div>
                        + {currencyFormat(Number(ninety.signing_bonus).toFixed(0))}
                    </div>}
                    </div>}

                    <div className = 'undertext-title' style={{width: '100%', color: 'gray', marginLeft: '0px', marginTop: '0px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem'}}><BsChevronCompactDown/></div>           </div>

                {ninetyPercentExpand ? 
                <div className = 'stats-percentile-summary' style={{paddingTop: '30px', borderTop: '0.5px solid rgb(150, 150, 150)', background: 'rgba(255, 255, 255, 0.557)', color: 'rgb(80, 80, 80)'}}>
                    <div style={{textAlign: 'left', fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', marginLeft: '0px'}}>Company Name</div>

                    {ninety.company_name}
                    </div>

                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', marginLeft: '0px'}}>Career</div>
                    
                    {ninety.career_type}
                    </div>
                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', marginLeft: '0px'}}>Group</div>
                    
                    {ninety.group}
                    </div>

                    <div style={{marginRight: '10px', marginBottom: '10px'}}>
                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Title</div>

                    {ninety.title}
                    </div>

                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)',  fontWeight: 'normal', marginLeft: '0px'}}>YaC/YOE</div>
                    
                    {ninety.experience_company}/{ninety.experience_total}
                    </div>
                    <div style={{marginRight: '10px', marginBottom: '10px'}}>

                    <div className = 'undertext-title' style={{color: 'rgb(90, 90, 90)',  fontWeight: 'normal', marginLeft: '0px'}}>Location</div>
                    
                    {ninety.location}
                    </div>
                    
                    
                  
                    
                    
                    </div>

                    <div style={{width: '100%', height: '100%', padding: '2%', fontSize: '0.8rem', paddingTop: '30px', borderTop: '0.5px solid rgb(150, 150, 150)', display: 'flex', flexWrap: 'wrap', textAlign: 'left'}}>
                    {ninety.academic_information === null ? null :
                        <div style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Academics</div>
                        {ninety.academic_information}</div>}
                    {ninety.gender === null ? null :
                      <div style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Gender</div>
                        {ninety.gender}</div>}
                    {ninety.race === null ? null :
                      <div  style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Race</div>
                        {ninety.race}</div>}
                      <div  style={{marginRight: '10px', marginBottom: '10px'}}> 
                        <div className = 'undertext-title' style={{width: '100%', color: 'rgb(90, 90, 90)', fontWeight: 'normal', marginLeft: '0px'}}>Date of Entry</div>
                        {new Date(ninety.created_on.seconds*1000).toLocaleDateString()}</div>
                    

                </div>
                </div> : null}
            </div>
            </div>

           



            

        </div> 
        {/* {!authContext.userInfo ? <div  className = 'summary-undertext' style={{color: 'gray', textDecoration: 'none', textAlign: 'center'}}> <br/> <Link to='/sign-up' style={{color: 'gray', textDecoration: 'none', textAlign: 'center'}}>To view summary stats, please create an account. It's 100% free and helps increase the culture around salary transparency ></Link></div> : 
        authContext.userInfo && !authContext.userData.contribution ? <div className = 'summary-undertext'>Please contribute to one of the green forms below to access all features! It's 100% free, takes less than 45 seconds, and helps increase salary transparency for the finance community! </div> : */}
        {authContext.userInfo && authContext.userData.contribution ? <div className = 'summary-undertext'>Thank you for contributing. Please stay tuned as we continue to provide you with more data and better insights. <br/> - Please note internships are not included in summary calculations -</div> : <div className = 'summary-undertext'>- Please note internships are not included in summary calculations -</div>}
        {/* <div className = 'summary-undertext'>Internships are excluded from summary calculations. </div> */}

        </div>
    )
}

function Salaries(){
    const authContext = useContext(AuthContext);
    const [companyName, setCompanyName] = useState(null);
    const [title, setTitle] = useState(null);
    const [division, setDivision] = useState(authContext.careerFilter);
    const [yoe, setYoe] = useState(null);
    const [yoeObject, setYoeObject] = useState(null);
    const [titleObject, setTitleObject] = useState(null);
    const [divisionObject, setDivisionObject] = useState(authContext.careerFilter === null ? null : {id: 0, value: authContext.careerFilter, label: authContext.careerFilter});
    const [page, setPage] = useState(1);
    const [average, setAverage] = useState(0);
    const [open, setOpen] = useState(null);
    const [loggedIn, setLoggedIn] = useState(!!authContext.userInfo);

    var minTemp = 0;
    var maxTemp = 0;
    var totalTemp = 0;
    var countTemp = 0;
    var arr = [];

    var entries = 0;
    var numShown = 0;

    function currencyFormat(num) {
        return '$' + String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    const resetFilters = () =>{
        setTitle(null);
        setCompanyName('');
        setDivision(null);
        setYoe(null);
        setYoeObject(null);
        setTitleObject(null);
        setDivisionObject(null);
    }

    const filterJob = (job, i, n) =>{
        var included = true
        if (job.live === false){
            included = false;
        } else if (companyName!==null && companyName!== '' && !job.company_name.toLowerCase().includes(companyName.toLowerCase())){
            included = false;
        } else if (title!==null && title!== '' && job.title.toLowerCase() !== title.toLowerCase()){
            included = false;
        } else if (division!==null && division!=='' && job.career_type.toLowerCase() !== division.toLowerCase()){
            if (job.career_type_other === null || job.career_type_other.toLowerCase() !== division.toLowerCase()){
                included = false;
            }
        } if (yoe!==null && yoe!=='' && Number(job.experience_total)>=yoe){
            included = false;
        }

        return included;

    }

    const [years, setYears] = useState([
        {id: 0, value:  null, label: 'No Filter'},
        {id: 0, value:  1, label: '< 1'},
        {id: 1, value:  2, label: '< 2'},
        {id: 2, value:  3, label: '< 3'},
        {id: 3, value:  4, label: '< 4'},
        {id: 4, value:  5, label: '< 5'},
        {id: 5, value:  6, label: '< 6'},
        {id: 6, value:  7, label: '< 7'},
        {id: 7, value:  8, label: '< 8'},
        {id: 8, value:  9, label: '< 9'},
        {id: 9, value:  10, label: '< 10'},
        {id: 9, value:  20, label: '< 20'},
        {id: 9, value:  30, label: '< 30'},
    ]);

    const [titles, setTitles] = useState([
        {id: 0, value:  null, label: 'No Filter'},
        {id: 12, value:  'Intern', label: 'Intern'},
        {id: 0, value:  'Analyst', label: 'Analyst'},
        {id: 1, value:  'Senior Analyst', label: 'Senior Analyst'},
        {id: 2, value:  'Associate', label: 'Associate'},
        {id: 9, value:  'Associate Vice President', label: 'Associate Vice President'},
        {id: 4, value:  'Manager', label: 'Manager'},
        {id: 4, value:  'Senior Manager', label: 'Senior Manager'},
        {id: 4, value:  'Vice President', label: 'Vice President'},
        {id: 8, value:  'Senior Vice President', label: 'Senior Vice President'},
        {id: 10, value:  'Associate Director', label: 'Associate Director'},
        {id: 3, value:  'Director', label: 'Director'},
        {id: 11, value:  'Executive Director', label: 'Executive Director'},
        {id: 5, value:  'Managing Director', label: 'Managing Director'},
        {id: 6, value:  'Partner', label: 'Partner'},
        {id: 7, value:  'Portfolio Manager', label: 'Portfolio Manager'},
        {id: 13, value:  'Other', label: 'Other'},
    ]);

    const notSignedIn = [
        {id: 0, value:  null, label: 'Please sign in and contribute to filter'},
    ];

    const [divisions, setDivisions] = useState([
        {id: 0, value:  null, label: 'No Filter'},
        {id: 0, value:  'Investment Banking', label: 'Investment Banking'},
        {id: 0, value:  'Private Equity', label: 'Private Equity'},
        {id: 0, value:  'Sales and Trading - Sales', label: 'Sales and Trading - Sales'},
        {id: 0, value:  'Sales and Trading - Trading', label: 'Sales and Trading - Trading'},
        {id: 0, value:  'Proprietary Trading', label: 'Proprietary Trading'},
        {id: 0, value:  'Quant Trading', label: 'Quant Trading'},
        {id: 0, value:  'Quantitative Research', label: 'Quantitative Research'},
        {id: 0, value:  'Corporate Banking', label: 'Corporate Banking'},
        {id: 0, value:  'Equity Research', label: 'Equity Research'},
        {id: 0, value:  'Accounting', label: 'Accounting'},
        {id: 0, value:  'Investment Analyst', label: 'Investment Analyst'},
        {id: 0, value:  'Management Consulting', label: 'Management Consulting'},
        {id: 0, value:  'Hedge Fund', label: 'Hedge Fund'},
        {id: 0, value:  'Venture Capital', label: 'Venture Capital'},
        {id: 0, value:  'Private Banking', label: 'Private Banking'},
        {id: 0, value:  'Asset Management', label: 'Asset Management'},
        {id: 0, value:  'Operations', label: 'Operations'},
        {id: 0, value:  'FP&A', label: 'FP&A'},
        {id: 0, value:  'Other', label: 'Other'},
    ])
    const customStyles = {
        control: (provided, state) => ({
        ...provided,
        background: 'white',
        borderColor: '#9e9e9e',
        display: 'flex',
        flexWrap: 'wrap',
        color: 'black',
        boxShadow: state.isFocused ? null : null,
        zIndex: 0
        }),

        option: (provided, state) => ({
            ...provided,
            background: state.isSelected ? 'rgb(56, 112, 154)' : 'transparent',
            background: state.isFocused ? 'lightGray' : 'transparent',
            color: 'black',
            zIndex: 0,
            textTransform: 'capitalize'
        }),

        multiValue: (provided, state) => ({
            ...provided,
            float: 'left',
            background: 'gray',
            color: 'black',
            zIndex: 0,
        }),

        valueContainer: (provided, state) => ({
        ...provided,
        padding: '2px 2px',
        float: 'left',
        display: 'flex',
        flexWrap: 'wrap',
        color: 'black',
        zIndex: 0,
        textTransform: 'capitalize'
        }),



        

        input: (provided, state) => ({
        ...provided,
        margin: '0px',
        color: 'black'
        }),
        indicatorSeparator: state => ({
        display: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
        ...provided,
        height: '28px',
        }),
    };

    useEffect(async () => {
        console.log(authContext.userInfo)
        setLoggedIn(!!authContext.userInfo)
        autocomplete(document.getElementById("company-filter"), authContext.companies, setCompanyName)
        // document.addEventListener("wheel", function(event){
        //     if(document.activeElement.type === "number"){
        //         document.activeElement.blur();
        //     }
        // });
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

    return(
        <div className = 'content'>
            <Header/>
            
            <div className = 'under-header'>
                <SalaryNav/>

                <h1 style={{width: '100%', textAlign: 'center'}}>Salary and Compensation Insights for Finance</h1>
                <Stats companyName={companyName} title={title} division={division} yoe={yoe}/>

                <div className = 'filters'>
                    <div className = 'salary-info-2'>
                        {/* <div className = 'dropdown-container'>
                            <div for="contract" className = 'dropdown-label-jobs'>Company Name:</div>
                                <div class="autocomplete" >
                                        <input id="company-filter" className = 'input-filter' type="text" name="myCompany" value = {companyName} onChange={(e)=>{setCompanyName(e.target.value)}} placeholder="Company"/>
                                    
                                </div> 
                            </div> */}
                        
                        {authContext.userInfo && authContext.userData.contribution?
                        <div className = 'dropdown-container'>
                            <div for="contract" className = 'dropdown-label-jobs'>Title:</div>
                                <Select
                                    value={titleObject} 
                                    className = 'select-dropdown-jobs' 
                                    onChange={(e)=>{setTitleObject(e); setTitle(e.value); authContext.setTitleFilter(e.value)}}
                                    options={titles}
                                    styles={customStyles}
                                    isMulti={false}
                                />
                            </div> : <div className = 'dropdown-container'>
                            <div for="contract" className = 'dropdown-label-jobs'>Title:</div>
                                <Select
                                    value={null} 
                                    className = 'select-dropdown-jobs' 
                                    options={notSignedIn}
                                    styles={customStyles}
                                    isMulti={false}
                                />
                        </div >}
                        
                        <div className = 'dropdown-container'>
                            <div for="contract" className = 'dropdown-label-jobs'>Division:</div>
                                <Select
                                    value={divisionObject} 
                                    className = 'select-dropdown-jobs' 
                                    onChange={(e)=>{setDivisionObject(e); setDivision(e.value); authContext.setCareerFilter(e.value)}}
                                    options={divisions}
                                    styles={customStyles}
                                    isMulti={false}
                                />
                        </div>
                        {authContext.userInfo && authContext.userData.contribution?
                        <div className = 'dropdown-container'>
                            <div for="contract" className = 'dropdown-label-jobs'>Years of Experience (YOE):</div>
                                <Select
                                    value={yoeObject} 
                                    className = 'select-dropdown-jobs' 
                                    onChange={(e)=>{setYoeObject(e); setYoe(e.value); authContext.setYoeFilter(e.value)}}
                                    options={years}
                                    styles={customStyles}
                                    isMulti={false}
                                />
                        </div > :  <div className = 'dropdown-container'>
                            <div for="contract" className = 'dropdown-label-jobs'>Years of Experience (YOE):</div>
                                <Select
                                    value={null} 
                                    className = 'select-dropdown-jobs' 
                                    options={notSignedIn}
                                    styles={customStyles}
                                    isMulti={false}
                                />
                        </div >}
                        
                    
                    <div className = 'reset' onClick={()=>{resetFilters()}}>Reset Filters</div>
                    </div>



                        {/* <div className = 'info-container-title'>
                            <div className="autocomplete-salaries" >
                                <input id="company1" className = 'input-salaries' value = {companyName} onChange={(e)=>{setCompanyName(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setCompanyName(e.target.value)}}  type="text" name="myCompany" placeholder="Company"/>
                                <br/>
                            </div> 
                        </div>

                        <div className = 'info-container-title'>
                            <div className="autocomplete-salaries" >
                                <input id="company1" className = 'input-salaries' value = {title} onChange={(e)=>{setTitle(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setTitle(e.target.value)}}  type="text" name="myCompany" placeholder="Title"/>
                                <br/>
                            </div> 
                        </div>

                        <div className = 'info-container-title'>
                            <div className="autocomplete-salaries" >
                                <input id="company1" className = 'input-salaries' value = {division} onChange={(e)=>{setDivision(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setDivision(e.target.value)}}  type="text" name="myCompany" placeholder="Division"/>
                                <br/>
                            </div> 
                        </div>

                        <div className = 'experience-container-title'>
                            <div className="autocomplete-salaries" >
                                <input id="company1" className = 'input-salaries' value = {yoe} onChange={(e)=>{setYoe(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setYoe(e.target.value)}}  type="number" name="myCompany" placeholder="YOE"/>
                                <br/>
                            </div> 
                        </div> */}
                </div>

                

                    <div style={{width: '100%', textAlign: 'center', marginTop: '0px'}}>- tap entry to view more information -</div>



                    <div className = 'salary-info-1'>
                        <div className = 'info-container-title'>
                            {/* <div className="autocomplete-salaries" >
                                <input id="company1" className = 'input-salaries' value = {companyName} onChange={(e)=>{setCompanyName(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setCompanyName(e.target.value)}}  type="text" name="myCompany" placeholder="Company"/>
                                <br/>
                            </div>  */}
                            <div className = 'autocomplete-salaries-1'>
                               Company
                            </div>

                        <div className = 'undertext-title'>Location</div>
                        </div>

                        <div className = 'info-container-title'>
                            {/* <div className="autocomplete-salaries" >
                                <input id="company1" className = 'input-salaries' value = {companyName} onChange={(e)=>{setDivision(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setDivision(e.target.value)}}  type="text" name="myCompany" placeholder="Division"/>
                                <br/>
                            </div>  */}
                            <div className = 'autocomplete-salaries-1'>
                                Division
                            </div>

                        <div className = 'undertext-title'>Group</div>
                        </div>

                        <div className = 'experience-container-title'>
                            {/* <div className="autocomplete-salaries" >
                                <input id="company1" className = 'input-salaries' value = {companyName} onChange={(e)=>{setTitle(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setTitle(e.target.value)}}  type="text" name="myCompany" placeholder="Title"/>
                                <br/>
                            </div> 
 */}                    
                            <div className = 'autocomplete-salaries-1'>
                                Title
                            </div>

                        <div className = 'undertext-title'>i.e. Director</div>
                        </div>


                        <div className = 'experience-container-title'>
                            {/* <div className="autocomplete-salaries" >
                                <input id="company1" className = 'input-salaries' value = {companyName} onChange={(e)=>{setYoe(e.target.value)}} onSubmit={(e)=>{e.preventDefault(); setYoe(e.target.value)}}  type="number" name="myCompany" placeholder="YOE"/>
                                <br/>
                            </div>  */}
                            <div className = 'autocomplete-salaries-1'>
                                YOE
                            </div>
                            <div className = 'undertext-title'> Company / Total </div>
                        </div>

                        <div className = 'info-container-title'>
                            <div className = 'autocomplete-salaries-1'>
                                Total Compensation
                            </div>
                        <div className = 'undertext-title'>Salary | Bonus</div>
                        </div>
            </div>

            <div className = 'salaries-box' >
            {authContext.blur && authContext.salariesArr.length > 0 ? <div className = 'blur-effect'>
                <Link to='/sign-up' className = 'signup-link'>Please sign up and upload compensation to access all data ></Link>
                <div style={{fontSize: '0.9rem', fontStyle: 'italic', marginTop: '10px'}}>You'll still be able to view salary information without it, but contributing helps increase salary transparency, and helps the community make better career decisions. </div>
                <div style={{fontSize: '0.9rem', marginTop: '10px'}} className = 'proceed-without-blur' onClick={()=>{authContext.setBlur(false)}}>No thanks, proceed to salaries ></div>
            </div> : null}
            <div className = {authContext.blur ? 'salaries-box-inner-blur' :'salaries-box-inner'}>
            {authContext.salariesArr.map((salary, i)=>{
                if (filterJob(authContext.salaries[salary], i, authContext.salariesArr.length)===true){
                    entries+=1;
                    if (numShown < page*10){
                        numShown+=1;
                        return (
                            <div className = 'salary-info' onClick={()=>{if (!authContext.blur && open===i){setOpen(null)} else if (!authContext.blur){setOpen(i)}}} style={entries%2===0 ? {backgroundColor: 'rgb(240, 240, 240)'} : {backgroundColor: 'transparent'}}>
                                <div className = 'info-container'>
                                <div>{authContext.salaries[salary]['company_name']}</div>
                                <div className = 'undertext'>{authContext.salaries[salary]['location']}</div>
                                </div>

                                <div className = 'info-container'>
                                <div> {authContext.salaries[salary]['career_type'].trim() ==='Other' ? authContext.salaries[salary]['career_type_other'] : authContext.salaries[salary]['career_type']} </div>
                                <div className = 'undertext'> {authContext.salaries[salary]['group'].trim() ==='Other' ? '- ' + authContext.salaries[salary]['group_other'] : authContext.salaries[salary]['group']}</div>
                                </div>
                                {authContext.userInfo && authContext.userData.contribution ? 
                                <div className = 'experience-container'>
                                <div>{authContext.salaries[salary]['title'].trim() === 'Other' ? authContext.salaries[salary]['title_other'] : authContext.salaries[salary]['title']}</div>
                                </div> : authContext.userInfo ?
                                <Link to = '/salary-form' className = 'experience-container-blur'>
                                    <div className = 'inner-text'>{authContext.salaries[salary]['experience_company']}/{authContext.salaries[salary]['experience_total']}</div>
                                </Link> :
                                <Link to = '/sign-up' className = 'experience-container-blur'>
                                    <div className = 'inner-text'>{authContext.salaries[salary]['experience_company']}/{authContext.salaries[salary]['experience_total']}</div>
                                </Link>}

                                {authContext.userInfo && authContext.userData.contribution ? 
                                <div className = 'experience-container'>
                                <div className = 'inner-text'>{authContext.salaries[salary]['experience_company']}/{authContext.salaries[salary]['experience_total']}</div>
                                </div> : authContext.userInfo ?
                                <Link to = '/salary-form' className = 'experience-container-blur'>
                                <div className = 'inner-text'>{authContext.salaries[salary]['experience_company']}/{authContext.salaries[salary]['experience_total']}</div>
                                </Link>:
                                <Link to = '/sign-up' className = 'experience-container-blur'>
                                <div className = 'inner-text'>{authContext.salaries[salary]['experience_company']}/{authContext.salaries[salary]['experience_total']}</div>
                                </Link>}

                                <div className = 'info-container'>
                                <div> <div className = 'total'>{currencyFormat(Number(authContext.salaries[salary]['salary']) + Number(authContext.salaries[salary]['bonus']))} </div> <div className = 'signing'>{Number(authContext.salaries[salary]['signing_bonus']) === 0 ? '' : `+ ${currencyFormat(Number(authContext.salaries[salary]['signing_bonus']))} signing`}</div></div>

                                <div className = 'undertext'>{currencyFormat(Number(authContext.salaries[salary]['salary']))} | {currencyFormat(Number(authContext.salaries[salary]['bonus']))}</div>
                                
                                </div>

                                {open===i ? 
                                <div className = 'additional-info'>
                                    <div className = 'additional-info-date'>
                                        
                                    </div>
                                    <div className = 'additional-info-inner'>
                                            <div className = 'info-inner'>
                                                {authContext.salaries[salary]['academic_information'] !==null ? `Academics: ${authContext.salaries[salary]['academic_information']}` : null} {`     `}
                                                {authContext.salaries[salary]['gender'] !==null ? `Gender: ${authContext.salaries[salary]['gender']}` : null} {`     `}
                                                {authContext.salaries[salary]['race'] !==null ? `Race: ${authContext.salaries[salary]['race']}` : null} {`     `}
                                                
                                                {authContext.salaries[salary]['other_details'] !==null ? <div> <br/> <br/>Additional Comments: {authContext.salaries[salary]['other_details']} </div>: null}
                                            </div>
                                        <div className = 'intern-description'>
                                                Date of Entry: {new Date(authContext.salaries[salary]['created_on']['seconds']*1000).toLocaleDateString()} <br/><br/>
                                        </div>
                                        
                                        {authContext.salaries[salary]['title'].toLowerCase().trim() === 'intern' ? 
                                        <div className = 'intern-description'>Internships may not be reported as an annualized number. Please use your descretion when interpreting intern compensation. </div> : null}

                                    </div>
                                    
                                </div> 
                                : null}


                            </div>
                        )  
                    }

                    
                                  
                }
                
            })}</div>
            

            </div>
            {authContext.userInfo && authContext.userData.contribution ? null :
            <div style={{width: '100%', textAlign: 'center', marginTop: '20px'}}>- Please sign in and contribute to view all details -</div>}


            {entries>numShown ? 
                            <div className = 'see-more' onClick={()=>{setPage(page+1)}}>
                                See More
                            </div>
                        : entries === 0 ? <div className = 'no-results'>Sorry, no entries match your filter criteria. Adjust your filters to see more results. </div> : 
                        numShown <= 10 ? <div className = 'no-results'> You've reached the end of your search. </div>  :
                        <div className = 'hide' onClick={()=>{setPage(1)}}>
                                Hide
                            </div>}

             <div className = 'bottom-spacer'></div>

            <div className = 'buttons-container'>

                <Link to='/salary-form' className = 'enter-salary-1'>+ Add Compensation</Link>
                <Link to='/titlesform' className = 'enter-salary'>+ Add Promotion Timeline</Link>
                <Link to='/ops-form' className = 'enter-salary'>+ Add Break In/Exit Op</Link>

                </div>
                    
            </div>

           

        </div>
    )
}



export default Salaries;