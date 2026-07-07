import React from 'react';
import { Inbox } from 'lucide-react';
import { EmptyDescription, EmptyIcon, EmptyRoot, EmptyTitle } from './styles';

type EmptyProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

export default function Empty({ title, description, icon }: EmptyProps) {
  return (
    <EmptyRoot>
      <EmptyIcon>{icon || <Inbox size={20} />}</EmptyIcon>
      <EmptyTitle>{title}</EmptyTitle>
      {description && <EmptyDescription>{description}</EmptyDescription>}
    </EmptyRoot>
  );
}
