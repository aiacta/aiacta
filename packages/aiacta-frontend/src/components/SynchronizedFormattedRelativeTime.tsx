import * as React from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';

const updateHandler = new Set<() => void>();
setInterval(() => {
  updateHandler.forEach((cb) => cb());
}, 1000);

export function SynchronizedFormattedRelativeTime({
  value,
}: {
  value: string | Date;
}) {
  const { locale } = useIntl();

  const relativeTime = React.useMemo(
    () => new Intl.RelativeTimeFormat(locale),
    [locale],
  );

  const secondsDiff = (new Date(value).getTime() - Date.now()) / 1000;
  const inPast = secondsDiff < 0;

  const [, setToggle] = React.useState(false);
  React.useEffect(() => {
    updateHandler.add(triggerUpdate);
    return () => {
      updateHandler.delete(triggerUpdate);
    };

    function triggerUpdate() {
      setToggle((t) => !t);
    }
  }, []);

  if (Math.abs(secondsDiff) < 60) {
    return <FormattedMessage defaultMessage="Just now" />;
  }

  const minutes = secondsDiff / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const months = days / 30;

  const selectedUnit:
    | readonly [number, Intl.RelativeTimeFormatUnit]
    | undefined = [
    [Math.floor(Math.abs(months)), 'months'] as const,
    [Math.floor(Math.abs(weeks)), 'weeks'] as const,
    [Math.floor(Math.abs(days)), 'days'] as const,
    [Math.floor(Math.abs(hours)), 'hours'] as const,
    [Math.floor(Math.abs(minutes)), 'minutes'] as const,
  ].find(([value]) => Math.min(value, 1) === 1);

  if (!selectedUnit) {
    return <FormattedDate value={value} />;
  }

  return (
    <>
      {relativeTime.format(
        selectedUnit[0] * (inPast ? -1 : 1),
        selectedUnit[1],
      )}
    </>
  );
}
