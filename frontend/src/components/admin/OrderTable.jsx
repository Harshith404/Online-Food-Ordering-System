import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';
import useAuth from '../../hooks/useAuth';
import Modal from '../common/Modal';
import { MdInfo, MdEmail, MdPhone, MdLocationOn, MdOutlineReceiptLong } from 'react-icons/md';

const OrderTable = ({ orders, onStatusUpdate }) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [riders, setRiders] = useState([]);
  const [customerProfiles, setCustomerProfiles] = useState({});
  const [loadingProfiles, setLoadingProfiles] = useState({});
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const fetchCustomerProfiles = async () => {
      const customerIds = [...new Set(orders.map(o => o.customerId).filter(Boolean))];

      customerIds.forEach(async (id) => {
        if (customerProfiles[id] || loadingProfiles[id]) return;

        setLoadingProfiles(prev => ({ ...prev, [id]: true }));
        try {
          const profile = await userService.getUserProfile(id);
          setCustomerProfiles(prev => ({ 
            ...prev, 
            [id]: profile || { notFound: true } 
          }));
        } catch (err) {
          console.error(`Error loading profile for customer ${id}:`, err);
        } finally {
          setLoadingProfiles(prev => ({ ...prev, [id]: false }));
        }
      });
    };

    fetchCustomerProfiles();
  }, [orders]);

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const list = await userService.getDeliveryAgents();
        setRiders(list);
      } catch (err) {
        console.error("Error fetching riders", err);
      }
    };
    fetchRiders();
  }, []);

  const handleAssignRider = async (orderId, agentId) => {
    try {
      await orderService.assignDeliveryAgent(orderId, agentId);
      alert("Rider assigned successfully!");
    } catch (err) {
      console.error("Error assigning rider", err);
      alert("Failed to assign rider.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'accepted': return 'bg-sky-100 text-sky-700';
      case 'preparing': return 'bg-purple-100 text-purple-700';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-slate-100 text-center">
        <p className="text-slate-400 font-medium">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm text-slate-500">
        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4">Order ID & Date</th>
            <th className="px-6 py-4">Customer & Address</th>
            <th className="px-6 py-4">Items</th>
            <th className="px-6 py-4">Total Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <span className="font-mono text-xs font-bold text-slate-800">#{order.id.slice(-6).toUpperCase()}</span>
                <span className="block text-xs text-slate-400 mt-1">{formatDate(order.createdAt)}</span>
              </td>
              <td className="px-6 py-4 max-w-[220px]">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center shadow-sm">
                    {(() => {
                      const profile = customerProfiles[order.customerId];
                      const avatarUrl = profile && !profile.notFound ? (profile.profilePicUrl || profile.profileImage) : null;
                      if (avatarUrl) {
                        return (
                          <img 
                            src={avatarUrl} 
                            alt={order.customerName || 'Customer'}
                            className="h-full w-full object-cover"
                          />
                        );
                      }
                      const initial = order.customerName ? order.customerName.charAt(0).toUpperCase() : 'C';
                      return (
                        <div className="h-full w-full flex items-center justify-center bg-primary-50 font-sans text-sm font-bold text-primary-600">
                          {initial}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-slate-800 font-semibold text-sm truncate block">{order.customerName || 'Customer'}</strong>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setSelectedCustomerId(order.customerId);
                            setSelectedOrder(order);
                          }}
                          className="text-slate-400 hover:text-primary-500 hover:bg-slate-100 p-0.5 rounded transition-all shrink-0"
                          title="View Customer Profile"
                        >
                          <MdInfo size={16} />
                        </button>
                      )}
                    </div>
                    <span className="block text-xs text-slate-400 truncate mt-0.5 max-w-[140px]" title={order.deliveryAddress}>
                      {order.deliveryAddress}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-xs text-slate-700">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-slate-400 font-mono ml-1">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="font-sans font-bold text-slate-800">{formatPrice(order.totalAmount)}</span>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                  {order.paymentMethod}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${getStatusStyle(order.status)}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center justify-end gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onStatusUpdate(order.id, 'accepted')}
                          className="rounded-lg bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onStatusUpdate(order.id, 'cancelled')}
                          className="rounded-lg bg-rose-50 hover:bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        onClick={() => onStatusUpdate(order.id, 'preparing')}
                        className="rounded-lg bg-primary-500 hover:bg-primary-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => onStatusUpdate(order.id, 'out_for_delivery')}
                        className="rounded-lg bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors"
                      >
                        Out for Delivery
                      </button>
                    )}

                    {order.status === 'out_for_delivery' && (
                      <span className="text-xs text-slate-400 font-medium">
                        {order.deliveryAgentId ? 'Out for Delivery' : 'Awaiting Driver Claim...'}
                      </span>
                    )}

                    {order.status === 'delivered' && (
                      <span className="text-xs text-emerald-500 font-bold">Completed</span>
                    )}

                    {order.status === 'cancelled' && (
                      <span className="text-xs text-rose-500 font-bold">Cancelled</span>
                    )}
                  </div>

                  {/* Rider Assignment Dropdown */}
                  {!order.deliveryAgentId && ['accepted', 'preparing', 'out_for_delivery'].includes(order.status) && riders.length > 0 && (
                    <div className="mt-1">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignRider(order.id, e.target.value);
                          }
                        }}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 bg-white shadow-sm focus:border-primary-500 outline-none cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>Assign Rider</option>
                        {riders.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Customer Profile Modal */}
      {selectedCustomerId && (
        <Modal
          isOpen={!!selectedCustomerId}
          onClose={() => {
            setSelectedCustomerId(null);
            setSelectedOrder(null);
          }}
          title="Customer Profile Details"
        >
          {(() => {
            const isLoading = loadingProfiles[selectedCustomerId];
            const profile = customerProfiles[selectedCustomerId];

            if (isLoading) {
              return (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
                  <p className="text-sm text-slate-400 font-medium">Retrieving customer record...</p>
                </div>
              );
            }

            if (!profile || profile.notFound) {
              return (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                  <span className="text-3xl text-rose-500">⚠️</span>
                  <h4 className="font-display text-lg font-bold text-slate-800">User Document Not Found</h4>
                  <p className="text-sm text-slate-400 max-w-xs">
                    The customer record for ID <code className="font-mono text-xs bg-slate-50 px-1 py-0.5 rounded">{selectedCustomerId}</code> does not exist or has been deleted.
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pb-5 border-b border-slate-100">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary-100 shadow-sm bg-slate-50 flex items-center justify-center">
                    {profile.profilePicUrl || profile.profileImage ? (
                      <img 
                        src={profile.profilePicUrl || profile.profileImage} 
                        alt={profile.name || 'Customer'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary-50 text-xl font-bold text-primary-600">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h4 className="font-display text-lg font-bold text-slate-800">{profile.name || 'Customer'}</h4>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      <span className="inline-block rounded-full bg-primary-50 text-[10px] uppercase font-bold text-primary-700 px-2.5 py-0.5 tracking-wider">
                        {profile.role || 'Customer'}
                      </span>
                      <span className="inline-block font-mono text-[9px] text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">
                        ID: {selectedCustomerId.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact & Delivery Information */}
                <div className="space-y-4">
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact & Delivery Information</h5>
                  
                  <div className="grid grid-cols-1 gap-3.5">
                    <div className="flex items-start gap-3">
                      <div className="text-slate-400 mt-0.5 shrink-0">
                        <MdEmail size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs text-slate-400 font-medium">Email Address</span>
                        <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors break-all">
                          {profile.email || 'Not Provided'}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="text-slate-400 mt-0.5 shrink-0">
                        <MdPhone size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs text-slate-400 font-medium">Phone Number</span>
                        <span className="text-sm font-semibold text-slate-700">
                          {profile.phone || 'Not Provided'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="text-slate-400 mt-0.5 shrink-0">
                        <MdLocationOn size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs text-slate-400 font-medium">Delivery Address</span>
                        <span className="text-sm font-semibold text-slate-700 leading-relaxed break-words">
                          {profile.address || 'Not Provided'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Associated Order Summary */}
                {selectedOrder && (
                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MdOutlineReceiptLong size={16} />
                      Associated Order Details
                    </h5>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase">Order ID</span>
                          <span className="font-mono text-xs font-bold text-slate-700 block truncate" title={selectedOrder.id}>
                            #{selectedOrder.id.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase">Order Date</span>
                          <span className="text-xs font-bold text-slate-700">
                            {formatDate(selectedOrder.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase">Total Amount</span>
                          <span className="font-sans text-xs font-extrabold text-slate-700">
                            {formatPrice(selectedOrder.totalAmount)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase">Order Status</span>
                          <span className="inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide capitalize bg-primary-100 text-primary-800">
                            {selectedOrder.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};

export default OrderTable;
