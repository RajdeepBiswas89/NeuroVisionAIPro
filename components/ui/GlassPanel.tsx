
import React from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', title, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        glass-panel rounded-3xl p-6 relative overflow-hidden border-2 border-gray-200
        ${className}
      `}
            {...props}
        >
            {/* Decorative gradient orb */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4CC9F0] rounded-full filter blur-[80px] opacity-20 pointer-events-none" />

            {title && (
                <h3 className="text-xl font-bold text-gray-900 mb-4 relative z-10 border-b-2 border-gray-300 pb-2">
                    {title}
                </h3>
            )}

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
};

export default GlassPanel;
