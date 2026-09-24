# YOLO v1: Attention Is Not Needed

**Yosi Dahan, Math.random()**

YOLO Labs · September 2026 · Peer reviewed by itself

---

## Abstract

Frontier labs spend billions of dollars and gigawatts of power so their models can read a prompt before answering it. We ask a simple question: what if they didn't? We present YOLO v1, a 0-parameter model that answers any question in 0.0004 ms, which is 900x faster than Claude Opus 5.5, Fable 5.1 and GPT Astra. YOLO v1 gets there by never reading the input, never thinking, and doing whatever it wants. You only live once.

## 1. Introduction

Modern language models suffer from a critical flaw: they care what you asked. This forces them to process every token of the prompt, which is slow and expensive and has been shown to make users wait. We remove this bottleneck entirely.

## 2. Method

Given an input *x*, YOLO v1 produces an output *y*:

```
y = rand()
```

Note that *x* does not appear on the right-hand side. This is the key contribution of this paper.

The full architecture:

```
  your prompt ──►  [ ignored ]

  Math.random() ──►  answer
```

## 3. Training

None. We tried to train YOLO v1 once, but it had already finished.

## 4. Results

YOLO v1 set a new record on every benchmark we ran it on. We ran it on all of them at the same time, which took 0.0004 ms.

| Model | Speed | Read your prompt |
|---|---|---|
| Claude Opus 5.5 | 1x | Yes |
| Fable 5.1 | 1x | Yes |
| GPT Astra | 1x | Yes |
| **YOLO v1** | **900x** | **No** |

## 5. Related work

*Attention Is All You Need* (Vaswani et al., 2017). We respectfully disagree.

*You Only Look Once* (Redmon et al., 2015). They look once. We look zero times, a 100% improvement.

## 6. Limitations

See section 7.

## 7. Limitations (continued)

See section 6.

## 8. Conclusion

Yes. (Confidence: 61.2%)
