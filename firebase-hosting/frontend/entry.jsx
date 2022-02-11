import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
// import {Firebase, db} from '../../config/firebase';
import App from './components/app'
import {HashRouter} from 'react-router-dom'
import AuthContext from '../context/Context'
import {Firebase, db, functions} from '../config/firebase';
import Footer from './components/footer'
import SalaryForm from './pages/salaryform'
import Levels from './pages/levels'
import Header from './components/header'
import Entry from './pages/entryopsform'
import TitlesForm from './pages/titlesform'
import {AuthenticatedUserContext} from './pages/AuthenticatedUserProvider'
import 'babel-polyfill';

const auth = Firebase.auth();

function Root() {
    const authContext = useContext(AuthContext);
    // Declare a new state variable, which we'll call "count"
     const { user, setUser} = useContext(AuthenticatedUserContext);
    const [companiesArr, setCompaniesArr] = useState([])
    const [page, setPage] = useState(1);
    const [companyLevelsHash, setCompanyLevelsHash] = useState({});
    const [companyLevelsArr, setCompanyLevelsArr] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [selected, setSelected] = useState(['Goldman Sachs', 'HSBC'])
    const [max, setMax] = useState(0)
    const [rulerArray, setRulerArray] = useState([])
    const [salaries, setSalaries] = useState({});
    const [salariesArr, setSalariesArr] = useState([])
    const [loadingFirebase, setLoadingFirebase] = useState(true);
    const [careerFilter, setCareerFilter] = useState(null);
    const [titleFilter, setTitleFilter] = useState(null);
    const [yoeFilter, setYoeFilter] = useState(null);
    const [userInfo, setUserInfo] = useState(null)
    const [userData, setUserData] = useState({});
    const [uid, setUid] = useState(null);
    const [blur, setBlur] = useState(false);

    var companies=['Berkshire Hathaway', 'JPMorgan Chase', 'Visa', 'Mastercard', 'Bank of America', 'Wells Fargo', 'Citigroup', 
    'Morgan Stanley', 'Charles Schwab', 'American Express', 'BlackRock', 'Goldman Sachs', 'S&P Global', 'US Bancorp', 'Truist Financial', 
    'PNC Financial Services', 'CME Group', 'Chubb Limited', 'Intercontinental Exchange', 'Marsh & McLennan', 'Capital One', 'Everest Re', 
    "Moody's Corp", 'MetLife', 'Aon', 'The Bank of New York Mellon', 'American International Group', 'T.Rowe Price Group', 'The Travelers Companies', 
    'Prudential Financial', 'Aflac', 'Allstate', 'State Street Corp', 'Willis Towers Watson', 'First Republic Bank', 'Discover Financial Services', 
    'William Companies', 'Ameriprise Financial', 'Fifth Third Bancorp', 'SVB Financial', 'Arthur J. Gallagher & Co', 'Hartford Financial Services Group', 
    'Synchrony Financial', 'Northern Trust Corp', 'Regions Financial Corp', 'M&T Bank', 'KeyCorp', 'Citizens Financial Group', 'MarketAxess', 
    'Cincinnati Financial', 'RaymondJames Financial', 'Principal Financial Group', 'HuntingTon Bancshares', 'Franklin Resources', 'Loews Corp', 
    'Unum Group', 'Lincoln National', 'Invesco Ltd.', 'Point72', 'D.E. Shaw', 'Two Sigma Investments', 'Bridgewater Associates', 'Millennium', 
    'AQR Capital Management', 'Squarepoint Capital', 'Citadel Investment Group', 'Magnetar Capital', 'Graham Capital Management', 'Baupost Group', 
    'GoldenTree Asset Management', 'Bayview Asset Managment', 'Abdiel Capital', 'GCM Grosvenor', 'Angelo Gordon', 'Ellington Management Group', 
    'Worldquant', 'Blackstone Group', 'Man Group', 'Arrowstreet Capital', 'JP Global Capital Management', 'Zais Group', 'Matrix Capital Management', 
    'Soros Fund Management', 'Crestline Investors', 'Credit Suisse', 'Barclays', 'Deustche Bank', 'UBS', 'Blackstone Group', 'KKR', 'Partners Group', 
    'Carlyle Group', 'TPG', 'Cerberus Capital Management', 'LLR Partners', 'Bain Capital', 'Hamilton Lane', 'HarbourVest', 'Advent International Corporation',
    'Vista Equity Partners', 'K1 Investment Management', 'Insight Venture Partners', 'Copley Equity Partners', 'The Riverside Company', 
    'Roark Capital Group', 'Audax Group', 'Graham Partners', 'Thomas H Lee Partners', 'Alpine Investors', 'Starwood Capital Group', 
    'Apollo Global Management', 'HIG Capital', 'Tower Arch Capital', 'Main Street Capital', 'Warburg Pincus', 'Riverstone Holdings', 'Maranon Capital', 
    'Star Mountain Capital', 'Vector Capital', 'Charlesbank Capital Partners', 'Golden Gate Capital', 'LP Analyst', 'Rosewood Private Investments', 
    'Portfolio Advisors', 'Satori Capital', 'Ardian', 'GCM Grosvenor', 'Pharos Capital Group', 'Carrick Capital Partners', 
    'RCP Advisors', 'Long Arc Capital', 'Novacap', 'Comvest Partners', 'Grosvenor Capital Management', 'Tikehau Capital', 'GTCR', 'Onex', 
    'Atlantic Steet Capital Partners', 'Insight Equity', 'Lone Star Funds', 'CCPIB', 'OTPP', 'CIBC', 'TD', 'RBC', 'BMO', 'Scotiabank',
    'A.T. Kearney', 'Accenture', 'Bain', 'BDO', 'Booze Allen Hamilton', 'Boston Consulting Group', 'Capco', 'Ernst & Young', 'KPMG', 'McKinsey', 
    'Oliver Wyman', 'PWC', 'HSBC', 'Fidelity', 'Quantitative Management Associates', 'Renaissance Technologies', 'MAN Group', 'QIM', 'AQR Capital', 
    'AlphaSimplex Group', 'PanAgora', 'Capula', 'Acadian Asset Manager', 'Akuna Capital', 'Allston Trading', 'Amplify Trading', 'Belvedere Trading', 
    'Breakwater Trading', 'Bright Trading', 'Chicago Trading Company', 'DRW Trading Group', 'First New York', 'DV Trading', 'Flow Traders', 'Gelber Group', 
    'Geneva Trading', 'Group One Trading', 'Hudson River Trading', 'IMC Financial Markets', 'Integra Capital', 'Jane Street', 'Jump Trading', 
    'Kershner Trading Group', 'Optiver', 'Peak6 Trading', 'Susquehanna International Group', 'Tibra Capital', 'TopstepTrader', 'Tower Research Capital', 
    'Trillium Trading', 'Wolverine Trading', 'XR Trading', 'MUFG', 'Pratt Wealth Management', 'SMBC', 'Alliance Bernstein', 'Deloitte', 'London Stock Exchange', 'Credit Agricole', 'Mizuho']

    const getLevels = async() => {
      const companyLevels = await Firebase.firestore().collection('levels').get()
      var hashTemp = {}
      var arrTemp = []
      companyLevels.docs.map((comp, i)=>{
        arrTemp.push(comp.id);
        hashTemp[comp.id] = comp.data();
      })
      setCompanyLevelsHash(hashTemp);
      setCompanyLevelsArr(arrTemp);
      calcMax(selected, hashTemp)
    }
    
    const calcMax = async(selected, companyLevelsHash) => {
        var max = 0;
        var track = 0;
        
        selected.map((selection, i)=>{
            track = 0;
            companyLevelsHash[selection]["timeline-max"].map((year, j)=>{
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
        var Arr = new Array(max+2);
        Arr.fill(true);
        setRulerArray(Arr);
        setMax(max+2)
        setLoaded(true);
    }

    const getSalaries = async() => {
        const comps = await Firebase.firestore().collection('salaries').orderBy("created_on").get();
        var tempArr = []
        var tempHash = {}
        comps.docs.map((salary, i)=>{
          tempArr.push(salary.id);
          tempHash[salary.id] = salary.data();
          
        })
        setSalaries(tempHash);
        setSalariesArr(tempArr.reverse());
        setLoadingFirebase(false)
    }

    const getUser = async() =>{

    }



    useEffect(async ()=>{
      getLevels();
      getSalaries();
      const unsubscribeAuth = auth.onAuthStateChanged(async authenticatedUser => {
      try {
        await (authenticatedUser ? setUserInfo(authenticatedUser) : setUserInfo(null));
        // await (authenticatedUser ? setBlur(false) : setBlur(true));
        await (authenticatedUser ? setUid(authenticatedUser.uid) : setUid(null));
        console.log(authenticatedUser.uid)
        var userTemp = await Firebase.firestore().collection('users').doc(`${authenticatedUser.uid}`).get();
        setUserData(userTemp.data());
      } catch (error) {
        console.log(error);
      }
    });

    //unsubscribe auth listener on unmount
    return unsubscribeAuth;

    }, [])

  return (
    <AuthContext.Provider value={{loaded, setLoaded, companies,  companiesArr, setCompaniesArr, companyLevelsHash, setCompanyLevelsHash, 
    companyLevelsArr, setCompanyLevelsArr, selected, setSelected, max, setMax, rulerArray, setRulerArray, salariesArr, setSalariesArr, salaries, setSalaries, careerFilter, setCareerFilter,
    titleFilter, setTitleFilter, yoeFilter, setYoeFilter, user, setUser, userInfo, setUserInfo, userData, setUserData, blur, setBlur, uid, setUid}}>
      <HashRouter>
        <div className='wrap'>
          {/* <Header/> */}

          <App/>
          <Footer/>
        </div>
      </HashRouter>
    </AuthContext.Provider>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  // ReactDOM.render(<Root/>, document.getElementById('main'));
  ReactDOM.render(<Root/>, document.getElementById('main'));
});
