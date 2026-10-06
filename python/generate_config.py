"""Generate the Casino Imperial gameplay configuration using only the stdlib."""

import json
from pathlib import Path
from typing import Any


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


CONFIGS: dict[str, dict[str, Any]] = {
    "properties": {
        "properties": [
            {
                "id": "studio_zizkov",
                "name": "Garsonka na Žižkově",
                "description": "Skromné, ale útulné bydlení s místem pro odpočinek.",
                "price": 58000,
                "daily_income": 850,
                "daily_upkeep": 250,
                "living_cost_reduction": 350,
            },
            {
                "id": "penthouse_river",
                "name": "Penthouse u řeky",
                "description": "Luxusní byt s výhledem a příjmem z krátkodobých pronájmů.",
                "price": 185000,
                "daily_income": 2600,
                "daily_upkeep": 650,
                "living_cost_reduction": 650,
            },
        ]
    },
    "vehicles": {
        "vehicles": [
            {
                "id": "city_scooter",
                "name": "Městský skútr",
                "description": "Levný dopravní prostředek pro rychlé zakázky po městě.",
                "price": 32000,
                "daily_upkeep": 180,
                "daily_work_bonus": 800,
                "unlocks": ["courier"],
            },
            {
                "id": "delivery_van",
                "name": "Dodávka Imperial",
                "description": "Spolehlivá dodávka pro rozvoz i vlastní podnikání.",
                "price": 76000,
                "daily_upkeep": 480,
                "daily_work_bonus": 1650,
                "unlocks": ["courier", "delivery"],
            },
        ]
    },
    "businesses": {
        "businesses": [
            {
                "id": "night_food_truck",
                "name": "Noční bistro Imperial",
                "description": "Oblíbené občerstvení u kasina, otevřené dlouho do noci.",
                "price": 92000,
                "daily_revenue": 4700,
                "daily_cost": 2700,
                "required_vehicle_id": "delivery_van",
                "required_property_id": None,
            },
            {
                "id": "riverside_cafe",
                "name": "Kavárna U řeky",
                "description": "Zavedená kavárna pro hosty kasina i místní obyvatele.",
                "price": 168000,
                "daily_revenue": 6900,
                "daily_cost": 3850,
                "required_vehicle_id": None,
                "required_property_id": "studio_zizkov",
            },
        ]
    },
    "economy": {
        "currency": "Kč",
        "starting_cash": 24000,
        "base_daily_income": 4200,
        "daily_living_cost": 1600,
        "purchase_order": ["vehicles", "properties", "businesses"],
        "purchase_cash_reserve": 6000,
        "description": "Denní práce, majetek a provozní náklady tvoří základ ekonomiky.",
    },
    "vip": {
        "tiers": [
            {
                "id": "silver",
                "name": "VIP Silver",
                "price": 15000,
                "duration_days": 7,
                "daily_income_bonus": 450,
                "mission_reward_multiplier": 1.1,
                "description": "Přednostní servis a vyšší odměny za zakázky na týden.",
            },
            {
                "id": "gold",
                "name": "VIP Gold",
                "price": 42000,
                "duration_days": 14,
                "daily_income_bonus": 950,
                "mission_reward_multiplier": 1.25,
                "description": "Prémiové výhody a výrazně vyšší odměny na dva týdny.",
            },
        ]
    },
    "missions": {
        "missions": [
            {
                "id": "first_shift",
                "name": "První směna",
                "description": "Odpracuj svůj první den v Imperial City.",
                "reward": 4500,
                "min_day": 1,
                "required_vehicle_id": None,
                "required_business_id": None,
                "required_property_id": None,
            },
            {
                "id": "city_courier",
                "name": "Kurýr v ulicích",
                "description": "Pořiď si skútr a dokonči kurýrní zakázku.",
                "reward": 8500,
                "min_day": 2,
                "required_vehicle_id": "city_scooter",
                "required_business_id": None,
                "required_property_id": None,
            },
            {
                "id": "a_place_of_my_own",
                "name": "Vlastní zázemí",
                "description": "Kup si garsonku a zajisti si stabilní zázemí.",
                "reward": 11000,
                "min_day": 4,
                "required_vehicle_id": None,
                "required_business_id": None,
                "required_property_id": "studio_zizkov",
            },
            {
                "id": "open_for_business",
                "name": "Otevřeno!",
                "description": "Rozjeď vlastní podnikání s dodávkou Imperial.",
                "reward": 22000,
                "min_day": 6,
                "required_vehicle_id": "delivery_van",
                "required_business_id": "night_food_truck",
                "required_property_id": None,
            },
            {
                "id": "city_tycoon",
                "name": "Král Imperial City",
                "description": "Vybuduj vlastní podnik a pořiď si luxusní penthouse.",
                "reward": 50000,
                "min_day": 12,
                "required_vehicle_id": None,
                "required_business_id": "riverside_cafe",
                "required_property_id": "penthouse_river",
            },
        ]
    },
}


def generate_configs(output_dir: Path = DATA_DIR) -> list[Path]:
    """Write all six JSON configuration files and return their paths."""
    output_dir.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    for name, config in CONFIGS.items():
        path = output_dir / f"{name}.json"
        path.write_text(
            json.dumps(config, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        written.append(path)
    return written


def main() -> None:
    for path in generate_configs():
        print(f"Vytvořeno: {path}")


if __name__ == "__main__":
    main()
