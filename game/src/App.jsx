import { BrowserRouter  as Router, Routes, Route} from 'react-router-dom'
import Home from './frontend/Home'
import Navbar from './frontend/Navbar'
import Leader from './frontend/Features/Leader'
import Dash from './frontend/Dash'
import Analytics from './frontend/Features/Analytics'
import Sign from './frontend/Features/Sign'
import Signup from './frontend/Features/Signup'
import Wallet from './frontend/Extra/Wallet'


const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leader/>} />
        <Route path="/leaderboard" element={<Leader/>} />
        <Route path="/dashboard" element={<Dash/>} />
        <Route path="/Analytics" element={<Analytics/>}/>
        <Route path ="/Sign" element={<Sign/>}/>
        <Route path ="/Signup" element={<Signup/>}/>
        <Route path="/Wallet" element={<Wallet />} />

      </Routes>
      </Router>
    
    
  )
}

export default App;


// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './frontend/Navbar'
// import Home from './frontend/Home';
// import Leaderboard from './frontend/Features/Leader';


// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/leaderboard" element={<Leaderboard />} />
//         {/* <Route path="/signin" element={<SignIn />} />
//         <Route path="/analytics" element={<Analytics />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
