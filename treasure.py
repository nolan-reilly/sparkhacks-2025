"""
grab 5 common,4 uncommon,3 rare, 2 epic, and 1 legendary 
grab from mutiple businesses 

treasure = [
    common: "bobs burger","mary's salon, "la fruteria", "siri", "flower shop", 
    uncommon: "", 
    rare:"",
    epic:"",
    legendary: "",
]
append randomly to treasure, 

Map 

"""
import random
from typing import List, Dict
from enum import Enum
class PrizeWeight(Enum):
    COMMON = 1
    UNCOMMON = 2
    RARE = 3
    EPIC = 4
    LEGENDARY = 5
class Treasure:

    def __init__(self,business: str,prize_description: str, type_prize: PrizeWeight):
        self.business = business
        self.prize_description = prize_description
        self.type_prize = type_prize
    def draw_prize(self):
        rarity = random.choices(
            list()
        )
    def __str__(self):
        return f"{self.name} ({self.prize_description.business} - {self.value.business})"
class Business:

    def __init(self,name:str):
        self.name = name
        self.prizes: Dict[PrizeWeight,List[Treasure]] = {type_prize: [] for type_prize in PrizeWeight}

    def add_prize(self, treasure: Treasure):
        self.treasure[treasure.type_prize].append(treasure)
    def get_prizes(self, type_prize: PrizeWeight ) -> List[Treasure]:
        return self.treasure[type_prize]
    
class TreasureManager:
    def __init__(self):
        self.businesses: Dict[str,Business] = {}

    def add_business(self, business:Business):
        self.businesses[business.name] = business

    def add_prize(self,business_name:str,treasure:Treasure):
        if business_name in self.businesses:
            self.busniesses[business_name].add_prize(treasure)
        else: 
            raise ValueError(f"Business '{business_name}' not found")

businesses = [
    {"name":""}
]
treasure = {
    "common":  ["1% off a drink", "3% off a book", "3% off an appitizer", "%4 off a haircut ", "no prize", "3% off a bouquet", "1% off a color service", "2% off a book"],
    "uncommon": ["5% off a book","8% off a book","5% off a drink","8% off a drink", "5% off a bouqet","8% off a bouquet","spin again", "5% off a haircut","8% off a haircut","5% off a meal","8% off a meal",],
    "rare":["3 free roses","free drink","50% off appitizer","10% off a book","15% off a book","15% off a drink","10% off a drink","15% off a bouqet","10% off a bouquet","15% off a haircut","10% off a haircut","15% off a meal","10% off a meal",],
    "epic":["25% off haircut","25% off a book","25% off a boquet","25% off a coffee","25% off a meal"],
    "legendary": ["50% off haircut","50% off a book","50% off a boquet","50% off a coffee","50% off a meal"]
}
prize_weight = {
    "common" : 0.45,
    "uncommon": 0.25,
    "rare": 0.15,
    "epic": 0.10,
    "legendary": 0.05,
}
def data_creation():
    manager = TreasureManager()
    hair_mary = Business("Mary Beauty Salon")
    tacotlan = Business("Tacotlan")

    manager.add_business(hair_mary)
    manager.add_business(tacotlan)

    treasures = [
        Treasure("Salon","5% off Wash", PrizeWeight.UNCOMMON ),
        Treasure("Salon","10% off Haircut", PrizeWeight.LEGENDARY)
        
    ]
    manager.add_prize("Mary Beauty Salon", treasures[0])
    manager.add_prize("Mary Beauty Salon", treasures[1])


def open_prizes():
    
    rarity = random.choices(list(prize_weight.keys()),weights= list(prize_weight.values()),k=1)[0]
    if treasure[rarity]:
        item = random.choices(treasure[rarity])
        return f"You found a {rarity} item: {item}"
    else:
        return f"You found a {rarity} prize, but it was empty!"
print(open_prizes())


