// in src/components/ProductCard.jsx
import React from 'react';  
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../App.css';

function ProductCard({ product, category }) {  
  return (
    <motion.div 
      className="product-card"
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/${category}/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <motion.img 
          src={product.imageUrl} 
          alt={product.name}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
        <div className="info">
          <h3>{product.name}</h3>
          {/* Optionally, show price or brief description: */}
          {product.price && <p className="price">FCFA {product.price.toLocaleString()}</p>}
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
