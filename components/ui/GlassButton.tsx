
import React from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: React.ReactNode;
}

const GlassButton: React.FC<GlassButtonProps> = ({
    children,
    variant = 'primary',
    icon,
    className = '',
    ...props
}) => {
    const getGradient = () => {
        switch (variant) {
            case 'primary': return 'from-[#4CC9F0]/20 to-[#4361EE]/20 hover:from-[#4CC9F0]/40 hover:to-[#4361EE]/40';
            case 'secondary': return 'from-white/10 to-white/5 hover:from-white/20 hover:to-white/10';
            case 'danger': return 'from-red-500/20 to-red-700/20 hover:from-red-500/40 hover:to-red-700/40';
            default: return '';
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
        relative px-6 py-3 rounded-xl font-bold text-gray-900
        flex items-center justify-center gap-2
        overflow-hidden group transition-all duration-300
        border-2 border-gray-300 hover:border-[#4CC9F0]
        backdrop-blur-md shadow-lg
        bg-gradient-to-br ${getGradient()}
        ${className}
      `}
            {...props}
        >
            {/* Glossy reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 bg-inherit -z-10" />

            {icon && <span className="relative z-10">{icon}</span>}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default GlassButton;
