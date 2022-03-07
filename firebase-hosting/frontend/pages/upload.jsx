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


function Upload(){
    const authContext = useContext(AuthContext);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [post, setPost] = useState(null);
    const [img, setImg] = useState(null);
    const [secondTitle, setSecondTitle] = useState(null);
 

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

    const resizeFile = (file) =>
                    new Promise((resolve) => {
                        Resizer.imageFileResizer(file, 300, 300, 'PNG', 100, 0, (uri) => {
                        resolve(uri);
                        });
                    });

    const handleSubmit = async (e) => {
        e.preventDefault();
                const uri = await resizeFile(img);
                const thumbRef = Firebase.storage().ref(`images/${title.split(' ').join('-')}`);
                const thumbSnapshot = Firebase.storage().ref(`images/${title.split(' ').join('-')}`).putString(uri, 'data_url');
                //const thumbUrl = await getDownloadURL(thumbSnapshot.ref);
                thumbSnapshot.on('state_changed', 
                    (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    }, (err) => {
                        // setFirebaseError(true);
                        // setLoadingIndicator(false);
                    }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                        Firebase.storage().ref('images').child(title.split(' ').join('-')).getDownloadURL().then(async (urlTemp)=>{
                        var url = urlTemp;
                        await Firebase.firestore().collection('posts').doc().set({
                            title: title,
                            second_title: secondTitle,
                            description: description,
                            post: post,
                            img: url,
                            live: false,
                            created_on: new Date()
                        })
                    })
                    })
                
            }
    


    return(
        <div className = 'content'>
            <Header/>
            <form className = 'form' onSubmit={(e)=>handleSubmit(e)}>
                <div class="autocomplete" >
                    <label for='company' className='label'>Title</label><br/>
                    <input id="company" className = 'input' type="text" name="myCompany" value = {title} onChange={(e)=>{setTitle(e.target.value)}} placeholder="Title"/>
                     <br/>
                </div> <br/>

                <div class="autocomplete" >
                    <label for='company' className='label'>Subtitle</label><br/>
                    <input id="company" className = 'input' type="text" name="myCompany" value = {secondTitle} onChange={(e)=>{setSecondTitle(e.target.value)}} placeholder="Second Title"/>
                     <br/>
                </div> <br/>

                <div class="autocomplete" >
                    <label for='company' className='label'>Description</label><br/>
                    <textarea id="company" className = 'input' type="text" style={{height: '150px'}} name="myCompany" value = {description} onChange={(e)=>{setDescription(e.target.value)}} placeholder="Please enter description (no tags)"/>
                     <br/>
                </div> <br/>

                <div class="autocomplete" >
                <label for='company' className='label'>Image</label><br/>
                <div role="paper-clip" aria-label="paper-clip" className="paper-clip" width="100">📎</div>
                    {img && (
                        <div className = 'logo-info'>
                        {/* <img alt="not found" width={"250px"} src={URL.createObjectURL(img)} /> */}
                            <div className = 'logo-name'> 
                            
                            {img['name']}
                                 
                            </div>
                            
                        </div>
                    )}
                    <label for="files" className = 'upload'>Upload Image</label>
                    <input
                    type="file"
                    id = 'files'
                    name="myImage"
                    style={{visibility: 'hidden'}}
                    onChange={(event) => {
                    setImg(imageFile => (event.target.files[0]));
                    }}
                    />
                </div>

                <div class="autocomplete" >
                    <label for='company' className='label'>Post</label><br/>
                    <textarea id="company" className = 'input' type="text" style={{height: '500px'}} name="myCompany" value = {post} onChange={(e)=>{setPost(e.target.value)}} placeholder="Please enter post (with tags)"/>
                     <br/>
                </div> <br/>

                <input type='submit'/>
                
            </form>
            {/* <Header/>
            <div className = 'under-header' style={{color: 'rgb(90, 90, 90)'}}>
                {console.log(authContext.postsArr)}
                {console.log(authContext.posts)}
                {authContext.postsArr.map((post, i)=>{
                    return(
                    <div>
                    <h1 style={{textAlign: 'center'}}>{authContext.posts[post].title}</h1>
                    <Markup content={authContext.posts[post].post}/>
                    <br/><br/><br/>
                    <div>Posted on {new Date(authContext.posts[post].created_on.seconds*1000).toLocaleDateString()}</div>
                    </div>)
                })}
                
            </div>
            <div className = 'bottom-spacer'></div> */}

           

        </div>
    )
}



export default Upload;