import React from 'react';
import { MdCheckCircle, MdPending, MdRestaurant, MdDeliveryDining, MdCheckCircleOutline, MdCancel } from 'react-icons/md';

const OrderStatusTracker = ({ status }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', desc: 'Awaiting confirmation', icon: MdPending },
    { key: 'accepted', label: 'Accepted', desc: 'Restaurant accepted order', icon: MdCheckCircleOutline },
    { key: 'preparing', label: 'Preparing', desc: 'Chef is cooking your meal', icon: MdRestaurant },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Driver is on the way', icon: MdDeliveryDining },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your meal!', icon: MdCheckCircle }
  ];

  const getStatusIndex = (currentStatus) => {
    const statusMap = {
      pending: 0,
      accepted: 1,
      preparing: 2,
      out_for_delivery: 3,
      delivered: 4,
      cancelled: -1
    };
    return statusMap[currentStatus] !== undefined ? statusMap[currentStatus] : 0;
  };

  const currentIndex = getStatusIndex(status);

  if (status === 'cancelled') {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 flex items-center gap-4 text-red-700">
        <MdCancel size={36} />
        <div>
          <h4 className="font-display text-lg font-bold">Order Cancelled</h4>
          <p className="text-sm">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {steps.map((step, idx) => {
        const StepIcon = step.icon;
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;

        return (
          <div key={step.key} className="relative flex items-start gap-4">
            {/* Connecting line */}
            {idx < steps.length - 1 && (
              <div className={`absolute left-5 top-10 bottom-0 w-0.5 -translate-x-1/2 ${
                idx < currentIndex ? 'bg-primary-500' : 'bg-slate-200'
              }`} />
            )}

            {/* Stepper Dot */}
            <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-primary-500 text-white shadow-md' :
              isActive ? 'bg-primary-100 text-primary-600 ring-4 ring-primary-50 ring-offset-0 scale-110 shadow-sm' :
              'bg-slate-100 text-slate-400'
            }`}>
              <StepIcon size={20} />
            </div>

            {/* Step Content */}
            <div className="pt-0.5">
              <h4 className={`font-display text-base font-bold transition-colors ${
                isActive ? 'text-primary-600 font-extrabold' : 
                isCompleted ? 'text-slate-800' : 'text-slate-400'
              }`}>
                {step.label}
              </h4>
              <p className={`text-xs mt-0.5 ${
                isActive ? 'text-slate-600 font-medium' :
                isCompleted ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;
