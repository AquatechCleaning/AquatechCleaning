export const formatCurrency = (value: number, options: { decimals?: number } = {}) => {
  const decimals = options.decimals ?? 2;

  return `R${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};
