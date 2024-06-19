/* eslint-disable react/prop-types */
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons/faBadgeCheck';
import { faBoneBreak } from '@fortawesome/pro-solid-svg-icons/faBoneBreak';
import { faCalendar } from '@fortawesome/pro-solid-svg-icons/faCalendar';
import { faHourglass } from '@fortawesome/pro-solid-svg-icons/faHourglass';
import { faSkeleton } from '@fortawesome/pro-solid-svg-icons/faSkeleton';
import dayjs from 'lib/dayjs';
import React, { useCallback } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import Icon from '../common/Icon';

export default function InjuryCard({ injury }) {
  const onRecovered = useCallback(() => {
    // TODO: Mark injury recovered
  }, []);

  return (
    <Card>
      <Card.Header className="flex justify-between" color={injury.recovered ? 'success' : 'light'}>
        {injury.diagnosis.diagnosis}
        {injury.estimated_recovery_time > 0 && (
          <p className="flex text-sm text-green-500">
            <Icon icon={faHourglass} className="mr-1.5" />
            Estimated recovery in {injury.estimated_recovery_time} days
          </p>
        )}
      </Card.Header>
      <Card.Body>
        <p className="text-sm">{injury.diagnosis.treatment}</p>
        {injury.diagnosis.tear && (
          <div className="flex">
            <Icon icon={faBoneBreak} className="mr-1.5" />
            <p>Tear present</p>
          </div>
        )}
        {injury.joint && (
          <div className="flex">
            <Icon icon={faSkeleton} className="mr-1.5" />
            <p className="text-capitalize">{injury.side} {injury.joint} injury</p>
          </div>
        )}
        {injury.injured_at && (
          <div className="flex">
            <Icon icon={faCalendar} className="mr-1.5" />
            <p className="text-capitalize">Injured at {dayjs(injury.injured_at).format('ll')}</p>
          </div>
        )}
      </Card.Body>
      {!injury.recovered && (
        <Card.Footer>
          <Button icon={faBadgeCheck} onClick={onRecovered}>Recovered</Button>
        </Card.Footer>
      )}
    </Card>
  );
}
