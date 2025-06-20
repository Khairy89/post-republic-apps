
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

type EbayCalculatorForm = {
  itemCost: number;
  profitMargin: number;
  ebayFees: number;
  paypalFees: number;
};

type EbayPrice = {
  itemCost: number;
  shippingCost: number;
  totalCost: number;
  sellingPrice: number;
  ebayFees: number;
  paypalFees: number;
  totalFees: number;
  netProfit: number;
  profitMargin: number;
};

type EbayCalculatorFormProps = {
  ebayForm: EbayCalculatorForm;
  ebayPrice: EbayPrice;
  shippingTotal: number;
  onEbayInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const EbayCalculatorForm: React.FC<EbayCalculatorFormProps> = ({
  ebayForm,
  ebayPrice,
  shippingTotal,
  onEbayInputChange,
}) => {
  return (
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
            value={shippingTotal.toFixed(2)} 
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
      {(ebayForm.itemCost > 0 || shippingTotal > 0) && (
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
  );
};

export default EbayCalculatorForm;
