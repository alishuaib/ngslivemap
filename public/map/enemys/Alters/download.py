import requests

raw="""https://pso2na.arks-visiphone.com/images/thumb/c/c3/NGSUIBanehog.png/192px-NGSUIBanehog.png
https://pso2na.arks-visiphone.com/images/thumb/0/04/NGSUIEnemyEvilAngelo.png/192px-NGSUIEnemyEvilAngelo.png
https://pso2na.arks-visiphone.com/images/thumb/7/76/NGSUIEnemyHeruc.png/192px-NGSUIEnemyHeruc.png
https://pso2na.arks-visiphone.com/images/thumb/f/f3/NGSUIEnemyLizardFray.png/192px-NGSUIEnemyLizardFray.png
https://pso2na.arks-visiphone.com/images/thumb/e/e4/NGSUIEnemyLizardIce.png/192px-NGSUIEnemyLizardIce.png
https://pso2na.arks-visiphone.com/images/thumb/1/1c/NGSUIEnemyLizardThunder.png/192px-NGSUIEnemyLizardThunder.png
https://pso2na.arks-visiphone.com/images/thumb/0/0e/NGSUIBiggFrogga.png/192px-NGSUIBiggFrogga.png
https://pso2na.arks-visiphone.com/images/thumb/4/4a/NGSUIChiacurio.png/192px-NGSUIChiacurio.png
https://pso2na.arks-visiphone.com/images/thumb/8/80/NGSUIEnemyEldiScythe.png/192px-NGSUIEnemyEldiScythe.png
https://pso2na.arks-visiphone.com/images/thumb/7/71/NGSUIEnemyWaulon.png/192px-NGSUIEnemyWaulon.png
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
