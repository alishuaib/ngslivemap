import os

c_dir=os.path.dirname(os.path.realpath(__file__))
listf=[x for x in os.listdir(c_dir) if not x.endswith('.py')]
print(listf)
renamef=[x.split('NGSUI')[1].replace('Enemy','') for x in listf]

for x,y in zip(listf,renamef):
    os.rename(c_dir+"\\"+x,c_dir+"\\"+y)