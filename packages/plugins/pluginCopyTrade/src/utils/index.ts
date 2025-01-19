import BigNumber from 'bignumber.js';

export const formatAddress = (address: string | null, length = 5) => {
  if (!address) return '';

  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const formatReadableNumber = (
  value: number | string,
  options: {
    isTokenAmount?: boolean;
    locale?: string;
    currency?: string;
    isCompact?: boolean;
    threshold?: number;
    customDecimal?: number | null;
    showPlusIcon?: boolean;
  } = {}
) => {
  const parseNumber = typeof value === 'string' ? parseFloat(value) : value;
  const {
    isTokenAmount = false,
    locale = 'en-US',
    isCompact = false,
    threshold = 1e4,
    customDecimal = null,
    showPlusIcon = false,
  } = options;

  const isOverThreshold = parseNumber >= threshold;

  let decimal = isTokenAmount ? 4 : 2;

  if (isOverThreshold && isCompact) {
    decimal = 0;
  }

  let formattedNumber = new Intl.NumberFormat(locale, {
    maximumFractionDigits: customDecimal || decimal,

    ...(isOverThreshold && isCompact && { notation: 'compact' }),
  }).format(parseNumber);

  if (showPlusIcon && parseNumber > 1_000_000 && isCompact) {
    formattedNumber = `${formattedNumber}+`;
  }

  return formattedNumber;
};

export const convertWeiToBalance = (amount: string | number, decimal = 18) => {
  try {
    const bigDecimal = BigNumber(10).pow(decimal);
    const bigAmount = new BigNumber(amount);

    return bigAmount.div(bigDecimal);
  } catch (error) {
    return new BigNumber('0');
  }
};

export const convertBalanceToWei = (amount: string | number, decimal = 18) => {
  try {
    const bigDecimal = BigNumber(10).pow(decimal);
    const bigAmount = new BigNumber(amount);

    return bigAmount.multipliedBy(bigDecimal);
  } catch (error) {
    return new BigNumber('0');
  }
};

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return (Math.random() * (max - min + 1) + min);
}
