/**
 *
 */
const statement = (invoice, plays) => {
  const { customer, performance } = invoice;
  if (!performance || !performance.length) return "Incorrect invoice";

  const formatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2
  });
  let overallPrice = 0;
  let totalBonuses = 0;
  let result = `Счет для ${customer}\n`;

  for (let perf of performance) {
    const { playId, audience, type } = perf;
    const play = plays.find(play => play.name === playId);
    if (play === undefined) continue; // skip if no play found containing given name

    let thisAmount = calculatePlayPrice(type, audience);
    overallPrice += thisAmount;

    totalBonuses += calculatePlayBonuses(type, audience);

    // Display price for every play
    result +=
      ` ${playId}: ${formatter.format(thisAmount / 100)}` +
      ` (${audience} мест)\n`;
  }

  // Display overall price and collected bonuses
  result +=
    ` Итого с вас ${formatter.format(overallPrice / 100)}\n` +
    ` Вы заработали ${totalBonuses} бонусов\n`;
  return result;
};

/**
 *
 */
const calculatePlayPrice = (type, audience) => {
  let price = 0;
  switch (type) {
    case "tragedy":
      price = 40000;
      if (audience > 30) {
        price += 1000 * (audience - 30);
      }
      break;
    case "comedy":
      price = 30000 + 300 * audience;
      if (audience > 20) {
        price += 10000 + 500 * (audience - 20);
      }
      break;
    default:
      throw new Error(`Unknown play type: ${type}`);
  }
  return price;
};

/**
 *
 */
const calculatePlayBonuses = (type, audience) => {
  let bonuses = 0;
  bonuses += Math.max(audience - 30, 0);

  // ? Дополнительный бонус за каждые 10 комедий
  // ? Необходимы подробности на счет способа вычисления количества постановок
  // if ("comedy" === type) bonuses += audience % 10;
  return bonuses;
};
