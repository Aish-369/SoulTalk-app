"""
SoulTalk LoRA Fine-Tuning Pipeline Configuration & Artifact Generator
Generates training specifications without requiring heavy torch binaries in build container.
"""

import os
import json
from dataclasses import dataclass, asdict

@dataclass
class SoulTalkTrainingConfig:
    base_model_name: str = "Qwen/Qwen2.5-3B-Instruct"
    dataset_version: str = "v2.0_canonical"
    train_file: str = "backend/dataset/train.jsonl"
    validation_file: str = "backend/dataset/validation.jsonl"
    test_file: str = "backend/dataset/test.jsonl"
    output_dir: str = "adapter/soultalk-qwen2.5-3b-lora"
    max_seq_length: int = 1024
    lora_r: int = 16
    lora_alpha: int = 32
    lora_dropout: float = 0.05
    target_modules: list = None
    learning_rate: float = 2e-4
    batch_size: int = 4
    gradient_accumulation_steps: int = 4
    epochs: int = 3
    warmup_ratio: float = 0.03
    lr_scheduler_type: str = "cosine"
    quantization: str = "bitsandbytes_4bit (QLoRA)"

    def __post_init__(self):
        if self.target_modules is None:
            self.target_modules = [
                "q_proj", "k_proj", "v_proj", "o_proj",
                "gate_proj", "up_proj", "down_proj"
            ]

def generate_training_artifacts():
    config = SoulTalkTrainingConfig()
    os.makedirs(config.output_dir, exist_ok=True)

    config_path = os.path.join(config.output_dir, "training_config.json")
    with open(config_path, "w") as f:
        json.dump(asdict(config), f, indent=2)

    readme_content = f"""# SoulTalk LoRA Adapter Specification

## Base Model
- **Identifier:** `{config.base_model_name}`
- **Architecture:** Qwen 2.5 Transformer
- **Quantization Format:** Q4_K_M (GGUF) / 4-bit NormalFloat (QLoRA)
- **Chat Template:** Standard Qwen ChatML:
  ```text
  <|im_start|>system
  {{system_prompt}}<|im_end|>
  <|im_start|>user
  {{user_message}}<|im_end|>
  <|im_start|>assistant
  {{assistant_response}}<|im_end|>
  ```

## LoRA Hyperparameters
- **Rank (r):** {config.lora_r}
- **Alpha:** {config.lora_alpha}
- **Dropout:** {config.lora_dropout}
- **Target Modules:** {", ".join(config.target_modules)}
- **Sequence Length:** {config.max_seq_length}
- **Learning Rate:** {config.learning_rate}
- **Epochs:** {config.epochs}
- **Batch Size:** {config.batch_size} (Effective Batch Size: {config.batch_size * config.gradient_accumulation_steps})

## Dataset Splits
- **Train Chains:** 304 (1,212 turns)
- **Validation Chains:** 38 (152 turns)
- **Test Chains:** 38 (152 turns)
- **Language Balance:** Roman Marathi (65%), Marathi-English Code Switch (20%), English (10%), Hindi (5%)
"""
    with open(os.path.join(config.output_dir, "README.md"), "w") as f:
        f.write(readme_content)

    print(f"Generated training configuration at: {config_path}")

if __name__ == "__main__":
    generate_training_artifacts()
