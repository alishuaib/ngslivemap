// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "lib/mongodb";
  
export default async (req, res) => {
    // res.status(405).end(`Not Allowed ${method}: Route Locked`)
    // return 
    const {method} = req
    
    switch (method) {
        case 'PATCH':
            //Recreate Nodes from NGS-Map to NGS-Dashboard with more tuned scalings
            try {
                //Load previous data
                const client = await clientPromise;
                const OLDdb = client.db("NGS-Map");
         
                const cursor = await OLDdb
                    .collection("users")
                    .find({})

                let docs=[]
                await cursor.forEach(doc=>{
                    docs.push({
                        name:doc.name,
                        email:doc.email,
                        id:doc.googleId,
                        lastLogin:doc.lastLogin,
                        access:'standard' // standard, collab, admin
                    })
                })
                // //Update new data remade data
                const NEWdb = client.db("NGS-Dashboard");
                NEWdb.collection('users').deleteMany({})
                const result=NEWdb.collection('users').insertMany(docs)
                res.json({success:true,inserted:result.insertedCount,documents:docs});
            } catch (e) {
                console.error(e);
                res.status(500).end(`Internal Error for :${method} /remake/markers`)
            }
            break; 
        default:
            res.setHeader('Allow',['PATCH'])
            res.status(405).end(`Not Allowed ${method}`)
    }
    
 };

