// import clientPromise from "lib/mongodb";
import {readTypes} from "lib/map-data";

export default async (req, res) => {
    const {method} = req
    switch (method) {
        case 'GET':
            try {
                const result = await readTypes()
                res.json(result);
            } catch (e) {
                console.error(e);
                res.status(500).end(`Internal Error for :${method} /map/markers`)
            }
            break; 
        case 'POST':
            //Route for Adding markers 
            break; 
        case 'DELETE':
            //Route for Deleting markers  
            break; 
        default:
            res.setHeader('Allow',['GET'])
            res.status(405).end(`Not Allowed ${method}`)
    }
    
 };

