import { Box } from '@mantine/core';
import { BoxSx } from '@mantine/core/lib/components/Box/use-sx/use-sx';
import * as React from 'react';
import { RollingContext } from './RollingContext';

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
  // const classes = useStyles();

  const isRolling = React.useContext(RollingContext);

  const dieStyles: BoxSx = (theme) => ({
    height: '1.6em',
    marginBottom: -6,
    '& text': {
      fill: theme.colorScheme === 'dark' ? theme.black : theme.colors.gray[2],
      stroke: 'none',
    },
    ...(!isRolling &&
      dropped && {
        filter: 'blur(1px)',
        opacity: 0.5,
      }),
    ...(!isRolling &&
      critical && {
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
      }),
    ...(!isRolling &&
      value === 1 && {
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
      }),
    ...(isRolling && {
      filter: 'blur(2px)',
      animation: '.6s linear infinite $roll',
      '& text': {
        fill:
          theme.colorScheme === 'dark'
            ? theme.colors.gray[2]
            : theme.colors.dark[5],
      },
      '& $shade': {
        fill:
          theme.colorScheme === 'dark'
            ? theme.colors.gray[2]
            : theme.colors.dark[5],
      },
      '@keyframes roll': {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
      },
    }),
  });

  switch (faces) {
    case 4: {
      return (
        <Box component="svg" sx={dieStyles} viewBox="-1 -1 52 52">
          <Box
            component="path"
            d="M 0,50 l 25,-50 l 25,50 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            sx={(theme) => ({
              fill:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[2]
                  : theme.colors.dark[5],
              stroke:
                theme.colorScheme === 'dark'
                  ? theme.black
                  : theme.colors.dark[2],
            })}
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
        </Box>
      );
    }
    case 6: {
      return (
        <Box component="svg" sx={dieStyles} viewBox="-1 -1 52 52">
          <Box
            component="path"
            d="M 2.5,2.5 l 45,0 l 0,45 l -45,0 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            sx={(theme) => ({
              fill:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[2]
                  : theme.colors.dark[5],
              stroke:
                theme.colorScheme === 'dark'
                  ? theme.black
                  : theme.colors.dark[2],
            })}
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
        </Box>
      );
    }
    case 8: {
      return (
        <Box component="svg" sx={dieStyles} viewBox="-1 -1 52 52">
          <Box
            component="path"
            d="M 0,35 l 2,-20 l 23,-15 l 23,15 l 2,20 l -25,15 l -25,-15 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            sx={(theme) => ({
              fill:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[5]
                  : theme.colors.dark[6],
            })}
          />
          <Box
            component="path"
            d="M 0,35 l 25,-35 l 25,35 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            sx={(theme) => ({
              fill:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[2]
                  : theme.colors.dark[5],
              stroke:
                theme.colorScheme === 'dark'
                  ? theme.black
                  : theme.colors.dark[2],
            })}
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
        </Box>
      );
    }
    case 10: {
      return (
        <Box component="svg" sx={dieStyles} viewBox="-1 -1 52 52">
          <Box
            component="path"
            d="M 7,35 l -7,-3 l 25,-32 l 25,32 l -7,3 Z l -7,-3 l 0,6 l 7,-3 l 36,0 l 7,-3 l 0,6 l -7,-3 Z l -7,3 l 25,12 l 0,-15 l 18,0 l 7,3 l -25,12 l 0,-15 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            sx={(theme) => ({
              fill:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[5]
                  : theme.colors.dark[6],
            })}
          />
          <Box
            component="path"
            d="M 7,35 l 18,-35 l 18,35 l -18,3 Z"
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            sx={(theme) => ({
              fill:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[2]
                  : theme.colors.dark[5],
              stroke:
                theme.colorScheme === 'dark'
                  ? theme.black
                  : theme.colors.dark[2],
            })}
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
        </Box>
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
        <Box component="svg" sx={dieStyles} viewBox="-1 -1 52 52">
          <Box
            component="path"
            d={`${shades.join(' ')}`}
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            sx={(theme) => ({
              fill:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[5]
                  : theme.colors.dark[6],
            })}
          />
          <Box
            component="path"
            d={`M ${points.join(' L ')} Z`}
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            sx={(theme) => ({
              fill:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[2]
                  : theme.colors.dark[5],
              stroke:
                theme.colorScheme === 'dark'
                  ? theme.black
                  : theme.colors.dark[2],
            })}
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
        </Box>
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
        <Box component="svg" sx={dieStyles} viewBox="-1 -1 52 52">
          <Box
            component="path"
            d={`${shades.join(' ')}`}
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            sx={(theme) => ({
              fill:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[5]
                  : theme.colors.dark[6],
            })}
          />
          <Box
            component="path"
            d={`M ${points.join(' L ')} Z`}
            stroke="#000"
            fill="#fff"
            strokeLinejoin="bevel"
            sx={(theme) => ({
              fill:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[2]
                  : theme.colors.dark[5],
              stroke:
                theme.colorScheme === 'dark'
                  ? theme.black
                  : theme.colors.dark[2],
            })}
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
        </Box>
      );
    }
  }

  return <>unknown</>;
}
