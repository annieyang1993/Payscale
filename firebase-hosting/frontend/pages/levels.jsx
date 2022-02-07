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


import {BiSupport} from 'react-icons/bi'
//import {Firebase, db} from '../config/firebase';
require('react-dom');



function Levels() {
    const authContext = useContext(AuthContext);
    const [selected, setSelected] = useState(authContext.selected)
    const colors = ['rgba(255, 166, 0, ', 'rgba(255, 192, 203, ', 'rgba(157, 192, 157, ', 'rgba(161, 161, 228, ']
    const [max, setMax] = useState(authContext.max);
    const [load, setLoad] = useState(false);

    const calcMax = async(selected) => {
        var max = 0;
        var track = 0;
        
        selected.map((selection, i)=>{
            track = 0;
            authContext.companyLevelsHash[selection]["timeline-max"].map((year, j)=>{
                if (Number(year)===-1){
                    track+=5;
                } else{
                    track+=Number(year);
                }
                
            })
            if (track>max){
                max = track;
            }
        })
        authContext.setMax(max+2)
        var arr = new Array(max+2);
        arr.fill(true);
        authContext.setRulerArray(arr);
        setLoad(false);
    }

    useEffect(async () => {
        console.log(max)
    }, [])


    return (
        <div className = "content">
            <div className='title-wrapper'>
                <div className='title'>Payscale.io <BsCoin className='icon'/></div>
                
            </div>
            
            <div className = 'content-inner'>
            <div className = 'selections'>
            {authContext.companyLevelsArr.map((comp, i)=>{
                if (selected.includes(comp)){
                    return (<div className = 'selection-selected' onClick={()=>{
                        if (selected.length>1){
                            var selectedTemp = selected.map((x)=>x);
                            selectedTemp.splice(i, 1);
                            setSelected(selectedTemp);
                            calcMax(selectedTemp);
                        }
                        
                    }}>{comp}</div>)
                } else{
                    return (<div className = 'selection-unselected' onClick={()=>{
                        if (selected.length<4){
                            var selectedTemp = selected.map((x)=>x);
                            selectedTemp.push(comp);
                            setSelected(selectedTemp);
                            calcMax(selectedTemp);
                        }
                        
                    }}>{comp}</div>)
                }
                
            })}
            </div>
            {authContext.loaded ? 
            <div className = 'scale' style={{ width: '20px'}}>
                {authContext.rulerArray.map((year, i)=>{
                    console.log(i)
                    console.log(authContext.max)
                    return(
                        <div className = 'step' key={i}>{i+1}</div>
                    )
                })}
            </div> : null}
            
            {authContext.loaded ? 
            selected.map((comp, i)=>{
                return (
                    <div className = 'levels-wrapper' key={i} style={{width: `calc((100% - 25px) / ${selected.length} - 6px`}}>
                    <div className = 'level-title' style={{textAlign: 'center'}}>{selected.length>1 ? <div style={{float: 'left', color: 'gray', padding: '5px', marginTop: '-5px'}}  className = 'close' onClick={()=>{

                        var selectedTemp = selected.map((x)=>x);
                        selectedTemp.splice(i, 1);
                        setSelected(selectedTemp);
                        calcMax(selectedTemp);
                    }}>x</div> : null}{comp}</div>
                    <div style={{width: '100%', display: 'flex', flexWrap: 'wrap'}}>
                    <div className = 'min-levels' key={i} style={{width: `calc(${100/2}% - 4px`}}>
                        {authContext.companyLevelsHash[comp]['titles'].map((level, j)=>{
                            if (j===authContext.companyLevelsHash[comp]['titles'].length-1){
                                return(
                                <div className = 'level' style={{height: `${1*40}px`, backgroundColor: `${authContext.companyLevelsHash[comp]['rgb'] + String((j+3)/10)})`}}>
                                    <div style={{height: `100%`, width: '100%', backgroundColor: `rgba(128, 128, 128, ${(j)/10})`, borderRadius: '5px'}}>
                                    <br/>
                                    {level} **
                                    </div>
                                </div>
                                )
                            } else if (Number(authContext.companyLevelsHash[comp]['timeline-min'][j])===-1){
                                return(
                                <div className = 'level' style={{height: `${5*20}px`, backgroundColor: `${authContext.companyLevelsHash[comp]['rgb']+ String((j+3)/10)})`}}>
                                    <div style={{height: `100%`, width: '100%', borderRadius: '5px', backgroundColor: `rgba(128, 128, 128, ${(j)/10})`}}>
                                    <br/>
                                    {level} *
                                    </div>

                                </div>
                                )
                            }
                            return(
                                <div className = 'level' style={{height: `${Number(authContext.companyLevelsHash[comp]['timeline-min'][j])*20}px`, backgroundColor: `${authContext.companyLevelsHash[comp]['rgb']+ String((j+3)/10)})`}}>
                                    <br/>
                                    {level}

                                </div>
                            )
                        })}
                    </div>

                    <div className = 'min-levels' key={i} style={{width: `calc(${100/2}% - 4px`}}>
                        {authContext.companyLevelsHash[comp]['titles'].map((level, j)=>{
                            if (j===authContext.companyLevelsHash[comp]['titles'].length-1){
                                return(
                                <div className = 'level' style={{height: `${1*40}px`, backgroundColor: `${authContext.companyLevelsHash[comp]['rgb']+ String((j+3)/10)})`}}>
                                    <div style={{height: `100%`, width: '100%', borderRadius: '5px', backgroundColor: `rgba(128, 128, 128, ${(j)/10})`}}>
                                    <br/>
                                    {level} **
                                    </div>
                                </div>
                                )
                            } else if (Number(authContext.companyLevelsHash[comp]['timeline-max'][j])===-1){
                                return(
                                <div className = 'level' style={{height: `${5*20}px`, backgroundColor: `${authContext.companyLevelsHash[comp]['rgb']+ String((j+3)/10)})`}}>
                                    <div style={{height: `100%`, width: '100%', backgroundColor: `rgba(128, 128, 128, ${(j)/10})`, borderRadius: '5px'}}>
                                    <br/>
                                    {level} *
                                    </div>

                                </div>
                                )
                            }
                            return(
                                <div className = 'level' style={{height: `${Number(authContext.companyLevelsHash[comp]['timeline-max'][j])*20}px`, backgroundColor: `${authContext.companyLevelsHash[comp]['rgb']+ String((j+3)/10)})`}}>
                                    <br/>
                                    {level}

                                </div>
                            )
                        })}
                    </div>
                    </div>
                    </div>
                )
                
            }) : null}
            </div>
        </div> 
    );
}

export default Levels;