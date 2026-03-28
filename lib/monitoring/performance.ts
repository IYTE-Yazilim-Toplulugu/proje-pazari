export function reportWebVitals(metric: {
  id: string;
  name: string;
  label: string;
  value: number;
}) {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const value = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value);

  console.log('Web vitals', {
    id: metric.id,
    name: metric.name,
    category: metric.label === 'web-vital' ? 'Web Vitals' : 'Next.js metric',
    value,
  });
}
