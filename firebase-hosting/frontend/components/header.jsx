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

export default function Header() {
    const authContext = useContext(AuthContext);
     const { user, setUser, loggedIn, setLoggedIn } = useContext(AuthenticatedUserContext);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [subscribeError, setSubscribeError] = useState(false);
    const [loading, setLoading] = useState(false);
    const  history = useHistory();
    const location = useLocation();

    const handleSubscribe = async ()=>{
        if (subscribed === false){
            setLoading(true);
            if (email.includes('@')===false || email.includes('.')===false){
              setSubscribeError(true);
              setLoading(false);
            } else{
              setSubscribeError(false);
              var newSubscription = new Object();
              newSubscription[email] = true;
              const data = await Firebase.firestore().collection('emails').doc('emails').set(newSubscription, {merge: true})
              await new Promise((resolve)=>setTimeout(resolve, 300));
              setLoading(false);
              setSubscribed(true);
            }
            
            // var emailsArray = emails.emails;
            // emailsArray.push(email);

        }
    }

    useEffect(()=>{
        
    }, [])
    return (
      <div className = 'header-wrapper'>
        <div className = "header">
            {console.log(window.location.href.split("/"))}

            <Link  to="/" className = 'logo-wrap' >
                Payscale <GiReceiveMoney/>
            </Link>
        
        


        {/* <div className = "home">
                {/* <div className = "home-content">
                    Web3Careers
                </div> */}
                {/* <div className = 'description-jobs'> <div className = 'web3'>WEB3CAREERS</div> <div className = 'web3-description'>: build the future of the decentralized internet. </div></div> */}
                {/* <div className = 'search-input'>
                    <AiOutlineSearch className = 'search-icon' color='gray'/>
                        <input type="search" value = {authContext.search} placeholder = 'Search jobs' onChange = {(e)=>{authContext.setSearch(e.target.value)}} onKeyPress = {async (e)=>{
                            if (e.key === 'Enter') {
                            authContext.setFilteringBool(true); 
                            if (location.pathname!=='/jobs' && location.pathname!=='/jobdetails'){
                                history.push('/jobs');
                            }
                            await new Promise((resolve)=> setTimeout(resolve, 300)); 
                            authContext.setPage(1); 
                            authContext.setSearchFinal(e.target.value); 
                            e.preventDefault();
                            authContext.setFilteringBool(false)}}} className = 'search-input-inner'/>
                </div>

                <div className = 'newsletter-header-input'>
                    <form>
                        <input type="email" value = {email} placeholder = 'Enter email' onChange = {(e)=>{setEmail(e.target.value)}} className = 'newsletter-input-inner'/>
                    </form>
                    <div className = 'subscribe-newsletter' onClick={()=>{handleSubscribe()}}> {subscribed ? <div>Subscribed</div>: loading ? <div>Loading...</div> : <div>Subscribe</div>}</div>
                </div>
                </div> */} 


                
            

        <div className = "tabs">
                {/* <div className = "tab">
                        <Link to="/paths" className = "tab-content">Titles </Link>              
                </div> */}
                {/* <div className = "tab" style={{marginTop: '-5px', fontSize: '0.8rem'}}>
                        <Link to="/support-payscale" className = "tab-content" >Support <br/> Payscale <GiReceiveMoney/></Link>              
                </div> */}

                {authContext.userInfo && authContext.uid === 'TBkwqkVfyyWuLkU7SOH4lmQqyTj1' ? 
                <div className = "tab">
                        <Link to="/upload" className = "tab-content">Post </Link>              
                </div>
                : null}

                {/* {authContext.userInfo && authContext.uid === 'TBkwqkVfyyWuLkU7SOH4lmQqyTj1' ? 
                <div className = "tab">
                        <Link to="/poststest" className = "tab-content">Blog test </Link>              
                </div>
                : null} */}
                
                <div className = "tab">
                        <Link to="/posts" className = "tab-content">Blog </Link>              
                </div>

                <div className = "tab">
                        <Link to="/" className = "tab-content">Salaries </Link>              
                </div>

                {authContext.userInfo ? <div className = 'tab-name'><div className = 'tab-content'>Welcome, {authContext.userData.firstname}!</div></div> : 
                        null
                }


                {authContext.userInfo ? null : <div className = "tab" >
                        <Link to="/sign-in" className = "tab-content" > Sign in</Link>  
                </div>}

                {authContext.userInfo ? <div className = 'tab-exit' onClick={()=>{auth.signOut(); authContext.setUserData({})}}> <RiLogoutCircleRLine className = 'tab-content'/></div> : null}

                

               {!authContext.userInfo ?  <div className = "tab-signup" >
                        <Link to="/sign-up" className = "tab-content-signup" > Sign Up </Link>              
                </div> : null}
            </div> 
            </div>
    </div>

  );
}

