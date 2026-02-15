'use client';

import { PrinterIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function PrintButton() {
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 100);
    };

    return (
        <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Print article"
        >
            <PrinterIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Print</span>
        </button>
    );
}
