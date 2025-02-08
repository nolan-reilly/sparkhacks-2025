import random
import json
import os

# Define businesses (must match JavaScript names exactly)
businesses = ["The Restaurant", "The Flower Company", "Salon", "Coffee Cup", "Books Galore"]

# Define prize tiers
treasure = {
    "common": ["1% off a drink", "3% off a drink", "4% off a drink", "1% off a book", "3% off a book", "4% off a book","1% off a meal", "3% off a meal", "4% off a meal", "1% off a hair service", "3% off a  hair service", "4% off a hair service", "1% off a  bouquet", "3% off a bouquet", "4% off a bouquet", "no prize"],
    "uncommon": ["5% off a drink","8% off a drink", "5% off a book", "8% off a book", "5% off a meal", "8% off a meal", "5% off a hair service", "8% off a  hair service", "5% off a  bouquet", "8% off a bouquet" ],
    "rare": ["15% off a drink", "10% off a drink", "15% off a book", "10% off a book", "15% off a meal", "10% off a meal", "15% off a hair service", "10% off a  hair service", "15% off a  bouquet", "10% off a bouquet" ],
    "epic": ["25% off a drink", "25% off a book", "25% off a meal", "25% off a hair service", "25% off a  bouquet" ],
    "legendary": ["50% off a drink", "50% off a book", "50% off a meal", "50% off a hair service", "50% off a  bouquet"]
}

prize_weight = {
    "common": 0.55,
    "uncommon": 0.20,
    "rare": 0.15,
    "epic": 0.095,
    "legendary": 0.005
}
specific_prizes = {
    "Salon": ["1% off a hair service","3% off a hair service","4% off a hair service","5% off a hair service","8% off a hair service","10% off a hair service","15% off a hair service","25% off a hair service","50% off a hair service"],
    "Coffee Cup": ["1% off a drink","3% off a drink","4% off a drink","5% off a drink","8% off a drink","10% off a drink","15% off a drink","25% off a drink","50% off a drink",],
    "Books Galore": ["1% off a book","3% off a book","4% off a book","5% off a book","8% off a book","10% off a book","15% off a book","25% off a book","50% off a book"],
    "The Flower Company": ["1% off a  bouquet","3% off a  bouquet","4% off a  bouquet","5% off a  bouquet","8% off a  bouquet","10% off a  bouquet","15% off a  bouquet","25% off a  bouquet","50% off a  bouquet",],
    "The Restaurant": ["1% off a meal","3% off a meal","4% off a meal","5% off a meal","8% off a meal","10% off a meal","15% off a meal","25% off a meal","50% off a meal",]
}

# File path for storing prizes
json_file_path = "prizes.json"

def load_existing_prizes():
    """Load existing prizes from JSON file if it exists."""
    if os.path.exists(json_file_path):
        with open(json_file_path, "r") as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return {}  # Return an empty dictionary if file is corrupted
    return {}

def add_single_prize():
    """Randomly selects one business and adds a new prize to it."""
    prize_data = load_existing_prizes()

    # Randomly pick one business
    chosen_business = random.choice(businesses)

    # Ensure the business key exists
    
    if chosen_business not in prize_data:
        prize_data[chosen_business] = {"prizes": []}
    if chosen_business in specific_prizes:

        # Choose a specific prize tied to the business
        prize = random.choice(specific_prizes[chosen_business])
        # Find the rarity category of the chosen prize
        rarity = next((r for r, prizes in treasure.items() if prize in prizes), None)
    else:

    # Select a new prize
     rarity = random.choices(list(prize_weight.keys()), weights=prize_weight.values(), k=1)[0]
     prize = random.choice(treasure[rarity])



    if rarity == "common" and prize == "no prize":
        print(f"Skipped adding 'no proze' to {chosen_business}.")
        return

    # Append the new prize to the selected business
    prize_data[chosen_business]["prizes"].append({"rarity": rarity, "prize": prize})

    # Save updated data back to JSON file
    with open(json_file_path, "w") as json_file:
        json.dump(prize_data, json_file, indent=4)

    return rarity,businesses
    # print(f"Added a new {rarity} prize to {chosen_business}: {prize}")

add_single_prize()
