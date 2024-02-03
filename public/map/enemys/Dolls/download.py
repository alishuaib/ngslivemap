import requests

raw="""https://pso2na.arks-visiphone.com/images/thumb/c/c7/NGSUIDotts.png/192px-NGSUIDotts.png
https://pso2na.arks-visiphone.com/images/thumb/f/fc/NGSUIFuwan.png/192px-NGSUIFuwan.png
https://pso2na.arks-visiphone.com/images/thumb/7/78/NGSUIGororon.png/192px-NGSUIGororon.png
https://pso2na.arks-visiphone.com/images/thumb/c/c5/NGSUIGororox.png/192px-NGSUIGororox.png
https://pso2na.arks-visiphone.com/images/thumb/2/2b/NGSUIPettasAxe.png/192px-NGSUIPettasAxe.png
https://pso2na.arks-visiphone.com/images/thumb/7/74/NGSUIPettasGun.png/192px-NGSUIPettasGun.png
https://pso2na.arks-visiphone.com/images/thumb/0/09/NGSUIPettasLauncher.png/192px-NGSUIPettasLauncher.png
https://pso2na.arks-visiphone.com/images/thumb/e/ef/NGSUIPettasSword.png/192px-NGSUIPettasSword.png
https://pso2na.arks-visiphone.com/images/thumb/8/87/NGSUIPettaxAxe.png/192px-NGSUIPettaxAxe.png
https://pso2na.arks-visiphone.com/images/thumb/e/e0/NGSUIPettaxGun.png/192px-NGSUIPettaxGun.png
https://pso2na.arks-visiphone.com/images/thumb/5/56/NGSUIPettaxLauncher.png/192px-NGSUIPettaxLauncher.png
https://pso2na.arks-visiphone.com/images/thumb/f/f5/NGSUIPettaxSword.png/192px-NGSUIPettaxSword.png
https://pso2na.arks-visiphone.com/images/thumb/2/21/NGSUITinos.png/192px-NGSUITinos.png
https://pso2na.arks-visiphone.com/images/thumb/7/79/NGSUIBujin.png/192px-NGSUIBujin.png
https://pso2na.arks-visiphone.com/images/thumb/1/17/NGSUIDaitylAxe.png/192px-NGSUIDaitylAxe.png
https://pso2na.arks-visiphone.com/images/thumb/2/22/NGSUIDaitylSword.png/192px-NGSUIDaitylSword.png
https://pso2na.arks-visiphone.com/images/thumb/5/52/NGSUINexAelio.png/192px-NGSUINexAelio.png
https://pso2na.arks-visiphone.com/images/thumb/c/c8/NGSUIVaras.png/192px-NGSUIVaras.png
https://pso2na.arks-visiphone.com/images/thumb/1/14/NGSUINogleth.png/192px-NGSUINogleth.png
https://pso2na.arks-visiphone.com/images/thumb/1/13/NGSUIOruq.png/192px-NGSUIOruq.png
https://pso2na.arks-visiphone.com/images/thumb/f/f0/NGSUINexVera.png/192px-NGSUINexVera.png
https://pso2na.arks-visiphone.com/images/thumb/1/13/NGSUIPettasVera.png/192px-NGSUIPettasVera.png
"""

links=raw.split('\n')
print(f"Downloading {len(links)} images")
counter=0
for l in links:
    with open(f'{l.split("/")[-1].replace("192px-NGSUI","")}','wb') as f:
        content=requests.get(l).content
        f.write(content)
        counter+=1
print("Download Complete!")
