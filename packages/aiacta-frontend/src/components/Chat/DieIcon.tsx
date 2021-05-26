import { MantineTheme, theming } from '@mantine/core';
import * as React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles(
  (theme: MantineTheme) => ({
    die: {
      height: '1.6em',
      marginBottom: -6,
      '& text': {
        fill: theme.colorScheme === 'dark' ? theme.black : theme.colors.gray[2],
        stroke: 'none',
      },
    },
    face: {
      fill:
        theme.colorScheme === 'dark'
          ? theme.colors.gray[2]
          : theme.colors.dark[5],
      stroke: theme.colorScheme === 'dark' ? theme.black : theme.colors.dark[2],
    },
    shade: {
      fill:
        theme.colorScheme === 'dark'
          ? theme.colors.gray[5]
          : theme.colors.dark[6],
    },
    dropped: {
      filter: 'blur(1px)',
      opacity: 0.5,
    },
    critical: {
      '& $face': {
        fill:
          theme.colorScheme === 'dark'
            ? theme.colors.green[3]
            : theme.colors.green[5],
      },
      '& $shade': {
        fill:
          theme.colorScheme === 'dark'
            ? theme.colors.green[6]
            : theme.colors.green[7],
      },
    },
    failure: {
      '& $face': {
        fill:
          theme.colorScheme === 'dark'
            ? theme.colors.red[3]
            : theme.colors.red[5],
      },
      '& $shade': {
        fill:
          theme.colorScheme === 'dark'
            ? theme.colors.red[4]
            : theme.colors.red[6],
      },
    },
  }),
  { theming },
);

export function DieIcon({
  faces,
  value,
  critical,
  dropped,
}: {
  faces: number;
  value: number;
  critical?: boolean;
  dropped?: boolean;
}) {
  const classes = useStyles();

  const className = [
    classes.die,
    dropped && classes.dropped,
    critical && classes.critical,
    value === 1 && classes.failure,
  ]
    .filter(Boolean)
    .join(' ');

  switch (faces) {
    case 4: {
      return (
        <svg className={className} viewBox="-1 -1 52 52">
          <path
            d="M 0,50 l 25,-50 l 25,50 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            className={classes.face}
          />
          <text
            x="25"
            y="35"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="2em"
          >
            {value}
          </text>
        </svg>
      );
    }
    case 6: {
      return (
        <svg className={className} viewBox="-1 -1 52 52">
          <path
            d="M 2.5,2.5 l 45,0 l 0,45 l -45,0 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            className={classes.face}
          />
          <text
            x="25"
            y="28"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="2em"
          >
            {value}
          </text>
        </svg>
      );
    }
    case 8: {
      return (
        <svg className={className} viewBox="-1 -1 52 52">
          <path
            d="M 0,35 l 2,-20 l 23,-15 l 23,15 l 2,20 l -25,15 l -25,-15 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            className={classes.shade}
          />
          <path
            d="M 0,35 l 25,-35 l 25,35 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            className={classes.face}
          />
          <text
            x="25"
            y="24"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="2em"
          >
            {value}
          </text>
        </svg>
      );
    }
    case 10: {
      return (
        <svg className={className} viewBox="-1 -1 52 52">
          <path
            d="M 7,35 l -7,-3 l 25,-32 l 25,32 l -7,3 Z l -7,-3 l 0,6 l 7,-3 l 36,0 l 7,-3 l 0,6 l -7,-3 Z l -7,3 l 25,12 l 0,-15 l 18,0 l 7,3 l -25,12 l 0,-15 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            className={classes.shade}
          />
          <path
            d="M 7,35 l 18,-35 l 18,35 l -18,3 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            className={classes.face}
          />
          <text
            x="25"
            y="27"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="2em"
          >
            {value}
          </text>
        </svg>
      );
    }
    case 12: {
      const step = (Math.PI * 2) / 5;
      const points = Array.from({ length: 5 }, (_, i) =>
        [
          25 + Math.cos(-Math.PI / 2 + i * step) * 18,
          25 + Math.sin(-Math.PI / 2 + i * step) * 18,
        ].join(','),
      );
      const pointsM = Array.from({ length: 5 }, (_, i) =>
        [
          25 + Math.cos(-Math.PI / 2 + i * step) * 23,
          25 + Math.sin(-Math.PI / 2 + i * step) * 23,
        ].join(','),
      );
      const pointsO = Array.from({ length: 5 }, (_, i) =>
        [
          25 + Math.cos(-Math.PI / 2 + Math.PI / 5 + i * step) * 22,
          25 + Math.sin(-Math.PI / 2 + Math.PI / 5 + i * step) * 22,
        ].join(','),
      );
      const shades = Array.from(
        { length: 5 },
        (_, i) =>
          'M ' +
          [
            points[i],
            pointsM[i],
            pointsO[i],
            pointsM[(i + 1) % 5],
            points[(i + 1) % 5],
          ].join(' L ') +
          ' Z',
      );
      return (
        <svg className={className} viewBox="-1 -1 52 52">
          <path
            d={`${shades.join(' ')}`}
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            className={classes.shade}
          />
          <path
            d={`M ${points.join(' L ')} Z`}
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            className={classes.face}
          />
          <text
            x="25"
            y="28"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="1.6em"
          >
            {value}
          </text>
        </svg>
      );
    }
    case 20: {
      const step = (Math.PI * 2) / 3;
      const points = Array.from({ length: 3 }, (_, i) =>
        [
          25 + Math.cos(-Math.PI / 2 + i * step) * 21,
          25 + Math.sin(-Math.PI / 2 + i * step) * 21,
        ].join(','),
      );
      const pointsM = Array.from({ length: 3 }, (_, i) =>
        [
          25 + Math.cos(-Math.PI / 2 + Math.PI / 3 + i * step) * 25,
          25 + Math.sin(-Math.PI / 2 + Math.PI / 3 + i * step) * 25,
        ].join(','),
      );
      const pointsO = Array.from({ length: 3 }, (_, i) =>
        [
          25 + Math.cos(-Math.PI / 2 + i * step) * 25,
          25 + Math.sin(-Math.PI / 2 + i * step) * 25,
        ].join(','),
      );
      const shades = [
        ...Array.from({ length: 3 }, (_, i) =>
          [
            'M ' +
              [points[i], pointsO[i], pointsM[(i - 1 + 3) % 3]].join(' L ') +
              ' Z',
            'M ' + [points[i], pointsO[i], pointsM[i]].join(' L ') + ' Z',
          ].join(' '),
        ),
        ...Array.from(
          { length: 3 },
          (_, i) =>
            'M ' +
            [points[i], pointsM[i], points[(i + 1) % 3]].join(' L ') +
            ' Z',
        ),
      ];
      return (
        <svg className={className} viewBox="-1 -1 52 52">
          <path
            d={`${shades.join(' ')}`}
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            className={classes.shade}
          />
          <path
            d={`M ${points.join(' L ')} Z`}
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            className={classes.face}
          />
          <text
            x="25"
            y="28"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="1.3em"
          >
            {value}
          </text>
        </svg>
      );
    }
  }

  return <>unknown</>;
}
