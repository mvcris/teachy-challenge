import { PropsWithChildren, ReactNode } from 'react';

export function Table({ children, className }: PropsWithChildren<{className?: string}>) {
  return (
    <table className={className ?? 'table-auto w-full'}>
      {children}
    </table>
  );
}

export function TableHeader({ children }: PropsWithChildren) {
  return (
    <thead className="bg-gray-50 rounded-full border-solid border-gray-200 border">
      <tr className="">
        {children}
      </tr>
    </thead>
  );
}

export function TableHead({ children, className }: PropsWithChildren<{className?: string}>) {
  return (
    <th className={className ?? 'p-2 font-normal text-sm text-left'}>
      {' '}
      {children}
    </th>
  );
}

export function TableBody({ children, className }: PropsWithChildren<{className?: string}>) {
  return (
    <tbody className={className ?? 'bg-white border border-gray-200 border-solid'}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className }: PropsWithChildren<{className?: string}>) {
  return (
    <tr className={className ?? 'border-b border-solid border-gray-200'}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: {children?: ReactNode, className?: string}) {
  return (
    <td className={className ?? 'p-2 font-normal text-sm text-left'}>
      {children}
    </td>
  );
}
