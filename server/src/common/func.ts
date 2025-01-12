export const chargeShippingFee = (
  dis: number,
  totalMoney?: number,
  quantity?: number
) => {
  if (!dis) return 0;

  if (totalMoney && totalMoney > 5000000) {
    return 0;
  }

  if (quantity && quantity > 20) {
    return 0;
  }
  if (+dis <= 5000) {
    return 0;
  } else if (5000 < dis && dis <= 20000) {
    return 15000;
  } else if (20000 < dis && dis <= 40000) {
    return 25000;
  } else if (40000 < dis && dis <= 60000) {
    return 35000;
  } else if (60000 < dis && dis <= 90000) {
    return 40000;
  } else if (90000 < dis) {
    return 50000;
  }
  return 0;
};

export function handleFutureDateTimeOrder(dist: number) {
  const today = Date.now();
  const nDaysLater = today;
  //  + n * 24 * 60 * 60 * 1000;

  if (!dist) {
    return today;
  }

  if (dist < 10000) {
    return today + 1 * 24 * 60 * 60 * 1000;
  }

  if (10000 <= dist && dist < 20000) {
    return today + 3 * 24 * 60 * 60 * 1000;
  }

  if (20000 <= dist && dist < 40000) {
    return today + 6 * 24 * 60 * 60 * 1000;
  }

  if (40000 <= dist && dist < 80000) {
    return today + 8 * 24 * 60 * 60 * 1000;
  }
  if (80000 <= dist) {
    return today + 12 * 24 * 60 * 60 * 1000;
  }
}

export function getMonthStartAndEnd(i: number) {
  const today = new Date();
  let tenMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
  tenMonth.setMonth(tenMonth.getMonth() - i);

  const startDate = new Date(
    tenMonth.getFullYear(),
    tenMonth.getMonth(),
    1,
    0,
    0,
    0
  );
  const endDate = new Date(
    tenMonth.getFullYear(),
    tenMonth.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  return { startDate, endDate };
}

export function getDateStartAndEnd(i: number) {
  const dateDay = new Date();
  dateDay.setDate(dateDay.getDate() - i);
  const startDay = new Date(dateDay);
  const endDay = new Date(dateDay);
  startDay.setHours(0, 0, 0, 0);
  endDay.setHours(23, 59, 0, 0);

  return { startDay, endDay };
}
