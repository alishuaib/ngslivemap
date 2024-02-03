import requests

raw="""https://pso2na.arks-visiphone.com/images/thumb/6/69/UIEnemyBirdoth.png/192px-UIEnemyBirdoth.png
https://pso2na.arks-visiphone.com/images/thumb/9/9c/UIEnemyDian.png/192px-UIEnemyDian.png
https://pso2na.arks-visiphone.com/images/thumb/3/31/UIEnemyFrango.png/192px-UIEnemyFrango.png
https://pso2na.arks-visiphone.com/images/thumb/6/6b/UIEnemyMooBell.png/192px-UIEnemyMooBell.png
https://pso2na.arks-visiphone.com/images/thumb/c/c3/UIEnemyMoony.png/192px-UIEnemyMoony.png
https://pso2na.arks-visiphone.com/images/thumb/d/da/UIEnemyNoxxi.png/192px-UIEnemyNoxxi.png
https://pso2na.arks-visiphone.com/images/thumb/5/54/UIEnemyOtarica.png/192px-UIEnemyOtarica.png
https://pso2na.arks-visiphone.com/images/thumb/5/57/UIEnemyPatt.png/192px-UIEnemyPatt.png
https://pso2na.arks-visiphone.com/images/thumb/6/6c/UIEnemySunny.png/192px-UIEnemySunny.png
https://pso2na.arks-visiphone.com/images/thumb/7/7a/UIEnemyTauBell.png/192px-UIEnemyTauBell.png
https://pso2na.arks-visiphone.com/images/thumb/a/a8/UIEnemyVoks.png/192px-UIEnemyVoks.png
"""

links=raw.split('\n')
print(f"Downloading {len(links)} images")
counter=0
for l in links:
    with open(f'{l.split("/")[-1].replace("192px-UI","").replace("Enemy","")}','wb') as f:
        content=requests.get(l).content
        f.write(content)
        counter+=1
print("Download Complete!")
