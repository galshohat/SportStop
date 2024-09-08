import React, { useRef } from 'react';
import ProductCard from './ProductCard';

const CategorySlide = ({ category, products, onViewProduct, showNotification, setSessionExpired }) => {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -scrollRef.current.clientWidth / 3, 
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: scrollRef.current.clientWidth / 3, 
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="category-slide">
            <h3 className="category-title">{category.name}</h3>
            <div className="category-content">
                <button className="slide-arrow left-arrow" onClick={scrollLeft}>{'<'}</button>
                <div className="product-cards" ref={scrollRef}>
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onViewProduct={onViewProduct}
                            showNotification={showNotification}
                            setSessionExpired={setSessionExpired}
                        />
                    ))}
                </div>
                <button className="slide-arrow right-arrow" onClick={scrollRight}>{'>'}</button>
            </div>
        </div>
    );
};

export default CategorySlide;