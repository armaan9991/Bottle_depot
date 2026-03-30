import { useState } from "react";
import {useNavigate } from 'react-router-dom';

export default function Login(){
    const[workId,setWorkId]=useState('');
    const[password,setPassword]=useState('')

    // setWorkId(workId);
    return(
        <div>
            <div>
                <form>
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

                    
                </form>
            </div>
        </div>
    );
}