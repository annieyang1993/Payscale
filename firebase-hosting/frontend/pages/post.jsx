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
import {FaBookReader} from 'react-icons/fa'

import {BiSupport} from 'react-icons/bi'
//import {Firebase, db} from '../config/firebase';
require('react-dom');


function Post(){
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


    useEffect(async () => {
        if (authContext.currentPostSet === false){
            var url = window.location.href;
            var id = url.split('?id=')[1]
            var post = await Firebase.firestore().collection('posts').doc(id).get();
            authContext.setCurrentPost(post.data());
            authContext.setCurrentPostSet(true);
        }
        // if (authContext.)
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


    return(
        <div className = 'content'>
            <Header/>
            <div className = 'under-header' style={{color: 'rgb(90, 90, 90)'}}>
                {authContext.currentPostSet ? 
                    <div className = 'blog-post-wrapper'>
                    <h1 style={{textAlign: 'center'}}>{authContext.currentPost.title}</h1>
                    <div style={{width: '100%', textAlign: 'center', color: 'gray', marginBottom: '30px', alignSelf: 'center', alignContent: 'center'}}>{new Date(authContext.currentPost.created_on.seconds*1000).toLocaleDateString()} <FaBookReader style={{marginLeft: '20px', marginRight: '5px'}}/> {authContext.currentPost.read_time} min read</div>
                    <Markup content={authContext.currentPost.post}/>
                    <br/><br/><br/>
                
                
                    </div> : null}
                </div>
            <div className = 'bottom-spacer'></div>

           

        </div>
    )
}



export default Post;