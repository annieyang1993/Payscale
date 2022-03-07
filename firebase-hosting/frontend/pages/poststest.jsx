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
import Select from 'react-select'
import {Link} from 'react-router-dom'
import Entry from './entryopsform'
import {Markup} from 'interweave'

import {BiSupport} from 'react-icons/bi'
//import {Firebase, db} from '../config/firebase';
require('react-dom');


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
    let width = window.innerWidth;

    

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

    if (width>900){
    return(
        <div className = 'content'>
            <Header/>
            <div className = 'under-header' style={{color: 'rgb(90, 90, 90)'}}>

                <div className = 'posts-left'>
                    {authContext.postsArr.map((post, i)=>{
                        if (i%2 === 0 ){
                            return(
                            <Link className = 'post-link' style={i%2 === 0 ? {marginRight: '9%'} : {}} to={`/posts/${authContext.posts[post].title.toLowerCase().split(' ').join('-')}`}>
                            <img style={{width: '100%'}} src={authContext.posts[post].img}/>
                            <h1 style={{textAlign: 'center', width: '100%'}} className = 'posts-title'>{authContext.posts[post].title}</h1>
                            <div style={{textAlign: 'center', width: '100%', color: 'gray', marginBottom: '20px;'}}>{authContext.posts[post].description}</div>
                            {/* <Markup content={authContext.posts[post].post}/> */}
                            <br/><br/><br/>
                            <div style={{textAlign: 'center', width: '100%', color: 'gray', marginBottom: '20px', marginTop: '30px'}}>{new Date(authContext.posts[post].created_on.seconds*1000).toLocaleDateString()}</div>
                            </Link>)
                        }
                            
                    })}
                </div>
                <div className = 'posts-right'>
                    {authContext.postsArr.map((post, i)=>{
                        if (i%2 === 1 ){
                            return(
                            <Link className = 'post-link' style={i%2 === 0 ? {marginRight: '9%'} : {}} to={`/posts/${authContext.posts[post].title.toLowerCase().split(' ').join('-')}`}>
                            <img style={{width: '100%'}} src={authContext.posts[post].img}/>
                            <h1 style={{textAlign: 'center', width: '100%'}} className = 'posts-title'>{authContext.posts[post].title}</h1>
                            <div style={{textAlign: 'center', width: '100%', color: 'gray', marginBottom: '20px;'}}>{authContext.posts[post].description}</div>
                            {/* <Markup content={authContext.posts[post].post}/> */}
                            <br/><br/><br/>
                            <div style={{textAlign: 'center', width: '100%', color: 'gray', marginBottom: '20px', marginTop: '30px'}}>{new Date(authContext.posts[post].created_on.seconds*1000).toLocaleDateString()}</div>
                            </Link>)
                        }
                            
                    })}
                </div>
                
            </div>
            <div className = 'bottom-spacer'></div>

           

        </div>
    )
    } else{
    return(
        <div className = 'content'>
            <Header/>
            <div className = 'under-header' style={{color: 'rgb(90, 90, 90)'}}>

                <div className = 'posts-inner'>
                    {authContext.postsArr.map((post, i)=>{
                            return(
                            <Link className = 'post-link' style={{marginRight: '0%', marginLeft: '0%', marginBottom: '50px'}} to={`/posts/${authContext.posts[post].title.toLowerCase().split(' ').join('-')}`}>
                            <img style={{width: '100%'}} src={authContext.posts[post].img}/>
                            <h1 style={{textAlign: 'center', width: '100%'}} className = 'posts-title'>{authContext.posts[post].title}</h1>
                            <div style={{textAlign: 'center', width: '100%', color: 'gray', marginBottom: '20px;'}}>{authContext.posts[post].description}</div>
                            {/* <Markup content={authContext.posts[post].post}/> */}
                            <br/><br/><br/>
                            <div style={{textAlign: 'center', width: '100%', color: 'gray', marginBottom: '20px', marginTop: '30px'}}>{new Date(authContext.posts[post].created_on.seconds*1000).toLocaleDateString()}</div>
                            </Link>)
                    })}
                </div>
                
            </div>
            <div className = 'bottom-spacer'></div>

           

        </div>
    )
    }

}



export default Salaries;