
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PriceBreakdown from "@/components/PriceBreakdown";
import { Link } from "react-router-dom";

type CalculatorForm = {
  country: string;
  weight: number;
  length: number;
  width: number;
  height: number;
};

type Price = {
  base: number;
  fuelSurcharge: number;
  handling: number;
  repacking: number;
  total: number;
  chargeableWeight: number;
  actualWeight: number;
  volumetricWeight: number;
};

type ShippingCalculatorFormProps = {
  form: CalculatorForm;
  price: Price;
  showBreakdown: boolean;
  availableCountries: string[];
  selectedZone: number | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCalculateAgain: () => void;
  getChargeableWeight: () => number;
};

const VOLUMETRIC_DIVISOR = 5000;

const ShippingCalculatorForm: React.FC<ShippingCalculatorFormProps> = ({
  form,
  price,
  showBreakdown,
  availableCountries,
  selectedZone,
  onInputChange,
  onCountryChange,
  onSubmit,
  onCalculateAgain,
  getChargeableWeight,
}) => {
  return (
    <form 
      className="bg-card/70 rounded-xl shadow-2xl px-6 py-8 space-y-6 transition-colors animate-in fade-in"
      onSubmit={onSubmit}
    >
      {/* Country Selection */}
      <div>
        <Label htmlFor="country">Destination Country</Label>
        <Select value={form.country} onValueChange={onCountryChange} required>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select destination country" />
          </SelectTrigger>
          <SelectContent>
            {availableCountries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedZone && (
          <p className="text-xs text-muted-foreground mt-1">Zone {selectedZone}</p>
        )}
      </div>

      {/* Package Details */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Package Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Actual Weight (kg)</Label>
            <Input 
              name="weight" 
              id="weight" 
              type="number" 
              step="0.1" 
              min="0" 
              value={form.weight || ''} 
              onChange={onInputChange} 
              required 
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="length">Length (cm)</Label>
            <Input 
              name="length" 
              id="length" 
              type="number" 
              step="0.1" 
              min="0" 
              value={form.length || ''} 
              onChange={onInputChange} 
              required 
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="width">Width (cm)</Label>
            <Input 
              name="width" 
              id="width" 
              type="number" 
              step="0.1" 
              min="0" 
              value={form.width || ''} 
              onChange={onInputChange} 
              required 
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input 
              name="height" 
              id="height" 
              type="number" 
              step="0.1" 
              min="0" 
              value={form.height || ''} 
              onChange={onInputChange} 
              required 
              className="mt-1" 
            />
          </div>
        </div>
        
        {/* Weight Calculation Display */}
        {(form.weight > 0 || (form.length > 0 && form.width > 0 && form.height > 0)) && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>Actual Weight: <span className="font-medium">{form.weight} kg</span></div>
              <div>Volumetric Weight: <span className="font-medium">{((form.length * form.width * form.height) / VOLUMETRIC_DIVISOR).toFixed(2)} kg</span></div>
              <div className="col-span-2 font-medium text-primary">
                Chargeable Weight: {getChargeableWeight().toFixed(2)} kg
              </div>
            </div>
          </div>
        )}
      </div>

      {!showBreakdown && (
        <Button type="submit" size="lg" className="w-full mt-4" disabled={!form.country || !selectedZone}>
          Calculate Shipping Cost
        </Button>
      )}

      {showBreakdown && (
        <div>
          <PriceBreakdown price={price} />
          <div className="flex gap-4 mt-5">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              type="button"
              onClick={onCalculateAgain}
            >
              Calculate Again
            </Button>
            <Link to="/" className="flex-1">
              <Button size="lg" className="w-full">
                Place Order
              </Button>
            </Link>
          </div>
        </div>
      )}
    </form>
  );
};

export default ShippingCalculatorForm;
