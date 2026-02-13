# Linear Control Theory Docs - Learning-Centered TODO

This backlog is only about **content quality** and **ease of learning** for beginners.

## 1) Make Every Chapter Beginner-Safe

- [x] Ensure every chapter has this fixed structure:
  - `Learning Outcomes`
  - `Glossary`
  - `Explanation`
  - `Worked Example`
  - `Common Mistakes`
  - `Detailed Review`
  - `Assignments`
- [x] Add a one-line “Why this matters” at the top of every chapter.
- [x] Add “What you should already know” prerequisites at the top of each chapter.
- [x] Add “If this felt hard, review this first” links at the bottom of each chapter.

## 2) Reduce Cognitive Load

- [ ] Split long chapters into short learning chunks (5-10 minute reads).
- [ ] Use one notation style consistently across all pages (`r, y, e, u`, `s`, `z`, `x`).
- [ ] Add symbol reminders near equations so students do not scroll back.
- [ ] Replace dense paragraphs with short step-by-step derivation bullets.
- [ ] Add visual “Checkpoint” boxes every major section:
  - “Can you explain this in plain English?”
  - “Can you compute one small example?”

## 3) Strengthen Concept Connections

- [x] Add explicit bridges between time-domain and frequency-domain ideas.
  - Step response ↔ damping ratio ↔ phase margin ↔ Nyquist distance to `-1`.
- [x] Add one “same system, three views” example in each relevant module.
- [x] Add a concept dependency map:
  - What must be understood before each syllabus week.
- [x] Add “Common confusions between topics” section:
  - Routh vs Nyquist
  - TF vs state-space
  - Continuous vs discrete stability

## 4) Improve Mathematical Intuition

- [x] Expand “Math Origins” pages with one fully worked derivation per module.
- [x] Add “Assumptions behind the formula” under each important equation.
- [x] Add “When this formula fails” notes (nonlinearity, delays, saturation, noise).
- [x] Add physical interpretation lines after each final formula.
- [x] Add dimensional/unit checks in derivation examples.

## 5) Practice Quality and Feedback

- [x] Add 3 assignment levels per module:
  - Level A: direct formula use
  - Level B: interpretation and comparison
  - Level C: design/tuning reasoning
- [x] Add answer keys with solution steps, not just final answers.
- [x] Add mistake-based practice:
  - “Find and fix the wrong derivation.”
- [x] Add mini oral-exam prompts:
  - “Explain this concept in 60 seconds.”
- [x] Add end-of-week review sheets (formulas + intuition + traps).

## 6) Better Newcomer Onboarding

- [x] Create a short “No Engineering Background” starter path.
- [x] Add prerequisite micro-pages:
  - Complex numbers
  - Laplace basics
  - Differential equations basics
  - Matrix/rank basics
- [x] Add “How to study this course” page:
  - Read -> derive -> practice -> self-explain -> review cycle.
- [x] Add expected weekly study time and a realistic pace guide.

## 7) Diagram and Visual Learning Improvements

- [ ] Ensure every major concept has one clean diagram and one annotated version.
- [ ] Add disturbance path visualization wherever control loops are introduced.
- [x] Add visual comparison pages:
  - Open-loop vs closed-loop
  - Stable vs marginal vs unstable
  - Fast vs robust tuning tradeoff
- [ ] Add one-page visual summaries per syllabus week.

## 8) Assessment Alignment (Course Success)

- [x] Add “what professors typically ask” section per module.
- [x] Tag each assignment with skills tested:
  - derivation, interpretation, stability test, design choice.
- [x] Add cumulative mixed-problem sets every 3 modules.
- [x] Add a final capstone prep pack for inverted pendulum lab.

## Suggested Learning-First Execution Order

1. Chapter structure consistency + prerequisite links  
2. Math intuition and derivation improvements  
3. Practice sets with full solutions and mistake-based drills  
4. Concept bridges (Step/Bode/Nyquist, continuous/discrete, TF/state-space)  
5. Onboarding path and weekly summary sheets  
