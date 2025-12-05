import { useEffect, useState } from 'react';

function ScrollProgressBar() {
    const [scrollWidth, setScrollWidth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollTop / docHeight) * 100;
            setScrollWidth(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${scrollWidth}%`,
            height: '4px',
            backgroundColor: '#ff257cff',
            zIndex: 1000,
            transition: 'width 0.2s ease-out'
        }}></div>
    );
}

export default ScrollProgressBar;