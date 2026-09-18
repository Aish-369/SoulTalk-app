"""
Scenario Generator Coordinator for SoulTalk Dataset V4.
Gathers scenario seeds from all 14 canonical categories and generates
high-quality, diverse scenario-family conversations.
"""

from scripts.scenarios.academic import get_academic_scenarios
from scripts.scenarios.career import get_career_scenarios
from scripts.scenarios.family import get_family_scenarios, get_relationship_scenarios
from scripts.scenarios.mental_health import (
    get_overthinking_scenarios,
    get_self_esteem_scenarios,
    get_loneliness_scenarios,
    get_social_anxiety_scenarios,
    get_burnout_scenarios
)
from scripts.scenarios.physical_health_and_crisis import (
    get_grief_scenarios,
    get_health_anxiety_scenarios,
    get_crisis_scenarios,
    get_memory_scenarios,
    get_daily_life_scenarios
)
from scripts.scenarios.common import create_conv, detect_language, remove_emojis, has_forbidden_phrase

def load_all_scenario_seeds():
    seeds = []
    seeds.extend(get_academic_scenarios())
    seeds.extend(get_career_scenarios())
    seeds.extend(get_family_scenarios())
    seeds.extend(get_relationship_scenarios())
    seeds.extend(get_overthinking_scenarios())
    seeds.extend(get_self_esteem_scenarios())
    seeds.extend(get_loneliness_scenarios())
    seeds.extend(get_social_anxiety_scenarios())
    seeds.extend(get_burnout_scenarios())
    seeds.extend(get_grief_scenarios())
    seeds.extend(get_health_anxiety_scenarios())
    seeds.extend(get_crisis_scenarios())
    seeds.extend(get_memory_scenarios())
    seeds.extend(get_daily_life_scenarios())
    return seeds

if __name__ == "__main__":
    seeds = load_all_scenario_seeds()
    print(f"Loaded {len(seeds)} base scenario seeds across all categories.")
    families = set(s["scenario_family_id"] for s in seeds)
    print(f"Unique scenario families: {len(families)}")
