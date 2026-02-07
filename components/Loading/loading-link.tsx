'use client'

import Link from 'next/link';
import { useLoading } from '@/context/LoadingContext';
import { ReactNode } from 'react';

interface LoadingLinkProps {
    href: string;
    children: ReactNode;
    message: string;
    className?: string;
}

export default function LoadingLink({ href, children, message, className }: LoadingLinkProps) {
    const { startLoading } = useLoading();

    return (
        <Link 
            href={href} 
            className={className} 
            onClick={() => startLoading(message)}
        >
            {children}
        </Link>
    );
}