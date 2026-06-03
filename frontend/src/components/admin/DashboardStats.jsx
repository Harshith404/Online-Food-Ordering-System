import React from 'react';
import { MdTrendingUp, MdAttachMoney, MdPendingActions, MdDoneAll } from 'react-icons/md';
import { formatPrice } from '../../utils/formatPrice';

const DashboardStats = ({ orders = [] }) => {
  const totalOrders = orders.length;
  
  const totalRevenue = orders
    .filter((order) => order.status === 'delivered')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const pendingOrdersCount = orders.filter(
    (order) => ['pending', 'accepted', 'preparing', 'out_for_delivery'].includes(order.status)
  ).length;

  const completedOrdersCount = orders.filter((order) => order.status === 'delivered').length;

  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: MdTrendingUp,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: MdAttachMoney,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Active Orders',
      value: pendingOrdersCount,
      icon: MdPendingActions,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Completed Deliveries',
      value: completedOrdersCount,
      icon: MdDoneAll,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className={`rounded-xl border p-3 ${stat.color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h4 className="font-display text-2xl font-black text-slate-800 mt-1">{stat.value}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
