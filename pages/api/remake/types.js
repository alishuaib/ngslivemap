// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "lib/mongodb";
  
export default async (req, res) => {
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

                let docs=[]
                await cursor.forEach(doc=>{
                    docs.push({
                        group:"",
                        type:doc['type'],
                        format:'normal',
                        icon:doc['src'].replace('/assets/','/map/'),
                        color:""
                    })
                })

                function getAttribute(docType,list){
                    for (const group in list) {
                        if (Object.hasOwnProperty.call(list, group)) {
                            const element = list[group];
                            for (const type in element) {
                                if(type==docType){
                                    return group
                                }
                            }
                        }
                    }
                }

                for (let i = 0; i < docs.length; i++) {
                    docs[i]={...docs[i],...{
                        group:getAttribute(docs[i].type,groups)
                    }}
                }

                for (let i = 0; i < docs.length; i++) {
                    if (docs[i].group=="Harvest") {
                        docs[i]={...docs[i],...{
                            region:getAttribute(docs[i].type,zone)
                        }}
                    }                    
                }

                for (let i = 0; i < docs.length; i++) {
                    if (docs[i].group=="Harvest") {
                        docs[i]={...docs[i],...{
                            category:getAttribute(docs[i].type,harvestType)
                        }}
                    }                    
                }

                for (let i = 0; i < docs.length; i++) {
                    docs[i]={...docs[i],...{
                        color: colorList[docs[i].type]
                    }}
                }

                //Update new data remade data
                const NEWdb = client.db("NGS-Dashboard");
                NEWdb.collection('map_types').deleteMany({})
                const result=NEWdb.collection('map_types').insertMany(docs)
                res.json({success:true,inserted:result.insertedCount,documents:docs});
            } catch (e) {
                console.error(e);
                res.status(500).end(`Internal Error for :${method} /map/nodes`)
            }
            break; 
        default:
            res.setHeader('Allow',['PATCH'])
            res.status(405).end(`Not Allowed ${method}`)
    }
    
 };


let groups={
    "Landmark":{
        "Teleporter": "",
        "Mag": "",
        "Cocoon": "",
        "Tower": "",
        "Urgent Quest": "",
        "Trinitas": "",
        "Battledia:Yellow": "",
        "Battledia:Purple": "",        
    },
    "Mineral":{
        "Monotite": "",
        "Dualomite": "",
        "PhotonChunk": "",
        "Trinite": "",
        "PhotonQuartz": "",
        "Tetracite": "",
        "Pentalite": "",
        "Blizzardium": "",
        "PhotonScale": "",
        "Infernium": "",
        "Hexakite": "",
        "Complex": ""
    },
    "Spawn":{
        "Veteran": "",
        "Gigantix": "",
        "Ancient": "",
    },
    "Valuables":{
        "Alpha Reactor": "",
        "Stellar Fragment": "",
        "Snoal": "",
    },
    "Collectables":{
        "Red Box": "",
        "Gold Box": "",
        "Green Box": "",
        "Data Pods": "",
    },    
    "Harvest":{
        "Apple": "",
        "Peach": "",
        "Pear": "",
        "Banana": "",
        "Clam": "",
        "Shell": "",
        "Crab": "",
        "Lobster": "",
        "Herb": "",
        "Mushroom": "",
        "Tomato": "",
        "Turnip": "",
        
        
        
        
        "Carambola": "",
        "Mango": "",
        "Cherry": "",
        "Strawberry": "",
        "Sea Urchin": "",
        "Seaslug": "",
        "Scallop": "",
        "Hermit Crab": "",
        "Retem Mushroom": "",
        "Cranberries": "",
        "Eggplant": "",
        "Cauliflower": "",
    
        
        "Guava": "",
        "Plum": "",
        "Persimmon": "",
        "Akebia": "",
        "Snail": "",
        "Squid": "",
        "Octopus": "",
        "Crayfish": "",
        "Kvaris Mushroom": "",
        "Cabbage": "",
        "Carrot": "",
        "Onion": "",
        "Notable Persimmon": "",
        "Notable Squid": "",
        
    
        "Stia Apple": "",
        "Stia Banana": "",
        "Stia Plum": "",
        "Stia Mango": "",
        "Stia Octopus": "",
        "Stia Sea Slug": "",
        "Stia Hermit Crab": "",
        "Stia Turban Shell": "",
        "Stia Cauliflower": "",
        "Stia Tomato": "",
        "Stia Herb": "",
        "Stia Cabbage": "",
        "Famous Carambola": "",
        "Famous Crab": "",
        "Famous Mushroom": "",
    },
}

let zone={
    "Aelio":{
        "Apple": "",
        "Peach": "",
        "Pear": "",
        "Banana": "",
        "Clam": "",
        "Shell": "",
        "Crab": "",
        "Lobster": "",
        "Herb": "",
        "Mushroom": "",
        "Tomato": "",
        "Turnip": "",
    },
    "Retem":{
        "Carambola": "",
        "Mango": "",
        "Cherry": "",
        "Strawberry": "",
        "Sea Urchin": "",
        "Seaslug": "",
        "Scallop": "",
        "Hermit Crab": "",
        "Retem Mushroom": "",
        "Cranberries": "",
        "Eggplant": "",
        "Cauliflower": "",
    },
    "Kvaris":{
        "Guava": "",
        "Plum": "",
        "Persimmon": "",
        "Akebia": "",
        "Snail": "",
        "Squid": "",
        "Octopus": "",
        "Crayfish": "",
        "Kvaris Mushroom": "",
        "Cabbage": "",
        "Carrot": "",
        "Onion": "",
        "Notable Persimmon": "",
        "Notable Squid": "",
        
    },
    "Stia":{
        "Stia Apple": "",
        "Stia Banana": "",
        "Stia Plum": "",
        "Stia Mango": "",
        "Stia Octopus": "",
        "Stia Sea Slug": "",
        "Stia Hermit Crab": "",
        "Stia Turban Shell": "",
        "Stia Cauliflower": "",
        "Stia Tomato": "",
        "Stia Herb": "",
        "Stia Cabbage": "",
        "Famous Carambola": "",
        "Famous Crab": "",
        "Famous Mushroom": "",
    }
}

let harvestType={
    "Fruit":{
        "Apple": "",
        "Peach": "",
        "Pear": "",
        "Banana": "",
        "Carambola": "",
        "Mango": "",
        "Cherry": "",
        "Strawberry": "",
        "Guava": "",
        "Plum": "",
        "Persimmon": "",
        "Akebia": "",
        "Stia Apple": "",
        "Stia Banana": "",
        "Stia Plum": "",
        "Stia Mango": "",
        "Notable Persimmon": "",
        "Famous Carambola": "",
    },
    "Seafood":{
        "Clam": "",
        "Shell": "",
        "Crab": "",
        "Lobster": "",
        "Sea Urchin": "",
        "Seaslug": "",
        "Scallop": "",
        "Hermit Crab": "",
        "Snail": "",
        "Squid": "",
        "Octopus": "",
        "Crayfish": "",
        "Stia Octopus": "",
        "Stia Sea Slug": "",
        "Stia Hermit Crab": "",
        "Stia Turban Shell": "",
        "Famous Crab": "",
    },
    "Vegetables":{
        "Herb": "",
        "Mushroom": "",
        "Tomato": "",
        "Turnip": "",
        "Retem Mushroom": "",
        "Cranberries": "",
        "Eggplant": "",
        "Cauliflower": "",
        "Kvaris Mushroom": "",
        "Cabbage": "",
        "Carrot": "",
        "Onion": "",
        "Stia Cauliflower": "",
        "Stia Tomato": "",
        "Stia Herb": "",
        "Stia Cabbage": "",
        "Famous Mushroom": "",
    }
}

let colorList={
    "Battledia:Event": [
      "#bfffff",
      "#43fffe",
      "#eecccc"
    ],
    "Battledia:Yellow": [
      "#ebd0fe",
      "#dbaafc",
      "#eecccc"
    ],
    "Battledia:Purple": [
      "#fefec9",
      "#fefe91",
      "#eecccc"
    ],
    "Cocoon": [
      "#ffeaea",
      "#eecccc",
      "#666666"
    ],
    "Mag": [
      "#ccfcfc",
      "#aaffff",
      "#636363"
    ],
    "Teleporter": [
      "#d6fede",
      "#aaffbb",
      "#636363"
    ],
    "Tower": [
      "#ffeaea",
      "#eecccc",
      "#636363"
    ],
    "Trinitas": [
      "#ffeaea",
      "#eecccc",
      "#636363"
    ],
    "Urgent Quest": [
      "#ffbdbd",
      "#ff5050",
      "#636363"
    ],
    "Gold Box": [
      "#cec6a5",
      "#ad8a00",
      "#636363"
    ],
    "Green Box": [
      "#a8c9a0",
      "#1c9600",
      "#636363"
    ],
    "Red Box": [
      "#d0a1a1",
      "#960000",
      "#636363"
    ],
    "Blizzardium": [
      "#a7e7c6",
      "#27eb84",
      "#28f8e8"
    ],
    "Complex": [
      "#c3b8d1",
      "#ac8dd2",
      "#5a75b9"
    ],
    "Dualomite": [
      "#b1b0fb",
      "#5a58f7",
      "#ad47f0"
    ],
    "Hexakite": [
      "#c695b9",
      "#c52098",
      "#64e8e6"
    ],
    "Infernium": [
      "#a7deb5",
      "#5eda71",
      "#41ae78"
    ],
    "Monotite": [
      "#ebb1c7",
      "#ef367d",
      "#fcd9ec"
    ],
    "Pentalite": [
      "#becbdc",
      "#93adcc",
      "#e7edf5"
    ],
    "PhotonChunk": [
      "#a19cc5",
      "#271877",
      "#e16ff7"
    ],
    "PhotonQuartz": [
      "#cff5f6",
      "#95f9fb",
      "#59a9c8"
    ],
    "PhotonScale": [
      "#98a8cc",
      "#3260c9",
      "#54edf3"
    ],
    "Tetracite": [
      "#a8837c",
      "#a52810",
      "#ef6e1c"
    ],
    "Trinite": [
      "#9ed0d2",
      "#27ced6",
      "#f9ed8b"
    ],
    "Apple": [
      "#ca9390",
      "#ce4f48",
      "#e6c06b"
    ],
    "Clam": [
      "#b2d4d9",
      "#85ccd6",
      "#bd6da5"
    ],
    "Crab": [
      "#caa5c3",
      "#a46397",
      "#eff0a5"
    ],
    "Banana": [
      "#e7dfb0",
      "#cebb5d",
      "#3c261c"
    ],
    "Herb": [
      "#b9d2ad",
      "#344d29",
      "#21e8fe"
    ],
    "Lobster": [
      "#decbb3",
      "#deb075",
      "#ffff87"
    ],
    "Mushroom": [
      "#dfdcc5",
      "#c3c0aa",
      "#841a2c"
    ],
    "Peach": [
      "#b1af98",
      "#7b774a",
      "#f9b86d"
    ],
    "Tomato": [
      "#ae7f84",
      "#9f202d",
      "#7a415f"
    ],
    "Pear": [
      "#9ec091",
      "#4fb629",
      "#6d5ea2"
    ],
    "Shell": [
      "#b7a5c8",
      "#6b498c",
      "#9b4d3a"
    ],
    "Turnip": [
      "#ddbec6",
      "#ad969c",
      "#7371a5"
    ],
    "Carambola": [
      "#8c92ae",
      "#1b2b70",
      "#31c4dd"
    ],
    "Cauliflower": [
      "#e1d6da",
      "#eec8d6",
      "#83a6a2"
    ],
    "Cherry": [
      "#dfa7b4",
      "#de6681",
      "#9a2d97"
    ],
    "Cranberries": [
      "#b2ceac",
      "#232e21",
      "#7f984d"
    ],
    "Eggplant": [
      "#8fa787",
      "#446a37",
      "#4a9683"
    ],
    "Hermit Crab": [
      "#d2b5a8",
      "#a38172",
      "#3e4667"
    ],
    "Mango": [
      "#bed6bc",
      "#429e3a",
      "#dbdc3a"
    ],
    "Seaslug": [
      "#eae7c3",
      "#d5cf88",
      "#9555f3"
    ],
    "Retem Mushroom": [
      "#bdb2ae",
      "#3b322e",
      "#3bf3cc"
    ],
    "Scallop": [
      "#dddabb",
      "#b0ad86",
      "#f39dab"
    ],
    "Sea Urchin": [
      "#d1beab",
      "#88735e",
      "#ec6952"
    ],
    "Strawberry": [
      "#d4999d",
      "#bd323b",
      "#c4a830"
    ],
    "Akebia": [
      "#b8a5c8",
      "#563d6a",
      "#e138e8"
    ],
    "Cabbage": [
      "#d8dcf2",
      "#aab2d8",
      "#b6f8fa"
    ],
    "Carrot": [
      "#eadeb9",
      "#e0bd55",
      "#deb94d"
    ],
    "Crayfish": [
      "#d0b1bb",
      "#b1727e",
      "#c7c02d"
    ],
    "Guava": [
      "#d6a8a9",
      "#d37073",
      "#b8c580"
    ],
    "Kvaris Mushroom": [
      "#c8e1b4",
      "#89be5f",
      "#9aa8b2"
    ],
    "Notable Persimmon": [
      "#dbe3ad",
      "#afc731",
      "#c26761"
    ],
    "Notable Squid": [
      "#fac4a9",
      "#f78a53",
      "#8b2430"
    ],
    "Octopus": [
      "#fadbf3",
      "#f8beec",
      "#fac4b1"
    ],
    "Onion": [
      "#ead2e6",
      "#be9ab8",
      "#fe85fb"
    ],
    "Persimmon": [
      "#ebc496",
      "#d88422",
      "#a8ad44"
    ],
    "Plum": [
      "#d9c8f1",
      "#b69add",
      "#79ba8d"
    ],
    "Snail": [
      "#bbd3df",
      "#76badb",
      "#daa3af"
    ],
    "Squid": [
      "#d0e8f3",
      "#83c2df",
      "#f9c894"
    ],
    "Stia Apple": [
      "#f1eeb3",
      "#cac655",
      "#5e614a"
    ],
    "Stia Banana": [
      "#dfb1df",
      "#d28ad3",
      "#7067a9"
    ],
    "Stia Cabbage": [
      "#f5efcd",
      "#cfcaab",
      "#d6aaf2"
    ],
    "Stia Cauliflower": [
      "#9ebad2",
      "#457cad",
      "#634e73"
    ],
    "Stia Hermit Crab": [
      "#d9aca8",
      "#c76f66",
      "#61b8ea"
    ],
    "Famous Carambola": [
      "#d5c2a4",
      "#b98f4e",
      "#da5fae"
    ],
    "Famous Crab": [
      "#d9d9d7",
      "#b4b49d",
      "#f7f657"
    ],
    "Famous Mushroom": [
      "#e5abcd",
      "#e44fa7",
      "#ab77d1"
    ],
    "Stia Herb": [
      "#afa5c4",
      "#472d7c",
      "#b73d30"
    ],
    "Stia Mango": [
      "#b1bed4",
      "#254e8d",
      "#e0e647"
    ],
    "Stia Octopus": [
      "#c7c8ed",
      "#474adb",
      "#f289fa"
    ],
    "Stia Plum": [
      "#c2ead1",
      "#7dcc9b",
      "#cad662"
    ],
    "Stia Sea Slug": [
      "#b6c8de",
      "#467ec6",
      "#c8654f"
    ],
    "Stia Turban Shell": [
      "#f3d6cb",
      "#cba698",
      "#dbb1eb"
    ],
    "Stia Tomato": [
      "#d4e2a3",
      "#95a854",
      "#a28e9e"
    ],
    "Alpha Reactor": [
      "#fffdc6",
      "#fff820",
      "#ac7821"
    ],
    "Snoal": [
      "#ffffd1",
      "#fefe46",
      "#c18220"
    ],
    "Stellar Fragment": [
      "#fffbb3",
      "#eadf2b",
      "#8d6d55"
    ],
    "Ancient": [
      "#a4dbe3",
      "#14899b",
      "#069b93"
    ],
    "Gigantix": [
      "#e8b8ed",
      "#8e159b",
      "#5b059b"
    ],
    "Veteran": [
      "#efc0b3",
      "#9b3216",
      "#9b0515"
    ],
    "Data Pods": [
      "#b7c5d2",
      "#383a3c",
      "#ffffff"
    ]
  }