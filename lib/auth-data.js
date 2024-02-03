// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "lib/mongodb";
  
export async function login_auth(data){
    const client = await clientPromise;
    const db = client.db("NGS-Dashboard");
    const collection=db.collection("users")
    
    const timestamp = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'America/New_York',
        timeZoneName: 'short'
    });

    let result = await collection.findOne({id:data.id})
    if (result) return result
    else{
        let insert = await collection.insertOne({...data,...{
            lastLogin:timestamp,
            access:"standard"
        }})
        result=await collection.findOne({_id:insert.insertedId})
    }
    return result 
};

