import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import {Firebase, db} from '../../config/firebase';
import AuthContext from '../../context/Context';
import {AiOutlineSearch} from 'react-icons/ai'
import {useLocation, withRouter, useHistory} from 'react-router-dom';
import {BsCheckLg} from 'react-icons/bs'
import {GiReceiveMoney, GiCash} from 'react-icons/gi'
import {BsCoin} from 'react-icons/bs'
import {AuthenticatedUserContext} from '../pages/AuthenticatedUserProvider'
import {AiOutlineLogout} from 'react-icons/ai'
import {AiOutlineIdcard} from 'react-icons/ai'
import {RiLogoutCircleRLine} from 'react-icons/ri'

const auth = Firebase.auth();

export default function SalaryNav() {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    var index = 0;
    var url = window.location.href.split("/");
    if (url[url.length-1]==="salaries"){
        index = 0;
    } else{
        index = Number(url[url.length-1])
    }
    const tabs = ['All', 'IB', 'ST - T', 'ST - S', 'MC', 'Quant Trading', 'Quant Research', 'Acc', 'CB', 'ER', 'PE', 'FP&A']
    const titles = ['All', 'Investment Banking', 'Sales and Trading-Trading', 'Sales and Trading-Sales', 'Management Consulting', 'Quantitative Trading', 'Quantitative Research', 'Accounting', 'Corporate Banking', 'Equity Research', 
    'Private Equity', 'Financial Planning and Analysis']
    
    var roles=['All', 'Investment Banking', 'Sales and Trading - Trading', 'Sales and Trading - Sales', 'Management Consulting', 'Quant trading', 'Quantitative Research', 'Accounting', 'Corporate Banking', 'Equity Research', 
    'Private Equity', 'FP&A']

    useEffect(async () => {
   
         if (index===0){
        } else{
            authContext.setCareerFilter(roles[index]);
        }
    }, [])

    

    const handleClick = (i) =>{
        if (i===0){
            window.location.href=`#/salaries`;
            authContext.setCareerFilter(null);
        } else{
            window.location.href=`#/salaries/${titles[i].split(" ").join("-")}/${i}`
            authContext.setCareerFilter(roles[i]);
            console.log(roles[i])
        }
        
    }

    return (
      <div className = 'salary-tabs-wrapper'>
        <div className = "salary-tabs">
            {tabs.map((tab, i)=>{
                return (
                    <div className = 'salary-tab' onClick={()=>{handleClick(i)}} title = {titles[i]} style={i === 0 ? {border: 'none'} : {}} style={index===i ? {background: 'white', color: 'gray'} : {}}> {tab} </div>
                )
            })}

            
            </div>
    </div>

  );
}

