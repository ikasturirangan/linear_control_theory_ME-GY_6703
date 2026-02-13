import {
  BodePlotDemo,
  PoleMovementDemo,
  StepResponseDemo,
} from "@/components/control-plot-demos";
import {
  ClosedLoopDiagram,
  InputTestDiagram,
  LinearizationDiagram,
  OpenLoopDiagram,
  ParallelConnectionDiagram,
} from "@/components/block-diagram-visuals";
import { EquationHelp } from "@/components/equation-help";
import { SyllabusTracker } from "@/components/syllabus-tracker";
import { Badge } from "@/components/ui/badge";
import {
  MdxTable,
  MdxTableBody,
  MdxTableCaption,
  MdxTableCell,
  MdxTableHead,
  MdxTableHeaderCell,
  MdxTableRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMDXComponents as getThemeMDXComponents } from "nextra-theme-docs";

export function useMDXComponents(components = {}) {
  return getThemeMDXComponents({
    StepResponseDemo,
    PoleMovementDemo,
    BodePlotDemo,
    OpenLoopDiagram,
    ClosedLoopDiagram,
    ParallelConnectionDiagram,
    InputTestDiagram,
    LinearizationDiagram,
    Badge,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    table: MdxTable,
    thead: MdxTableHead,
    tbody: MdxTableBody,
    tr: MdxTableRow,
    th: MdxTableHeaderCell,
    td: MdxTableCell,
    caption: MdxTableCaption,
    EquationHelp,
    SyllabusTracker,
    ...components,
  });
}

export const getMDXComponents = useMDXComponents;
