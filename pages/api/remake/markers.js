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
                    .collection("nodes")
                    .find({})

                //Reorganize Data
                function convertCoordinates(coord){ //Make relative to 4096x4096 image size
                  return (((((coord)/(4096/4096))*(4096/12288)) - 5)/4096)
                }

                let docs=[]
                await cursor.forEach(doc=>{
                    for (let i = 0; i < doc.coordinates.length; i++) {
                      const coord = doc.coordinates[i];
                      docs.push({
                        type:doc['type'],
                        x:convertCoordinates(coord.coord[0]),
                        y:convertCoordinates(coord.coord[1]),
                        depth:0,
                        radius:0,
                        name:coord.name,
                        description:coord.desc,
                        image:coord.preview==""?null:coord.preview,
                        author:coord.user,
                        timestamp:new Date().toLocaleString('en-US', { timeZone: 'UTC', hour12: false }),
                        cluster:[]
                      })
                    }
                })

                // res.json(docs)

                // //Update new data remade data
                const NEWdb = client.db("NGS-Dashboard");
                NEWdb.collection('map_markers').deleteMany({})
                const result=NEWdb.collection('map_markers').insertMany(docs)
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

