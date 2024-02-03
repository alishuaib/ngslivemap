import json
from pathlib import Path
import os
import re

global main_dir
main_dir=Path(os.path.dirname(os.path.realpath(__file__))) 
sub_dir=[x[0] for x in os.walk(main_dir)]

sub_dir.pop(0)

parsed={}
for dir in sub_dir:
    compile=[]
    onlyfiles = [f for f in os.listdir(dir) if os.path.isfile(os.path.join(dir, f))]
    for file in onlyfiles:
        if not file.split('.')[-1]=='png': continue
        compile.append({
            "src": (dir.split('\\public')[-1]+"\\"+file).replace('\\','/'),
            "name": re.sub(r"(\w)([A-Z])", r"\1 \2", file.split('.')[0]),
            "drops": [],
            "notes": ""
        })
    parsed[dir.split('\\')[-1]]=compile

with open(main_dir/'enemy.json','w') as f:
    json.dump(parsed,f,indent=4)