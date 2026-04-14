'use client';

import { motion } from 'framer-motion';

export function HeroAnimation() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Background glowing orb */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-primary-400) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />

      {/* Main Feature Card - Peak Milk Mockup */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        className="glass-panel"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '320px',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary-300)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Price Alert
          </div>
          <div className="badge badge-success">Save ₦150</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Mock Product Image using CSS */}
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            background: 'linear-gradient(to bottom, #fbbf24 50%, #059669 50%)',
            border: '2px solid rgba(255,255,255,0.8)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }} />
          
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Peak Evaporated Milk</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>160g Tin</p>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Shoprite Ikeja</span>
            <span style={{ color: '#ef4444', fontWeight: 600, textDecoration: 'line-through' }}>₦650</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>Mile 12 Market</span>
            <span style={{ color: '#34d399', fontWeight: 700, fontSize: '1.1rem' }}>₦500</span>
          </div>
        </div>

        <button className="btn btn-primary btn-full" style={{ background: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))' }}>
          Add to Shopping List
        </button>
      </motion.div>

      {/* Floating element 1 */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '10px',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '0.75rem 1rem',
          borderRadius: '2rem',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: 600,
          zIndex: 5,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}
      >
        📉 Milo 400g dropped by 10%
      </motion.div>

      {/* Floating element 2 */}
      <motion.div
        animate={{ y: [10, -10, 10], x: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '10px',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '0.75rem 1rem',
          borderRadius: '2rem',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: 600,
          zIndex: 5,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}
      >
        📸 Scan Receipt API Active
      </motion.div>
    </div>
  );
}
