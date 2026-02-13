"use client";

import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";

type TableProps = ComponentPropsWithoutRef<"table"> & {
  wrapperStyle?: CSSProperties;
};

type SectionProps = ComponentPropsWithoutRef<"thead">;
type BodyProps = ComponentPropsWithoutRef<"tbody">;
type RowProps = ComponentPropsWithoutRef<"tr">;
type CellProps = ComponentPropsWithoutRef<"th">;
type DataCellProps = ComponentPropsWithoutRef<"td">;
type CaptionProps = ComponentPropsWithoutRef<"caption">;

export function Table({
  children,
  style,
  wrapperStyle,
  ...props
}: TableProps) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 16,
        ...wrapperStyle,
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          ...style,
        }}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, style, ...props }: SectionProps) {
  return (
    <thead
      style={{
        background: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        ...style,
      }}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, ...props }: BodyProps) {
  return <tbody {...props}>{children}</tbody>;
}

export function TableRow({ children, style, ...props }: RowProps) {
  return (
    <tr
      style={{
        borderBottom: "1px solid #e2e8f0",
        ...style,
      }}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, style, ...props }: CellProps) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "0.7rem 0.85rem",
        color: "#0f172a",
        fontWeight: 700,
        ...style,
      }}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, style, ...props }: DataCellProps) {
  return (
    <td
      style={{
        padding: "0.7rem 0.85rem",
        color: "#0f172a",
        verticalAlign: "top",
        ...style,
      }}
      {...props}
    >
      {children}
    </td>
  );
}

export function TableCaption({ children, style, ...props }: CaptionProps) {
  return (
    <caption
      style={{
        captionSide: "bottom",
        color: "#475569",
        fontSize: 13,
        padding: "0.65rem 0.35rem 0.35rem",
        ...style,
      }}
      {...props}
    >
      {children}
    </caption>
  );
}

export function MdxTable(props: ComponentPropsWithoutRef<"table">) {
  return <Table {...props} />;
}

export function MdxTableHead(props: ComponentPropsWithoutRef<"thead">) {
  return <TableHeader {...props} />;
}

export function MdxTableBody(props: ComponentPropsWithoutRef<"tbody">) {
  return <TableBody {...props} />;
}

export function MdxTableRow(props: ComponentPropsWithoutRef<"tr">) {
  return <TableRow {...props} />;
}

export function MdxTableHeaderCell(props: ComponentPropsWithoutRef<"th">) {
  return <TableHead {...props} />;
}

export function MdxTableCell(props: ComponentPropsWithoutRef<"td">) {
  return <TableCell {...props} />;
}

export function MdxTableCaption({
  children,
  ...props
}: ComponentPropsWithoutRef<"caption"> & { children?: ReactNode }) {
  return <TableCaption {...props}>{children}</TableCaption>;
}
