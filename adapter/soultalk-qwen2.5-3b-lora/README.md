# SoulTalk LoRA Adapter Specification

## Base Model
- **Identifier:** `Qwen/Qwen2.5-3B-Instruct`
- **Architecture:** Qwen 2.5 Transformer
- **Quantization Format:** Q4_K_M (GGUF) / 4-bit NormalFloat (QLoRA)
- **Chat Template:** Standard Qwen ChatML:
  ```text
  <|im_start|>system
  {system_prompt}<|im_end|>
  <|im_start|>user
  {user_message}<|im_end|>
  <|im_start|>assistant
  {assistant_response}<|im_end|>
  ```

## LoRA Hyperparameters
- **Rank (r):** 16
- **Alpha:** 32
- **Dropout:** 0.05
- **Target Modules:** q_proj, k_proj, v_proj, o_proj, gate_proj, up_proj, down_proj
- **Sequence Length:** 1024
- **Learning Rate:** 0.0002
- **Epochs:** 3
- **Batch Size:** 4 (Effective Batch Size: 16)

## Dataset Splits
- **Train Chains:** 304 (1,212 turns)
- **Validation Chains:** 38 (152 turns)
- **Test Chains:** 38 (152 turns)
- **Language Balance:** Roman Marathi (65%), Marathi-English Code Switch (20%), English (10%), Hindi (5%)
