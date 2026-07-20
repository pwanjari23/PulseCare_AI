import React from 'react';
import { Scale, Info } from 'lucide-react';

export const BMICard = ({ bmi = 22.5, category = 'Normal' }) => {
  const numericBmi = Number(bmi) || 22.5;

  const getBmiCategory = () => {
    if (category) return category;
    if (numericBmi < 18.5) return 'Underweight';
    if (numericBmi < 25) return 'Normal weight';
    if (numericBmi < 30) return 'Overweight';
    return 'Obese';
  };

  const bmiCat = getBmiCategory();

  const getCategoryBadgeClass = () => {
    if (bmiCat.includes('Underweight')) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    if (bmiCat.includes('Normal')) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (bmiCat.includes('Overweight')) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
  };

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-bold text-foreground">Body Mass Index (BMI)</h4>
        </div>
        <span className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-full border ${getCategoryBadgeClass()}`}>
          {bmiCat}
        </span>
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold text-foreground font-display">{numericBmi}</span>
        <span className="text-xs text-muted-foreground">kg/m²</span>
      </div>

      {/* Visual BMI Progress Meter */}
      <div className="space-y-1 pt-1">
        <div className="grid grid-cols-4 gap-1 h-2 rounded-full overflow-hidden bg-accent">
          <div className={`h-full ${numericBmi < 18.5 ? 'bg-amber-500' : 'bg-muted/40'}`} title="Underweight (<18.5)" />
          <div className={`h-full ${numericBmi >= 18.5 && numericBmi < 25 ? 'bg-emerald-500' : 'bg-muted/40'}`} title="Normal (18.5-24.9)" />
          <div className={`h-full ${numericBmi >= 25 && numericBmi < 30 ? 'bg-amber-500' : 'bg-muted/40'}`} title="Overweight (25-29.9)" />
          <div className={`h-full ${numericBmi >= 30 ? 'bg-rose-500' : 'bg-muted/40'}`} title="Obese (>=30)" />
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
          <span>&lt;18.5</span>
          <span>18.5 - 24.9</span>
          <span>25 - 29.9</span>
          <span>30+</span>
        </div>
      </div>

      <div className="text-[11px] text-muted-foreground flex items-center space-x-1.5 pt-1">
        <Info className="w-3.5 h-3.5 shrink-0 text-primary" />
        <span>Calculated automatically by backend from logged height and weight.</span>
      </div>
    </div>
  );
};

export default BMICard;
