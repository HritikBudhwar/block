import './Sign.css';
import { Link } from 'react-router-dom';


const Sign = () => {

    return (
        <div>
    <div className="container">
    <form className="sign-form">
        <h2 className="form-title">Student Sign In</h2>

        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Enter your name" required />

        <label htmlFor="srn">SRN</label>
        <input type="text" id="srn" name="srn" placeholder="Enter your SRN" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required />
         
        

        <button type="submit">Login</button>

</form>
 <p className="signup-prompt">
          Don't have an account?  <Link to="/Signup" className="signup-link">Sign up</Link>
        
        </p>
    </div>
    </div>
);
};

export default Sign;
