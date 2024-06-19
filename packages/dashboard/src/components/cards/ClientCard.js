/* eslint-disable react/prop-types */
import { faCakeCandles } from '@fortawesome/pro-solid-svg-icons/faCakeCandles';
import { faEnvelope } from '@fortawesome/pro-solid-svg-icons/faEnvelope';
import { faGenderless } from '@fortawesome/pro-solid-svg-icons/faGenderless';
import { faMars } from '@fortawesome/pro-solid-svg-icons/faMars';
import { faPhone } from '@fortawesome/pro-solid-svg-icons/faPhone';
import { faVenus } from '@fortawesome/pro-solid-svg-icons/faVenus';
import clsx from 'clsx';
import dayjs from 'lib/dayjs';
import React from 'react';
import Card from '../common/Card';
import Icon from '../common/Icon';
import Link from '../common/Link';

const SEX_ICONS = {
  male: faMars,
  female: faVenus,
  other: faGenderless,
};

export default function ClientCard({ client }) {
  return (
    <Card>
      <Card.Header className={clsx('flex justify-between')}>
        {client.name}
      </Card.Header>
      <Card.Body>
        <div className="flex">
          <Icon icon={faCakeCandles} className="mr-1.5" />
          {dayjs(client.birthdate).format('ll')} ({dayjs(client.birthdate).fromNow(true)})
        </div>
        {client.sex && (
          <div className="flex capitalize">
            <Icon icon={SEX_ICONS[client.sex]} className="mr-1.5" />
            {client.sex}
          </div>
        )}
        {client.email && (
          <Link className="flex" href={`mailto:${client.email}`}>
            <Icon icon={faEnvelope} className="mr-1.5" />
            {client.email}
          </Link>
        )}
        {client.phone && (
          <Link className="flex" href={`tel:${client.phone}`}>
            <Icon icon={faPhone} className="mr-1.5" />
            {client.phone}
          </Link>
        )}
      </Card.Body>
    </Card>
  );
}
