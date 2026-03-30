import axios from "axios";

export default function API(){
    axios.create({
        baseURL:'http://localhost:5000/api',
        
    })
}