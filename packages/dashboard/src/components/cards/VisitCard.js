/* eslint-disable react/prop-types */
import { faCalendar } from '@fortawesome/pro-solid-svg-icons/faCalendar';
import { faUserDoctor } from '@fortawesome/pro-solid-svg-icons/faUserDoctor';
import dayjs from 'lib/dayjs';
import React, { useCallback } from 'react';
import usePractice from '../../hooks/usePractice';
import useUser from '../../hooks/useUser';
import Button from '../common/Button';
import Card from '../common/Card';
import Icon from '../common/Icon';

const VISIT_COLORS = {
  upcoming: 'light',
  visited: 'success',
  canceled: 'warning',
  missed: 'danger',
};

export default function VisitCard({ visit }) {
  const user = useUser();
  const practice = usePractice();

  const onPractitionerLogin = useCallback(() => {
    // TODO: Write practitioner login
  }, []);

  return (
    <Card color={VISIT_COLORS[visit.status]}>
      <Card.Header className="flex justify-between">
        {visit.client.name} at {dayjs(visit.date).format('LT')}
        <p className="text-sm capitalize">{visit.status}</p>
      </Card.Header>
      <Card.Body>
        <div className="flex">
          <Icon icon={faCalendar} className="mr-1.5" />
          <p>{dayjs(visit.date).format('ll')}</p>
        </div>
        <div className="flex">
          <Icon icon={faUserDoctor} className="mr-1.5" />
          <p>{visit.practitioner.name}</p>
        </div>
      </Card.Body>
      {user.practitioner && visit.date < Date.now() && practice.practitioner_login_enabled && (
        <Card.Footer>
          <Button icon={faUserDoctor} onClick={onPractitionerLogin}>Login as {visit.practitioner.name}</Button>
        </Card.Footer>
      )}
    </Card>
  );
}
