import Decimal from 'decimal.js';
import type { Plan } from '../types/plans.type';

export const getMonthlyPrice = (plan: Plan): number => {
  const price = new Decimal(plan.price);
  if (plan.billingCycle === 'MONTHLY') return price.toNumber();
  return price.dividedBy(12).toDecimalPlaces(2).toNumber();
};

export const getPercentageSaving = (plan: Plan): string => {
  if (plan.billingCycle === 'MONTHLY' || !plan.compareAtPrice) return '';

  const monthlyEquivalent = new Decimal(plan.price).dividedBy(12);
  const compareAtPrice = new Decimal(plan.compareAtPrice);

  const saving = compareAtPrice.minus(monthlyEquivalent).dividedBy(compareAtPrice).mul(100).round().toNumber();

  return `${saving}% off`;
};
