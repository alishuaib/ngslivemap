// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "lib/mongodb";
  
export default async (req, res) => {
    // if (req.headers.authorization!==process.env.API_KEY){
    //     return res.status(401).send('Unauthorized Request')
    // }
    const {method} = req
    switch (method) {
        case 'GET':
            //Route for Getting region info 
            break; 
        case 'POST':
            //Route for Updating region info 
            break;
        default:
            res.setHeader('Allow',['GET'])
            res.status(405).end(`Not Allowed ${method}`)
    }
    
 };