import React from 'react';
import { Trash2 } from 'lucide-react';
import MedicineSelector from './MedicineSelector';
import DosageInput from './DosageInput';
import FrequencySelector from './FrequencySelector';
import DurationSelector from './DurationSelector';
import InstructionsInput from './InstructionsInput';

export const PrescriptionMedicineRow = ({
  index,
  item,
  onChange,
  onRemove,
  canRemove = true,
  errors = {},
}) => {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-4 space-y-3 relative group font-sans">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
          Medicine #{index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Remove medicine"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <MedicineSelector
          value={item.medicationName || ''}
          onChange={(val) => onChange(index, 'medicationName', val)}
          error={errors.medicationName?.message}
        />
        <DosageInput
          value={item.dosage || ''}
          onChange={(val) => onChange(index, 'dosage', val)}
          error={errors.dosage?.message}
        />
        <FrequencySelector
          value={item.frequency || ''}
          onChange={(val) => onChange(index, 'frequency', val)}
          error={errors.frequency?.message}
        />
        <DurationSelector
          value={item.durationDays || 5}
          onChange={(val) => onChange(index, 'durationDays', val)}
          error={errors.durationDays?.message}
        />
        <div className="sm:col-span-2">
          <InstructionsInput
            value={item.instructions || 'After meals'}
            onChange={(val) => onChange(index, 'instructions', val)}
            error={errors.instructions?.message}
          />
        </div>
      </div>
    </div>
  );
};

export default PrescriptionMedicineRow;
