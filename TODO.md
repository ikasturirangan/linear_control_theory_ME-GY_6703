# Linear Control Theory Docs - Learning-Centered TODO

This backlog is only about **content quality** and **ease of learning** for beginners.

## 1) Make Every Chapter Beginner-Safe

- [ ] Ensure every chapter has this fixed structure:
  - `Learning Outcomes`
  - `Glossary`
  - `Explanation`
  - `Worked Example`
  - `Common Mistakes`
  - `Detailed Review`
  - `Assignments`
- [ ] Add a one-line “Why this matters” at the top of every chapter.
- [ ] Add “What you should already know” prerequisites at the top of each chapter.
- [ ] Add “If this felt hard, review this first” links at the bottom of each chapter.

## 2) Reduce Cognitive Load

- [ ] Split long chapters into short learning chunks (5-10 minute reads).
- [ ] Use one notation style consistently across all pages (`r, y, e, u`, `s`, `z`, `x`).
- [ ] Add symbol reminders near equations so students do not scroll back.
- [ ] Replace dense paragraphs with short step-by-step derivation bullets.
- [ ] Add visual “Checkpoint” boxes every major section:
  - “Can you explain this in plain English?”
  - “Can you compute one small example?”

## 3) Strengthen Concept Connections

- [ ] Add explicit bridges between time-domain and frequency-domain ideas.
  - Step response ↔ damping ratio ↔ phase margin ↔ Nyquist distance to `-1`.
- [ ] Add one “same system, three views” example in each relevant module.
- [ ] Add a concept dependency map:
  - What must be understood before each syllabus week.
- [ ] Add “Common confusions between topics” section:
  - Routh vs Nyquist
  - TF vs state-space
  - Continuous vs discrete stability

## 4) Improve Mathematical Intuition

- [ ] Expand “Math Origins” pages with one fully worked derivation per module.
- [ ] Add “Assumptions behind the formula” under each important equation.
- [ ] Add “When this formula fails” notes (nonlinearity, delays, saturation, noise).
- [ ] Add physical interpretation lines after each final formula.
- [ ] Add dimensional/unit checks in derivation examples.

## 5) Practice Quality and Feedback

- [ ] Add 3 assignment levels per module:
  - Level A: direct formula use
  - Level B: interpretation and comparison
  - Level C: design/tuning reasoning
- [ ] Add answer keys with solution steps, not just final answers.
- [ ] Add mistake-based practice:
  - “Find and fix the wrong derivation.”
- [ ] Add mini oral-exam prompts:
  - “Explain this concept in 60 seconds.”
- [ ] Add end-of-week review sheets (formulas + intuition + traps).

## 6) Better Newcomer Onboarding

- [ ] Create a short “No Engineering Background” starter path.
- [ ] Add prerequisite micro-pages:
  - Complex numbers
  - Laplace basics
  - Differential equations basics
  - Matrix/rank basics
- [ ] Add “How to study this course” page:
  - Read -> derive -> practice -> self-explain -> review cycle.
- [ ] Add expected weekly study time and a realistic pace guide.

## 7) Diagram and Visual Learning Improvements

- [ ] Ensure every major concept has one clean diagram and one annotated version.
- [ ] Add disturbance path visualization wherever control loops are introduced.
- [ ] Add visual comparison pages:
  - Open-loop vs closed-loop
  - Stable vs marginal vs unstable
  - Fast vs robust tuning tradeoff
- [ ] Add one-page visual summaries per syllabus week.

## 8) Assessment Alignment (Course Success)

- [ ] Add “what professors typically ask” section per module.
- [ ] Tag each assignment with skills tested:
  - derivation, interpretation, stability test, design choice.
- [ ] Add cumulative mixed-problem sets every 3 modules.
- [ ] Add a final capstone prep pack for inverted pendulum lab.

## Suggested Learning-First Execution Order

1. Chapter structure consistency + prerequisite links  
2. Math intuition and derivation improvements  
3. Practice sets with full solutions and mistake-based drills  
4. Concept bridges (Step/Bode/Nyquist, continuous/discrete, TF/state-space)  
5. Onboarding path and weekly summary sheets  
