import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Part {
    name: string;
    partNumber: string;
    supplier: string;
    basePrice: number;
    quantity: number;
    markupPrice: number;
}

interface Labor {
    description: string;
    hourlyRate: number;
    hours: number;
    total: number;
}

interface Fee {
    name: string;
    amount: number;
}

interface QuoteContextType {
    parts: Part[];
    labor: Labor[];
    fees: Fee[];
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    clientZip: string;
    notes: string;
    setClientName: (name: string) => void;
    setClientEmail: (email: string) => void;
    setClientAddress: (address: string) => void;
    setClientZip: (zip: string) => void;
    setNotes: (notes: string) => void;
    addPart: (part: Part) => void;
    removePart: (index: number) => void;
    addLabor: (labor: Labor) => void;
    removeLabor: (index: number) => void;
    addFee: (fee: Fee) => void;
    removeFee: (index: number) => void;
    resetQuote: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
    const [parts, setParts] = useState<Part[]>([]);
    const [labor, setLabor] = useState<Labor[]>([]);
    const [fees, setFees] = useState<Fee[]>([]);
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientZip, setClientZip] = useState('');
    const [notes, setNotes] = useState('');

    const addPart = (part: Part) => {
        setParts(prev => [...prev, part]);
    };

    const removePart = (index: number) => {
        setParts(prev => {
            const newParts = [...prev];
            newParts.splice(index, 1);
            return newParts;
        });
    };

    const addLabor = (item: Labor) => {
        setLabor(prev => [...prev, item]);
    };

    const removeLabor = (index: number) => {
        setLabor(prev => {
            const newLabor = [...prev];
            newLabor.splice(index, 1);
            return newLabor;
        });
    };

    const addFee = (fee: Fee) => {
        setFees(prev => [...prev, fee]);
    };

    const removeFee = (index: number) => {
        setFees(prev => {
            const newFees = [...prev];
            newFees.splice(index, 1);
            return newFees;
        });
    };

    const resetQuote = () => {
        setParts([]);
        setLabor([]);
        setFees([]);
        setClientName('');
        setClientEmail('');
        setClientAddress('');
        setClientZip('');
        setNotes('');
    };

    return (
        <QuoteContext.Provider value={{
            parts,
            labor,
            fees,
            clientName,
            clientEmail,
            clientAddress,
            clientZip,
            notes,
            setClientName,
            setClientEmail,
            setClientAddress,
            setClientZip,
            setNotes,
            addPart,
            removePart,
            addLabor,
            removeLabor,
            addFee,
            removeFee,
            resetQuote
        }}>
            {children}
        </QuoteContext.Provider>
    );
}

export function useQuoteContext() {
    const context = useContext(QuoteContext);
    if (context === undefined) {
        throw new Error('useQuoteContext must be used within a QuoteProvider');
    }
    return context;
}
