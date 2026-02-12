import {
  BodePlotDemo,
  PoleMovementDemo,
  StepResponseDemo,
} from "@/components/control-plot-demos";
import { EquationHelp } from "@/components/equation-help";
import { SyllabusTracker } from "@/components/syllabus-tracker";
import { useMDXComponents as getThemeMDXComponents } from "nextra-theme-docs";

export function useMDXComponents(components = {}) {
  return getThemeMDXComponents({
    StepResponseDemo,
    PoleMovementDemo,
    BodePlotDemo,
    EquationHelp,
    SyllabusTracker,
    ...components,
  });
}

export const getMDXComponents = useMDXComponents;
