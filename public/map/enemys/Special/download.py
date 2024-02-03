import requests

raw="""https://pso2na.arks-visiphone.com/images/thumb/2/22/NGSUIEnemyRappy.png/192px-NGSUIEnemyRappy.png
https://pso2na.arks-visiphone.com/images/thumb/c/c6/NGSUIEnemyCeremoRappy.png/192px-NGSUIEnemyCeremoRappy.png
"""

links=raw.split('\n')
print(f"Downloading {len(links)} images")
counter=0
for l in links:
    with open(f'{l.split("/")[-1].replace("192px-NGSUI","").replace("Enemy","")}','wb') as f:
        content=requests.get(l).content
        f.write(content)
        counter+=1
print("Download Complete!")
