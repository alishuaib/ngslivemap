// import clientPromise from "lib/mongodb";
import {login_auth} from "lib/auth-data";

export default async (req, res) => {
    const {method} = req
    switch (method) {
        case 'GET':
            //Route for Getting User?
            break; 
        case 'POST':
            //Route for Registering User 
            let result=await login_auth(req.body)
            res.status(200).json(result)
            break; 
        case 'DELETE':
            //Route for Deleting User?
            break; 
        default:
            res.setHeader('Allow',['POST'])
            res.status(405).end(`Not Allowed ${method}`)
    }    
 };

