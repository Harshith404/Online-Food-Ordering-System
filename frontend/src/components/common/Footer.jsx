import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-slate-200 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} QuickBite Inc. All rights reserved. Built for DBMS Course Mini Project.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
