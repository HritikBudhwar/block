import { BrowserRouter  as Router, Routes, Route} from 'react-router-dom'
import Home from './frontend/Home'
import Navbar from './frontend/Navbar'
import Leader from './frontend/Features/Leader'
import Dash from './frontend/Dash'
import Analytics from './frontend/Features/Analytics'
import Sign from './frontend/Features/Sign'
import Signup from './frontend/Features/Signup'
import Wallet from './frontend/Extra/Wallet'
import Transfer from './frontend/UI/Transfer'


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
        <Route path="/Transfer" element={<Transfer />} />

      </Routes>
      </Router>
    
    
  )
}

export default App;