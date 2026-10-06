"""Simulate Casino Imperial player progression and economy."""

import argparse
import json
from pathlib import Path
from typing import Any

try:
    from .generate_config import DATA_DIR, generate_configs
except ImportError:
    from generate_config import DATA_DIR, generate_configs


CONFIG_NAMES = ("properties", "vehicles", "businesses", "economy", "vip", "missions")


def load_configs(data_dir: Path = DATA_DIR, regenerate: bool = False) -> dict[str, Any]:
    """Load game data, generating the defaults if they are missing."""
    if regenerate or any(not (data_dir / f"{name}.json").is_file() for name in CONFIG_NAMES):
        generate_configs(data_dir)
    return {
        name: json.loads((data_dir / f"{name}.json").read_text(encoding="utf-8"))
        for name in CONFIG_NAMES
    }


def simulate(days: int, configs: dict[str, Any], starting_cash: int | None = None) -> list[str]:
    """Run a deterministic, purchase-oriented progression simulation."""
    economy = configs["economy"]
    cash = economy["starting_cash"] if starting_cash is None else starting_cash
    reserve = economy["purchase_cash_reserve"]
    vehicles = {item["id"]: item for item in configs["vehicles"]["vehicles"]}
    properties = {item["id"]: item for item in configs["properties"]["properties"]}
    businesses = {item["id"]: item for item in configs["businesses"]["businesses"]}
    owned_vehicles: set[str] = set()
    owned_properties: set[str] = set()
    owned_businesses: set[str] = set()
    completed_missions: set[str] = set()
    vip_tier: dict[str, Any] | None = None
    vip_days_left = 0
    log: list[str] = []

    def asset_is_available(category: str, item: dict[str, Any]) -> bool:
        if category == "vehicles":
            return item["id"] not in owned_vehicles
        if category == "properties":
            return item["id"] not in owned_properties
        return (
            item["id"] not in owned_businesses
            and (item["required_vehicle_id"] is None or item["required_vehicle_id"] in owned_vehicles)
            and (item["required_property_id"] is None or item["required_property_id"] in owned_properties)
        )

    for day in range(1, days + 1):
        if vip_days_left == 0:
            vip_tier = None
        vehicle_bonus = sum(vehicles[item]["daily_work_bonus"] for item in owned_vehicles)
        daily_income = economy["base_daily_income"] + vehicle_bonus
        if vip_tier is not None:
            daily_income += vip_tier["daily_income_bonus"]
        property_income = sum(properties[item]["daily_income"] for item in owned_properties)
        property_upkeep = sum(properties[item]["daily_upkeep"] for item in owned_properties)
        business_profit = sum(
            businesses[item]["daily_revenue"] - businesses[item]["daily_cost"]
            for item in owned_businesses
        )
        vehicle_upkeep = sum(vehicles[item]["daily_upkeep"] for item in owned_vehicles)
        living_cost = max(
            0,
            economy["daily_living_cost"]
            - sum(properties[item]["living_cost_reduction"] for item in owned_properties),
        )
        daily_net = (
            daily_income + property_income + business_profit
            - vehicle_upkeep - property_upkeep - living_cost
        )
        cash += daily_net
        events = [f"denní bilance {daily_net:+,} Kč".replace(",", " ")]

        for mission in configs["missions"]["missions"]:
            if (
                mission["id"] not in completed_missions
                and day >= mission["min_day"]
                and (mission["required_vehicle_id"] is None or mission["required_vehicle_id"] in owned_vehicles)
                and (mission["required_business_id"] is None or mission["required_business_id"] in owned_businesses)
                and (mission["required_property_id"] is None or mission["required_property_id"] in owned_properties)
            ):
                multiplier = vip_tier["mission_reward_multiplier"] if vip_tier else 1
                reward = round(mission["reward"] * multiplier)
                cash += reward
                completed_missions.add(mission["id"])
                events.append(f"mise „{mission['name']}“ +{reward:,} Kč".replace(",", " "))

        if vip_tier is None:
            eligible_tiers = [
                tier for tier in configs["vip"]["tiers"]
                if cash >= tier["price"] + reserve
            ]
            if eligible_tiers:
                tier = max(eligible_tiers, key=lambda item: item["daily_income_bonus"])
                cash -= tier["price"]
                vip_tier = tier
                vip_days_left = tier["duration_days"]
                events.append(f"aktivováno {tier['name']} ({tier['price']:,} Kč)".replace(",", " "))

        for category in economy["purchase_order"]:
            catalog = {
                "vehicles": vehicles,
                "properties": properties,
                "businesses": businesses,
            }[category]
            purchasable = sorted(
                (
                    item for item in catalog.values()
                    if asset_is_available(category, item) and cash >= item["price"] + reserve
                ),
                key=lambda item: item["price"],
            )
            if purchasable:
                item = purchasable[0]
                cash -= item["price"]
                {
                    "vehicles": owned_vehicles,
                    "properties": owned_properties,
                    "businesses": owned_businesses,
                }[category].add(item["id"])
                events.append(f"koupeno: {item['name']} ({item['price']:,} Kč)".replace(",", " "))

        if vip_days_left > 0:
            vip_days_left -= 1
        detail = "; ".join(events)
        log.append(f"Den {day:>2}: {cash:>9,} Kč | {detail}".replace(",", " "))

    log.append(
        "Konec: "
        f"{cash:,} Kč | vozidla {len(owned_vehicles)}, nemovitosti {len(owned_properties)}, "
        f"podniky {len(owned_businesses)}, mise {len(completed_missions)}".replace(",", " ")
    )
    return log


def main() -> None:
    parser = argparse.ArgumentParser(description="Simulace ekonomiky a postupu hráče Casino Imperial.")
    parser.add_argument("--days", type=int, default=30, help="počet simulovaných dnů (výchozí: 30)")
    parser.add_argument("--cash", type=int, default=None, help="počáteční hotovost v Kč")
    parser.add_argument("--data-dir", type=Path, default=DATA_DIR, help="adresář s JSON konfigurací")
    parser.add_argument("--generate", action="store_true", help="před simulací znovu vytvořit konfiguraci")
    args = parser.parse_args()
    if args.days < 1:
        parser.error("--days musí být alespoň 1")
    if args.cash is not None and args.cash < 0:
        parser.error("--cash nesmí být záporná")
    configs = load_configs(args.data_dir, regenerate=args.generate)
    print(f"Simulace Casino Imperial: {args.days} dní")
    for line in simulate(args.days, configs, args.cash):
        print(line)


if __name__ == "__main__":
    main()
