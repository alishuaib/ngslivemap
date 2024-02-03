// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const getColors = require("get-svg-colors")

export default async (req, res) => {
    res.status(405).end(`Not Allowed ${method}: Route Locked`)
    return 
    const {method} = req
    switch (method) {
        case 'GET':
            try {
                const colorsPrimary = getColors("./public/assets/colorsPrimary.svg")
                const colorsSecondary = getColors("./public/assets/colorsSecondary.svg")

                let secondary=colorsSecondary.fills.map(color => color.hex())
                let primary=colorsPrimary.fills.map(color => color.hex())
                let primaryStrokes=colorsPrimary.strokes.map(color => color.hex())

                let colors={}
                Object.keys(colorList).map((key,index)=>{
                    colors[key]=[primary[index],primaryStrokes[index],secondary[index]]
                })

                // let response={
                //     primaryCount:colorsPrimary.fills.length,
                //     primaryStrokeCount:colorsPrimary.strokes.length,
                //     secondaryCount:colorsSecondary.fills.length,
                //     secondary:colorsSecondary.fills.map(color => color.hex()),
                //     primary:colorsPrimary.fills.map(color => color.hex()),
                //     primaryStrokes:colorsPrimary.strokes.map(color => color.hex())
                // }
                //84 is first level colors
                
                res.json(colors);
            } catch (e) {
                console.error(e);
                res.status(500).end(`Internal Error for :${method} /map/nodes`)
            }
            break; 
        default:
            res.setHeader('Allow',['GET'])
            res.status(405).end(`Not Allowed ${method}`)
    }
    
 };

 
let colorList={
    "Battledia:Event": "",
    "Battledia:Yellow": "",
    "Battledia:Purple": "", 
    "Cocoon": "",
    "Mag": "",
    "Teleporter": "",
    "Tower": "",
    "Trinitas": "",
    "Urgent Quest": "",
    "Gold Box": "",
    "Green Box": "",
    "Red Box": "",
    "Blizzardium": "",
    "Complex": "",
    "Dualomite": "",
    "Hexakite": "",
    "Infernium": "",
    "Monotite": "",
    "Pentalite": "",
    "PhotonChunk": "",
    "PhotonQuartz": "",
    "PhotonScale": "",
    "Tetracite": "",
    "Trinite": "",


    "Apple": "",
    "Clam": "",
    "Crab": "",
    "Banana": "",
    "Herb": "",
    "Lobster": "",
    "Mushroom": "",
    "Peach": "",
    "Tomato": "",
    "Pear": "",
    "Shell": "",
    "Turnip": "",




    "Carambola": "",
    "Cauliflower": "",
    "Cherry": "",
    "Cranberries": "",
    "Eggplant": "",
    "Hermit Crab": "",
    "Mango": "",
    "Seaslug": "",
    "Retem Mushroom": "",
    "Scallop": "",
    "Sea Urchin": "",
    "Strawberry": "",


    "Akebia": "",
    "Cabbage": "",
    "Carrot": "",
    "Crayfish": "",
    "Guava": "",
    "Kvaris Mushroom": "",
    "Notable Persimmon": "",
    "Notable Squid": "",
    "Octopus": "",
    "Onion": "",
    "Persimmon": "",
    "Plum": "",
    "Snail": "",
    "Squid": "",


    "Stia Apple": "",
    "Stia Banana": "",
    "Stia Cabbage": "",
    "Stia Cauliflower": "",
    "Stia Hermit Crab": "",
    "Famous Carambola": "",
    "Famous Crab": "",
    "Famous Mushroom": "",
    "Stia Herb": "",
    "Stia Mango": "",
    "Stia Octopus": "",
    "Stia Plum": "",
    "Stia Sea Slug": "",
    "Stia Turban Shell": "",
    "Stia Tomato": "",

    "Alpha Reactor": "",
    "Snoal": "",
    "Stellar Fragment": "",
    "Ancient": "",
    "Gigantix": "",
    "Veteran": "",
    "Data Pods": "",
}