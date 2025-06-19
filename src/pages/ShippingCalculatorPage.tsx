import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PriceBreakdown from "@/components/PriceBreakdown";
import { useShippingRates, useCountryZones, useFuelSurcharge } from "@/hooks/useShippingRates";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, DollarSign } from "lucide-react";

type CalculatorForm = {
  country: string;
  weight: number;
  length: number;
  width: number;
  height: number;
};

type EbayCalculatorForm = {
  itemCost: number;
  profitMargin: number;
  ebayFees: number;
  paypalFees: number;
};

const VOLUMETRIC_DIVISOR = 5000;

const calculateHandlingFee = (chargeableWeight: number) => {
  return 30 + (Math.max(0, chargeableWeight - 1) * 20);
};

const initialForm: CalculatorForm = {
  country: "",
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
};

const initialEbayForm: EbayCalculatorForm = {
  itemCost: 0,
  profitMargin: 20,
  ebayFees: 12.9,
  paypalFees: 4.4,
};

const ShippingCalculatorPage = () => {
  const [form, setForm] = useState<CalculatorForm>(initialForm);
  const [ebayForm, setEbayForm] = useState<EbayCalculatorForm>(initialEbayForm);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { data: shippingRates } = useShippingRates();
  const { data: countryZones } = useCountryZones();
  const { data: fuelSurcharge } = useFuelSurcharge();

  const getChargeableWeight = () => {
    const volumetricWeight = (form.length * form.width * form.height) / VOLUMETRIC_DIVISOR;
    return Math.max(form.weight, volumetricWeight);
  };

  const getCountryZone = (countryName: string) => {
    const countryData = countryZones?.find(c => c.country_name === countryName);
    return countryData?.zone_number || null;
  };

  const getShippingRate = (weight: number, zone: number) => {
    if (!shippingRates || !zone) return 0;
    
    const rateData = shippingRates.find(rate => rate.weight_kg >= weight);
    if (!rateData) {
      const highestRate = shippingRates[shippingRates.length - 1];
      const zoneColumn = `zone_${zone}` as keyof typeof highestRate;
      return Number(highestRate[zoneColumn]) || 0;
    }
    
    const zoneColumn = `zone_${zone}` as keyof typeof rateData;
    return Number(rateData[zoneColumn]) || 0;
  };

  const getEstimatedPrice = () => {
    const chargeableWeight = getChargeableWeight();
    const zone = getCountryZone(form.country);
    
    if (!zone) {
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
    
    const total = base + fuelSurchargeAmount + handlingFee;

    return {
      base,
      fuelSurcharge: fuelSurchargeAmount,
      handling: handlingFee,
      repacking: 0,
      total,
      chargeableWeight,
      actualWeight: form.weight,
      volumetricWeight: (form.length * form.width * form.height) / VOLUMETRIC_DIVISOR,
    };
  };

  const price = getEstimatedPrice();

  const calculateEbayPrice = () => {
    const shippingCost = price.total;
    const totalCost = ebayForm.itemCost + shippingCost;
    const targetRevenue = totalCost * (1 + ebayForm.profitMargin / 100);
    
    // Calculate selling price considering eBay and PayPal fees
    const combinedFeeRate = (ebayForm.ebayFees + ebayForm.paypalFees) / 100;
    const sellingPrice = targetRevenue / (1 - combinedFeeRate);
    
    const ebayFees = sellingPrice * (ebayForm.ebayFees / 100);
    const paypalFees = sellingPrice * (ebayForm.paypalFees / 100);
    const totalFees = ebayFees + paypalFees;
    const netProfit = sellingPrice - totalCost - totalFees;
    
    return {
      itemCost: ebayForm.itemCost,
      shippingCost,
      totalCost,
      sellingPrice,
      ebayFees,
      paypalFees,
      totalFees,
      netProfit,
      profitMargin: (netProfit / sellingPrice) * 100,
    };
  };

  const ebayPrice = calculateEbayPrice();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm((f) => ({
      ...f,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const onEbayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setEbayForm((f) => ({
      ...f,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const onCountryChange = (value: string) => {
    setForm((f) => ({ ...f, country: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBreakdown(true);
  };

  const availableCountries = countryZones?.map(c => c.country_name).sort() || [];
  const selectedZone = getCountryZone(form.country);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center">
                <img 
                  src="/assets/logo_post-transparent.png" 
                  alt="PostRepublic" 
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Shipping Rate Calculator</h1>
          </div>
          <p className="text-muted-foreground">
            Calculate shipping costs instantly with our DHL rate calculator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Calculator */}
          <div>
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
                      onClick={() => setShowBreakdown(false)}
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
          </div>

          {/* eBay Calculator */}
          <div>
            <div className="bg-card/70 rounded-xl shadow-2xl px-6 py-8 space-y-6 transition-colors animate-in fade-in">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">eBay Price Calculator</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="itemCost">Item Cost (RM)</Label>
                  <Input 
                    name="itemCost" 
                    id="itemCost" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={ebayForm.itemCost || ''} 
                    onChange={onEbayInputChange} 
                    className="mt-1" 
                  />
                </div>

                <div>
                  <Label htmlFor="shippingCost">Shipping Cost (RM)</Label>
                  <Input 
                    name="shippingCost" 
                    id="shippingCost" 
                    type="number" 
                    value={price.total.toFixed(2)} 
                    readOnly
                    className="mt-1 bg-muted" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">Auto-calculated from shipping calculator</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profitMargin">Target Profit Margin (%)</Label>
                    <Input 
                      name="profitMargin" 
                      id="profitMargin" 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      value={ebayForm.profitMargin || ''} 
                      onChange={onEbayInputChange} 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="ebayFees">eBay Fees (%)</Label>
                    <Input 
                      name="ebayFees" 
                      id="ebayFees" 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      value={ebayForm.ebayFees || ''} 
                      onChange={onEbayInputChange} 
                      className="mt-1" 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="paypalFees">PayPal Fees (%)</Label>
                  <Input 
                    name="paypalFees" 
                    id="paypalFees" 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    value={ebayForm.paypalFees || ''} 
                    onChange={onEbayInputChange} 
                    className="mt-1" 
                  />
                </div>
              </div>

              {/* eBay Price Breakdown */}
              {(ebayForm.itemCost > 0 || price.total > 0) && (
                <div className="bg-muted/50 rounded-lg p-4 mt-6 shadow-inner border border-border">
                  <div className="font-medium text-lg mb-3">eBay Price Breakdown</div>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt>Item Cost:</dt>
                      <dd>RM{ebayPrice.itemCost.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Shipping Cost:</dt>
                      <dd>RM{ebayPrice.shippingCost.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <dt>Total Cost:</dt>
                      <dd>RM{ebayPrice.totalCost.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between text-primary font-bold text-lg border-t pt-2">
                      <dt>Suggested Selling Price:</dt>
                      <dd>RM{ebayPrice.sellingPrice.toFixed(2)}</dd>
                    </div>
                    <div className="text-xs text-muted-foreground mt-3 space-y-1">
                      <div className="flex justify-between">
                        <span>eBay Fees:</span>
                        <span>RM{ebayPrice.ebayFees.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PayPal Fees:</span>
                        <span>RM{ebayPrice.paypalFees.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Net Profit:</span>
                        <span>RM{ebayPrice.netProfit.toFixed(2)} ({ebayPrice.profitMargin.toFixed(1)}%)</span>
                      </div>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShippingCalculatorPage;
