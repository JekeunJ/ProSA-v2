/* eslint-disable react/prop-types */
import { faSparkles } from '@fortawesome/pro-regular-svg-icons/faSparkles';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons/faBadgeCheck';
import { faBoneBreak } from '@fortawesome/pro-solid-svg-icons/faBoneBreak';
import { faCalendar } from '@fortawesome/pro-solid-svg-icons/faCalendar';
import { faDumbbell } from '@fortawesome/pro-solid-svg-icons/faDumbbell';
import { faRepeat } from '@fortawesome/pro-solid-svg-icons/faRepeat';
import React, { useCallback } from 'react';
import useUser from '../../hooks/useUser';
import Button from '../common/Button';
import Card from '../common/Card';
import Icon from '../common/Icon';

export default function ExerciseCard({ exercise }) {
  const user = useUser();

  const onApprove = useCallback(() => {
    // TODO: Write service to update
  }, []);

  return (
    <Card color={exercise.approved ? 'light' : 'success'}>
      <Card.Header className="flex justify-between">
        {exercise.movement}
        {exercise.source === 'gpt' && user.practitioner && (
          <p className="flex text-sm text-green-500">
            <Icon icon={faSparkles} className="mr-1.5" />
            AI Generated
          </p>
        )}
      </Card.Header>
      <Card.Body>
        <p className="text-sm">{exercise.description}</p>
        {exercise.weight && (
          <div className="flex">
            <Icon icon={faDumbbell} className="mr-1.5" />
            <p>{exercise.weight} lbs</p>
          </div>
        )}
        {(exercise.repetitions || exercise.sets) && (
          <div className="flex">
            <Icon icon={faRepeat} className="mr-1.5" />
            <p>{[
              ...(exercise.repetitions ? `${exercise.repetitions} reps` : []),
              ...(exercise.sets ? `${exercise.sets} sets` : []),
            ].join(', ')}
            </p>
          </div>
        )}
        {(exercise.per_day || exercise.per_week) && (
          <div className="flex">
            <Icon icon={faCalendar} className="mr-1.5" />
            <p>{[
              ...(exercise.per_day ? `${exercise.per_day} per day` : []),
              ...(exercise.per_week ? `${exercise.per_week} per week` : []),
            ].join(', ')}
            </p>
          </div>
        )}
        <hr />
        <div className="flex">
          <Icon icon={faBoneBreak} className="mr-1.5" />
          <p>{exercise.injury.diagnosis.diagnosis}</p>
        </div>
      </Card.Body>
      {user.practitioner && exercise.source === 'gpt' && !exercise.approved && (
        <Card.Footer>
          <Button icon={faBadgeCheck} onClick={onApprove}>Approve</Button>
        </Card.Footer>
      )}
    </Card>
  );
}
