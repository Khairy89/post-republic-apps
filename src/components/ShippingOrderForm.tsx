import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PriceBreakdown from "./PriceBreakdown";
import { useShippingRates, useCountryZones, useFuelSurcharge } from "@/hooks/useShippingRates";

type FormState = {
  recipientName: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  repacking: boolean;
  weight: number;
  length: number;
  width: number;
  height: number;
};

const REPACKING_FEE = 10;  // RM
const VOLUMETRIC_DIVISOR = 5000; // Standard DHL volumetric divisor (cm³/kg)

// Calculate handling fee: RM20 for first kg + RM20 per additional kg
const calculateHandlingFee = (chargeableWeight: number) => {
  return 20 + (Math.max(0, chargeableWeight - 1) * 20);
};

const initialForm: FormState = {
  recipientName: "",
  address: "",
  zip: "",
  city: "",
  state: "",
  country: "",
  phone: "",
  repacking: false,
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
};

const ShippingOrderForm: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const { data: shippingRates } = useShippingRates();
  const { data: countryZones } = useCountryZones();
  const { data: fuelSurcharge } = useFuelSurcharge();

  // Calculate volumetric weight and determine chargeable weight
  const getChargeableWeight = () => {
    const volumetricWeight = (form.length * form.width * form.height) / VOLUMETRIC_DIVISOR;
    return Math.max(form.weight, volumetricWeight);
  };

  // Get zone for selected country
  const getCountryZone = (countryName: string) => {
    const countryData = countryZones?.find(c => c.country_name === countryName);
    return countryData?.zone_number || null;
  };

  // Get shipping rate based on weight and zone
  const getShippingRate = (weight: number, zone: number) => {
    if (!shippingRates || !zone) return 0;
    
    // Find the appropriate weight bracket (next weight >= chargeable weight)
    const rateData = shippingRates.find(rate => rate.weight_kg >= weight);
    if (!rateData) {
      // If weight exceeds our table, use the highest bracket
      const highestRate = shippingRates[shippingRates.length - 1];
      const zoneColumn = `zone_${zone}` as keyof typeof highestRate;
      return Number(highestRate[zoneColumn]) || 0;
    }
    
    const zoneColumn = `zone_${zone}` as keyof typeof rateData;
    return Number(rateData[zoneColumn]) || 0;
  };

  // Calculate estimated price using real rates
  const getEstimatedPrice = () => {
    const chargeableWeight = getChargeableWeight();
    const zone = getCountryZone(form.country);
    
    if (!zone) {
      // Return mock data if no zone found
      return {
        base: 0,
        fuelSurcharge: 0,
        handling: 0,
        repacking: 0,
        total: 0,
        chargeableWeight,
        actualWeight: form.weight,
        volumetricWeight: (form.length * form.width * form.height) / VOLUMETRIC_DIVISOR,
      };
    }

    const base = getShippingRate(chargeableWeight, zone);
    const fuelSurchargeRate = (fuelSurcharge?.rate_percentage || 12) / 100;
    const fuelSurchargeAmount = base * fuelSurchargeRate;
    const handlingFee = calculateHandlingFee(chargeableWeight);
    
    let total = base + fuelSurchargeAmount + handlingFee;
    if (form.repacking) total += REPACKING_FEE;

    return {
      base,
      fuelSurcharge: fuelSurchargeAmount,
      handling: handlingFee,
      repacking: form.repacking ? REPACKING_FEE : 0,
      total,
      chargeableWeight,
      actualWeight: form.weight,
      volumetricWeight: (form.length * form.width * form.height) / VOLUMETRIC_DIVISOR,
    };
  };

  const price = getEstimatedPrice();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const onCountryChange = (value: string) => {
    setForm((f) => ({ ...f, country: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBreakdown(true);
  };

  if (confirmed) {
    // Confirmation step
    return (
      <div className="bg-secondary/70 rounded-lg shadow p-8 text-center animate-in fade-in">
        <h2 className="text-2xl font-bold mb-4">Order Confirmed</h2>
        <p className="mb-2">Thank you for using PostRepublic!</p>
        <p className="text-sm text-muted-foreground mb-4">
          An invoice will be generated and sent to you via your preferred contact method.
        </p>
        <Button size="lg" className="mt-2" onClick={() => {
          setShowBreakdown(false);
          setConfirmed(false);
          setForm(initialForm);
        }}>Place Another Order</Button>
      </div>
    );
  }

  const availableCountries = countryZones?.map(c => c.country_name).sort() || [];
  const selectedZone = getCountryZone(form.country);

  return (
    <form className="bg-card/70 rounded-xl shadow-2xl px-6 py-8 space-y-6 transition-colors animate-in fade-in"
          onSubmit={onSubmit}
    >
      {/* Form fields and Package Details Section */}
      <h2 className="text-2xl font-semibold mb-2">Order International Shipping</h2>
      <div className="grid md:grid-cols-2 gap-4 gap-y-1">
        <div>
          <Label htmlFor="recipientName">Recipient Full Name</Label>
          <Input name="recipientName" id="recipientName" autoComplete="off" value={form.recipientName} onChange={onInputChange} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input name="phone" id="phone" autoComplete="off" value={form.phone} onChange={onInputChange} required className="mt-1" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input name="address" id="address" autoComplete="off" value={form.address} onChange={onInputChange} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="zip">Zip Code</Label>
          <Input name="zip" id="zip" value={form.zip} onChange={onInputChange} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input name="city" id="city" value={form.city} onChange={onInputChange} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input name="state" id="state" value={form.state} onChange={onInputChange} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Select value={form.country} onValueChange={onCountryChange} required>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select country" />
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
      </div>

      {/* Package Details Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Package Details</h3>
        <div className="grid md:grid-cols-2 gap-4 gap-y-1">
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

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="repacking"
          name="repacking"
          checked={form.repacking}
          onChange={onInputChange}
          className="mr-2 accent-primary scale-125"
        />
        <Label htmlFor="repacking" className="ml-1 select-none">
          Repacking required <span className="text-xs text-muted-foreground">(RM10 additional charge)</span>
        </Label>
      </div>

      {!showBreakdown && (
        <Button type="submit" size="lg" className="w-full mt-4" disabled={!form.country || !selectedZone}>
          Check Shipping Cost
        </Button>
      )}
      {showBreakdown && (
        <div>
          <PriceBreakdown price={price} />
          <Button
            size="lg"
            className="w-full mt-5"
            type="button"
            onClick={() => setConfirmed(true)}
          >
            Confirm & Request Invoice
          </Button>
        </div>
      )}
    </form>
  );
};

export default ShippingOrderForm;
