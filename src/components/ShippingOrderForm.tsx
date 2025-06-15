import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PriceBreakdown from "./PriceBreakdown";

type FormState = {
  recipientName: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  repacking: boolean;
};

const HANDLING_FEE = 20;   // RM
const REPACKING_FEE = 10;  // RM

const initialForm: FormState = {
  recipientName: "",
  address: "",
  zip: "",
  city: "",
  state: "",
  country: "",
  phone: "",
  repacking: false,
};

const ShippingOrderForm: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Mock pricing logic: RM100 base, plus fees
  const getEstimatedPrice = () => {
    let base = 100; // TODO: Real DHL rate integration
    let fuelSurcharge = 0.12 * base; // Example 12%
    let emergencySurcharge = 8; // Could be dynamic
    let total = base + fuelSurcharge + emergencySurcharge + HANDLING_FEE;
    if (form.repacking) total += REPACKING_FEE;
    return {
      base,
      fuelSurcharge,
      emergencySurcharge,
      handling: HANDLING_FEE,
      repacking: form.repacking ? REPACKING_FEE : 0,
      total,
    };
  };

  const price = getEstimatedPrice();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  return (
    <form className="bg-card/70 rounded-xl shadow-2xl px-6 py-8 space-y-6 transition-colors animate-in fade-in"
          onSubmit={onSubmit}
    >
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
          <Input name="country" id="country" value={form.country} onChange={onInputChange} required className="mt-1" />
        </div>
        <div className="col-span-2 flex items-center mt-1">
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
      </div>
      {!showBreakdown && (
        <Button type="submit" size="lg" className="w-full mt-4">
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
