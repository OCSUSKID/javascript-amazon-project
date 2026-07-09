import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export const deliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0
  },
  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
  },
  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }
];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOption[0];
}

function isWeekend(date) {
  const dayOfWeek = date.format('dddd');
  return dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
}

// Time complexity: O(d) where d = deliveryOption.deliveryDays.
// The function increments the date one day at a time and checks weekends,
// so runtime scales linearly with the number of delivery days.

export function calculateDeliveryDate(deliveryOption) {
  // got the number of days from the deliveryOption object
  let remainingDays = deliveryOption.deliveryDays;

  // create a dayjs object for the current date
  let deliveryDate = dayjs();

  // loop until we have added the required number of delivery days
  while (remainingDays > 0) {
    // add one day to the deliveryDate
    deliveryDate = deliveryDate.add(1, 'days');

    // if the new deliveryDate is not a weekend, decrement remainingDays
    if (!isWeekend(deliveryDate)) {
      remainingDays--;
    }
  }

  const dateString = deliveryDate.format(
    'dddd, MMMM, D'
  );

  return dateString;
}