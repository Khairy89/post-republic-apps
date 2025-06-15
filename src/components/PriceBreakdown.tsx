
import React from "react";

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

const asRM = (n: number) => "RM" + n.toFixed(2);

const PriceBreakdown: React.FC<{ price: Price }> = ({ price }) => (
  <div className="bg-muted/50 rounded-lg p-4 mt-6 shadow-inner border border-border animate-in fade-in text-left">
    <div className="font-medium text-lg mb-3">Estimated Price Breakdown</div>
    
    {/* Weight Details */}
    <div className="mb-4 p-3 bg-background/50 rounded border">
      <div className="text-sm font-medium mb-2">Weight Calculation</div>
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>Actual Weight:</span>
          <span>{price.actualWeight.toFixed(2)} kg</span>
        </div>
        <div className="flex justify-between">
          <span>Volumetric Weight:</span>
          <span>{price.volumetricWeight.toFixed(2)} kg</span>
        </div>
        <div className="flex justify-between font-medium text-primary">
          <span>Chargeable Weight:</span>
          <span>{price.chargeableWeight.toFixed(2)} kg</span>
        </div>
      </div>
    </div>

    <dl className="space-y-2">
      <div className="flex justify-between"><dt>Base DHL rate</dt><dd>{asRM(price.base)}</dd></div>
      <div className="flex justify-between"><dt>Fuel surcharge</dt><dd>{asRM(price.fuelSurcharge)}</dd></div>
      <div className="flex justify-between">
        <dt>Handling fee</dt>
        <dd>{asRM(price.handling)}</dd>
      </div>
      {price.repacking > 0 && <div className="flex justify-between"><dt>Repacking fee</dt><dd>{asRM(price.repacking)}</dd></div>}
      <div className="flex justify-between mt-2 font-bold py-2 border-t border-border">
        <dt>Total</dt>
        <dd>{asRM(price.total)}</dd>
      </div>
    </dl>
    <div className="text-xs text-muted-foreground mt-3">* Prices are estimates. Actual invoice may vary by DHL surcharges and currency.</div>
    <div className="text-xs text-muted-foreground">* Volumetric weight calculated using L×W×H÷5000</div>
    <div className="text-xs text-muted-foreground">* Handling fee: RM20 for first kg + RM20 per additional kg</div>
  </div>
);

export default PriceBreakdown;
