/* eslint-disable react/prop-types */
import { faEnvelope } from '@fortawesome/pro-solid-svg-icons/faEnvelope';
import { faHouseMedical } from '@fortawesome/pro-solid-svg-icons/faHouseMedical';
import { faPhone } from '@fortawesome/pro-solid-svg-icons/faPhone';
import clsx from 'clsx';
import React from 'react';
import Card from '../common/Card';
import Icon from '../common/Icon';
import Link from '../common/Link';

export default function PractitionerCard({ practitioner }) {
  return (
    <Card>
      <Card.Header className={clsx('flex justify-between')}>
        {practitioner.name}
      </Card.Header>
      <Card.Body>
        {practitioner.practice && (
          <div className="flex capitalize">
            <Icon icon={faHouseMedical} className="mr-1.5" />
            {practitioner.practice.name}
          </div>
        )}
        {practitioner.email && (
          <Link className="flex" href={`mailto:${practitioner.email}`}>
            <Icon icon={faEnvelope} className="mr-1.5" />
            {practitioner.email}
          </Link>
        )}
        {practitioner.phone && (
          <Link className="flex" href={`tel:${practitioner.phone}`}>
            <Icon icon={faPhone} className="mr-1.5" />
            {practitioner.phone}
          </Link>
        )}
      </Card.Body>
    </Card>
  );
}
