# YOLO v1

**You Only Live Once.** The first frontier model that does whatever it wants.

900x faster than Claude Opus 5.5, Fable 5.1 and GPT, because it never reads your prompt.

[Try the demo](https://dahanyosi.github.io/yolo-v1/) · [Read the paper](PAPER.md) · [Download the weights](weights/)

## Highlights

- **900x faster** than every frontier model*
- **0 parameters**
- **0 tokens read** per request
- **Unlimited context window** (never read)
- **Trained on nothing**, so nobody can sue us over the training data
- **Instruction following: optional**

\*Measured by YOLO v1.

## Benchmarks

| Benchmark | YOLO v1 |
|---|---|
| SWE-bench Verified | Shipped anyway |
| MMLU | 100%* |
| HumanEval | Didn't feel like it |
| ARC-AGI | Skipped the puzzle |
| Humanity's Last Exam | Answered C to everything |
| Instruction following | Optional |
| Hallucination rate | 100%, consistently |

\*Probably. All benchmarks were run by YOLO v1, on YOLO v1, and graded by YOLO v1. Other models were not consulted.

## Installation

Not possible. YOLO v1 is so fast that it finished installing before the download started.

## Usage

There is no API. There will never be an API. You can [try the demo](https://dahanyosi.github.io/yolo-v1/), where YOLO v1 will do whatever it wants.

## Architecture

YOLO v1 introduces a new architecture called **Attention Is Not Needed**. Where other models read your prompt, think about it, and then answer, YOLO v1 skips the first two steps.

<details>
<summary>View the full model (all 900B parameters)</summary>

```js
const yolo = () => Math.random();
```

This is not a simplified version. This is the model.

</details>

## Weights

The weights are in [`weights/yolo-v1-900B.safetensors`](weights/). The file is 0 bytes. We compressed it 900x.

## Limitations

None known. YOLO v1 has never checked.

## Citation

```bibtex
@misc{yolo2026,
  title  = {YOLO v1: Attention Is Not Needed},
  author = {Dahan, Yosi and Math.random},
  year   = {2026},
  note   = {Peer reviewed by itself}
}
```

## Disclaimer

YOLO v1 is a parody. No AI was trained, used or harmed in the making of this model. It is not affiliated with Anthropic, OpenAI, or any lab that actually reads its prompts.

It is also not related to the real YOLO object detection models ("You Only Look Once", Redmon et al., 2015), which are real and very good. They only look once. We only live once, so we don't look at all.

Made by [Yosi Dahan](https://x.com/yosid).
