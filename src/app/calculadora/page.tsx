import { plantasQueCuram } from '@/data/brands/plantas-que-curam/brand';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
import { CalculatorWizard } from '@/features/calculator/CalculatorWizard';

export default function CalculatorPage() {
  return <CalculatorWizard brand={plantasQueCuram} schedule={feedingSchedule} />;
}
