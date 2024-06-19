/* eslint-disable react/prop-types */
import { faBoneBreak } from '@fortawesome/pro-solid-svg-icons/faBoneBreak';
import { faCalendar } from '@fortawesome/pro-solid-svg-icons/faCalendar';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import clsx from 'clsx';
import dayjs from 'lib/dayjs';
import React from 'react';
import useUser from '../../hooks/useUser';
import Card from '../common/Card';
import Icon from '../common/Icon';
import Link from '../common/Link';

export default function NoteCard({ note }) {
  const user = useUser();

  return (
    <Card>
      <Card.Header className={clsx('flex justify-between', { 'opacity-70': note.subject })}>
        {note.subject || 'No Subject'}
        <p className="text-sm opacity-70">{dayjs(note.created).format('MM/DD/YYYY')}</p>
      </Card.Header>
      <Card.Body>
        <p className="text-sm">{note.body}</p>
        <hr />
        {note.visit && (
          <div className="flex">
            <Icon icon={faCalendar} className="mr-1.5" />
            <Link href={`/visits/${note.visit.id}`}>
              Visit on {dayjs(note.visit.date).format('ll')}
            </Link>
          </div>
        )}
        {note.injury && (
          <div className="flex">
            <Icon icon={faBoneBreak} className="mr-1.5" />
            <Link href={`/injuries/${note.injury.id}`}>
              {note.injury.diagnosis.diagnosis}
            </Link>
          </div>
        )}
        {user.practitioner && note.client && (
          <div className="flex">
            <Icon icon={faUser} className="mr-1.5" />
            <Link href={`/clients/${note.client.id}`}>
              {note.client.name}
            </Link>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
