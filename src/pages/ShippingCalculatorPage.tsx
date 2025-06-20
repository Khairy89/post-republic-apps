
import React, { useState } from "react";
import { Calculator } from "lucide-react";
import { useShippingRates, useCountryZones, useFuelSurcharge } from "@/hooks/useShippingRates";
import CalculatorHeader from "@/components/CalculatorHeader";
import ShippingCalculatorForm from "@/components/ShippingCalculatorForm";
import EbayCalculatorForm from "@/components/EbayCalculatorForm";

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

  const onCalculateAgain = () => {
    setShowBreakdown(false);
  };

  const availableCountries = countryZones?.map(c => c.country_name).sort() || [];
  const selectedZone = getCountryZone(form.country);

  return (
    <div className="min-h-screen bg-background">
      <CalculatorHeader />

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
            <ShippingCalculatorForm
              form={form}
              price={price}
              showBreakdown={showBreakdown}
              availableCountries={availableCountries}
              selectedZone={selectedZone}
              onInputChange={onInputChange}
              onCountryChange={onCountryChange}
              onSubmit={onSubmit}
              onCalculateAgain={onCalculateAgain}
              getChargeableWeight={getChargeableWeight}
            />
          </div>

          {/* eBay Calculator */}
          <div>
            <EbayCalculatorForm
              ebayForm={ebayForm}
              ebayPrice={ebayPrice}
              shippingTotal={price.total}
              onEbayInputChange={onEbayInputChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShippingCalculatorPage;
