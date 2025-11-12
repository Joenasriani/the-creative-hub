import React from 'react';

interface NavbarProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
    const navItems = [
        { id: 'tools', label: 'Creative Tools' },
        { id: 'info', label: 'About & Pricing' },
    ];

    return (
        <nav className="mb-12 flex justify-center border-b border-gray-700">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 border-b-2
                        ${currentPage === item.id 
                            ? 'text-purple-400 border-purple-400' 
                            : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`
                    }
                >
                    {item.label}
                </button>
            ))}
        </nav>
    );
};

export default Navbar;
