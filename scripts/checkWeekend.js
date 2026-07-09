export default function isWeekend(date) {
  const dayOfWeek = date.format('dddd');
  if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
    console.log('It is a weekend');
  } else {
    console.log('It is a weekday');
  }

  return dayOfWeek;
}
