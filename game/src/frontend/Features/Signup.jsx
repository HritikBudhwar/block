import "./Sign.css"

const Signup=()=>{
    return(
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

        <label htmlFor="password">Confirm Password</label>
        <input type="password" id="password" name="Confirm Password" placeholder="Confirm Password" required />
         
        

        <button type="submit">Sign Up</button>

                </form>
            </div>
        </div>
    )
}

export default Signup;