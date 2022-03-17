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
    const [postsArr, setPostsArr] = useState([]);
    const [posts, setPosts] = useState({});
    const [currentPost, setCurrentPost] = useState({});
    const [currentPostSet, setCurrentPostSet] = useState(false);

    var companies=['Berkshire Hathaway', 'JPMorgan Chase', 'Visa', 'Mastercard', 'Bank of America', 'Wells Fargo', 'Citigroup', 
    'Morgan Stanley', 'Charles Schwab', 'American Express', 'BlackRock', 'Goldman Sachs', 'S&P Global', 'US Bancorp', 'Truist Financial', 
    'PNC Financial Services', 'CME Group', 'Chubb Limited', 'Intercontinental Exchange', 'Marsh & McLennan', 'Capital One', 'Everest Re', 'EY Parthenon',
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
    'A.T. Kearney', 'Accenture', 'Bain & Company', 'BDO', 'Booze Allen Hamilton', 'Boston Consulting Group', 'Capco', 'Ernst & Young', 'KPMG', 'McKinsey', 
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

    const getBlogPosts = async () => {
      const posts = await Firebase.firestore().collection('posts').orderBy('created_on').get();
      var tempArr = []
      var tempHash = {}
      posts.docs.map((post, i)=>{
        if (post.data().live === true){
          tempArr.push(post.id);
          tempHash[post.id] = post.data();
        }
      })

      setPosts(tempHash);
      setPostsArr(tempArr.reverse());

    }

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



    useEffect(async ()=>{
      getLevels();
      getSalaries();

      getBlogPosts();
//       await Firebase.firestore().collection('posts').doc().set({
//         title: 'Highest Paying Finance Jobs Out of Undergrad',
//         post: `Oftentimes what comes to mind when thinking of the highest paying entry level jobs in finance are careers like Investment Banking Analyst and Hedge Fund Analyst, where actors dress up in suits, and miraculously never have to open an excel tab. 
//         And while those careers are definitely amongst this list, some of the highest paying titles (and the numbers attached to them) are surprisingly less talked about. 
//         <br/> <br/> Articles list compensation numbers as nation-wide averages across the US, but some firms offer their top candidates in higher cost of living cities compensation packages that are significantly higher. 
//         <br/> <br/> See below for the highest offers we've seen in our salary database, along with the nationwide averages.
//         <h3>1. Quantitative Trader</h3>
// Glassdoor states that the national average in the U.S. for a quantitative trader across all experience levels is $146,496, but some of the highest paying entry-level jobs out of undergrad include:
// <li>
// <ol>1. Susquehanna International Group at a total yearly comp of $250k (plus $75k signing). </ol>
// <ol>2. Citadel at an annual comp of $375k. </ol>
// <ol>3. Squarepoint Capital at an annual comp of $160k (plus $50k signing). </ol>
// </li>
// While base salaries remain *relatively* lower, bonuses increase significantly at higher levels. We've seen entries of $1M and ~$2.5M at large quantitative funds and while the traders prefer to keep their employer's names anonymous, possible candidates include firms like Citadel and Jane Street. Take a look at our database to see how long it took these traders to get to that level of total compensation.

// <h3>2. Investment Banking</h3>
// It's inevitable that Investment Banking would be on this list, but starting salaries this year are even higher than those you may have seen in previous years. Glassdoor lists the national U.S. average as $80,540, and some of the highest paying entry level offers in our database include:
// <li>
// <ol> 1. Goldman Sachs at a total compensation of $170k </ol>
// <ol> 2. Morgan Stanley at a total compensation of $165k </ol>
// <ol> 3. JP Morgan at a total compensation of $155k </ol>
// <ol> 4. Cohnreznick Capital at a total compensation of $175k </ol>
// </li>

// Analyst salaries at top investment banks increased this year due to analyst turnover, with junior bankers stating that their quality of life has taken a plunge while hours worked have skyrocketed due to a record number of deals during the pandemic. In response, banks have raised their compensation packages to lure analysts away from competing professions.

// <h3> 3. Sales and Trading</h3>
// Sales and trading is another lucrative career, with hours and a weekly schedule that is typically not as demanding as that of an investment banker. Glassdoor lists the nationwide average as $51,167, and the average within New York City as $122,736, but larger banks may pay more than that for fresh graduates. Some of the entry level salaries in our database include:
// <li>
// <ol>1. Morgan Stanley with a total comp of $155k.</ol>
// <ol>2. JP Morgan with a total comp of $155k.</ol>
// <ol>3. Wells Fargo with a total comp of $150k.</ol>
// </li>
// <h3> 4. Management Consulting</h3>
// Management consulting is a career choice that allows first year analysts to travel across the country sometimes up to once every week, living in fancy hotels and expensing meals as they work. Glassdoor lists the national average for management consulting as $103,853, and the top entry-level compensation packages we've seen in our database include:
// <li>
// <ol>1. McKinsey with a total comp package of $115k </ol>
// <ol>2. BCG with a total comp package ranging from $115k-$125k depending on location and performance.</ol>
// <ol>3. Bain with a total comp package ranging from $115k - $130k depending on location and performance.</ol>
// </li>
// While an ideal career choice depends on your preferred lifestyle, work-life-balance, as well as the skills that you bring to the table, it's also important to understand the total compensation package you receive. Reported averages typically don't tell the whole story of how high (or low) your compensation package will be depending on the employer you sign with.`,
//         created_on: new Date()

//       })
      const unsubscribeAuth = auth.onAuthStateChanged(async authenticatedUser => {
      try {
        await (authenticatedUser ? setUserInfo(authenticatedUser) : setUserInfo(null));
        // await (authenticatedUser ? setBlur(false) : setBlur(true));
        await (authenticatedUser ? setUid(authenticatedUser.uid) : setUid(null));
        console.log(authenticatedUser.uid)
        var userTemp = await Firebase.firestore().collection('users').doc(`${authenticatedUser.uid}`).get();
        if (userTemp === null){
          Firebase.firestore().collection('users').doc(`${authenticatedUser.uid}`).set({
              email: email,
              firstname: firstName,
              lastname: lastName,
              contribution: false,
              salary: false,
              exit_op: false,
              timeline: false,
              receive_updates: false,
              created_on: new Date()
            }, {merge: true});

          setUserData({
              email: email,
              firstname: firstName,
              lastname: lastName,
              contribution: false,
              salary: false,
              exit_op: false,
              timeline: false,
              receive_updates: false,
              created_on: new Date()
            })
        } else{
          setUserData(userTemp.data());
        }
        
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
    titleFilter, setTitleFilter, yoeFilter, setYoeFilter, user, setUser, userInfo, setUserInfo, userData, setUserData, blur, setBlur, uid, setUid,
    posts, postsArr, setPosts, setPostsArr, currentPost, setCurrentPost, currentPostSet, setCurrentPostSet}}>
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
