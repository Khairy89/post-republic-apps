import React from "react";
import { useShippingOrders } from "@/hooks/useShippingOrders";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { AlertCircle, ExternalLink } from "lucide-react";
import TrackingNumberModal from "@/components/TrackingNumberModal";
import Header from '@/components/Header';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { data: orders, isLoading, error } = useShippingOrders();

  const handleSignOut = () => {
    window.location.href = '/'; // Redirect to home after sign out
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertCircle className="mx-auto mb-2 text-destructive" />
          <div className="text-lg">Please sign in to view your orders.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header user={user} onSignOut={handleSignOut} />
      <div className="max-w-6xl mx-auto pt-10 pb-20 px-3">
        <h2 className="text-2xl font-bold mb-6 text-center">My Orders</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">Loading orders...</div>
        ) : error ? (
          <div className="flex justify-center text-destructive">{error.message}</div>
        ) : !orders || orders.length === 0 ? (
          <div className="flex justify-center py-10 text-muted-foreground">No shipping orders found.</div>
        ) : (
          <div className="shadow-sm rounded-lg border overflow-x-auto bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Total (RM)</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <span className={
                        order.status === "pending" 
                          ? "text-yellow-600 font-medium"
                          : order.status === "delivered"
                          ? "text-green-700 font-medium"
                          : "text-sky-700 font-medium"
                      }>
                        {order.status || "pending"}
                      </span>
                    </TableCell>
                    <TableCell>{order.recipient_name}</TableCell>
                    <TableCell>
                      {order.city}, {order.country}
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                    <TableCell>{order.total_price?.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {order.tracking_number ? (
                          <a
                            href={`https://www.dhl.com/en/express/tracking.html?AWB=${order.tracking_number}&brand=DHL`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {order.tracking_number}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not available</span>
                        )}
                        <TrackingNumberModal
                          orderId={order.id}
                          currentTrackingNumber={order.tracking_number}
                          recipientName={order.recipient_name}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
