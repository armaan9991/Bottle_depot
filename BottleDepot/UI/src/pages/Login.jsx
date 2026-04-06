import { useState } from "react";
import {useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';

export default function Login(){
    const[workId,setWorkId]=useState('');
    const[password,setPassword]=useState('')
     const [loading,setLoading]=useState('')
    // const {login} = UseAuth();
    const [error, setError]       = useState('');
    const navigate=useNavigate();

    const handlelogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
        var resp= await loginApi(workId,password);
        // login
        login(resp.data);
        if (resp.data.role === 'Admin'){
            navigate('/admin/dashboard'); 
        }  
        else{
            navigate('/employee/dashboard'); 
        }
    }
    catch(err){
        setError('Invalid Employee ID or password');
    }
    finally{
        setLoading(false);
    }
    }


    // setWorkId(workId);
    return(
        <div>
            <div>
                <form onSubmit={handlelogin}>
                    <div>
                        <label>Employee ID</label>
                        <input
                            style={style.input}
                            type="text"
                            placeholder="Enter emplyee Id"
                            value={workId}
                            onChange={e=> setWorkId(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                        style={style.input}
                        type="password"
                        placeholder="Enter your password!"
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                        required
                        />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}
                    
                    <button
                    type="submit"
                    disabled={loading}
                    >
                        // this is to what display in button text field when we press it .
                        // if we press it then it button says signing in else Signin
                    {loading ? 'signing in ...' : ' Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
}