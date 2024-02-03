import requests

raw="""https://pso2na.arks-visiphone.com/images/thumb/f/f5/NGSUIEnemyAgnisLore.png/192px-NGSUIEnemyAgnisLore.png
https://pso2na.arks-visiphone.com/images/thumb/e/e5/NGSUIEnemyGaraGarongo.png/192px-NGSUIEnemyGaraGarongo.png
https://pso2na.arks-visiphone.com/images/thumb/1/1a/NGSUIEnemyGrulfLore.png/192px-NGSUIEnemyGrulfLore.png
https://pso2na.arks-visiphone.com/images/thumb/8/8c/NGSUIEnemyPhongrulfLore.png/192px-NGSUIEnemyPhongrulfLore.png
https://pso2na.arks-visiphone.com/images/thumb/3/38/NGSUIEnemyUdanLore.png/192px-NGSUIEnemyUdanLore.png
https://pso2na.arks-visiphone.com/images/thumb/9/90/NGSUIEnemyZaUdanLore.png/192px-NGSUIEnemyZaUdanLore.png
https://pso2na.arks-visiphone.com/images/thumb/2/29/NGSUIEnemyArdBanser.png/192px-NGSUIEnemyArdBanser.png
https://pso2na.arks-visiphone.com/images/thumb/1/18/NGSUIEnemyArdBanshee.png/192px-NGSUIEnemyArdBanshee.png
https://pso2na.arks-visiphone.com/images/thumb/b/b4/NGSUIEnemyThunderBanser.png/192px-NGSUIEnemyThunderBanser.png
https://pso2na.arks-visiphone.com/images/thumb/f/f8/NGSUIEnemyThunderBanshee.png/192px-NGSUIEnemyThunderBanshee.png
https://pso2na.arks-visiphone.com/images/thumb/7/75/NGSUIEnemyCragBear.png/192px-NGSUIEnemyCragBear.png

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
