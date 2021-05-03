import chalk from 'chalk';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const baseDir = resolve(__dirname, '../.lighthouseci-base');
const currentDir = resolve(__dirname, '../.lighthouseci');

const baseReport = getReport(baseDir, 'index.html');
const currentReport = getReport(currentDir, 'index.html');

if (!baseReport) {
  console.error('Could not retrieve baseReport');
  process.exit(1);
}
if (!currentReport) {
  console.error('Could not retrieve currentReport');
  process.exit(1);
}

const summaryDiff = Object.fromEntries(
  Object.entries(currentReport.summary).map(([key, value]) => [
    key,
    value - baseReport.summary[key as keyof typeof baseReport['summary']],
  ]),
) as {
  ['performance']: number;
  ['accessibility']: number;
  ['best-practices']: number;
  ['seo']: number;
  ['pwa']: number;
};

console.log(`   performance: ${prettyChange('performance')}`);
console.log(` accessibility: ${prettyChange('accessibility')}`);
console.log(`best-practices: ${prettyChange('best-practices')}`);
console.log(`           seo: ${prettyChange('seo')}`);
console.log(`           pwa: ${prettyChange('pwa')}`);

function prettyChange(name: keyof typeof summaryDiff) {
  const currentValue = currentReport!.summary[name];
  const diff = currentValue - baseReport!.summary[name];
  const trend = diff > 0 ? ' 📈' : diff < 0 ? ' 📉' : '   ';

  return `${`${currentValue * 100}`.padStart(3, ' ')} (${chalk[
    diff < 0 ? 'red' : 'green'
  ](`${Math.round(diff * 100)}`.padStart(3, ' '))}${trend})`;
}

function getReport(dir: string, page: string) {
  const manifest: {
    url: string;
    isRepresentativeRun: boolean;
    summary: {
      performance: number;
      accessibility: number;
      'best-practices': number;
      seo: number;
      pwa: number;
    };
  }[] = JSON.parse(readFileSync(resolve(dir, 'manifest.json'), 'utf-8'));

  return manifest.find(
    (report) => report.url.endsWith(page) && report.isRepresentativeRun,
  );
}
