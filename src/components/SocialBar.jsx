import { useState } from 'react';

// ─── Configure these ───
const X_URL = 'https://x.com/buddharoid';
const PUMPFUN_URL = 'https://pump.fun/coin/53uELaexkz95hR4J17whkAWh9Hr2a1xFi7WEp5Fepump';
const SOLANA_CONTRACT = '53uELaexkz95hR4J17whkAWh9Hr2a1xFi7WEp5Fepump';

export default function SocialBar() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SOLANA_CONTRACT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = SOLANA_CONTRACT;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="social-bar">
      {/* X (Twitter) link */}
      <a
        href={X_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="social-link social-x"
        title="Follow on X"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      {/* Pump.fun link */}
      <a
        href={PUMPFUN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="social-link social-pump"
        title="View on pump.fun"
      >
        <span className="pump-icon">P</span>
      </a>

      {/* Solana contract address — click to copy */}
      <button
        className={`social-contract ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Click to copy contract address'}
      >
        <span className="contract-text">
          {SOLANA_CONTRACT.length > 12
            ? `${SOLANA_CONTRACT.slice(0, 4)}...${SOLANA_CONTRACT.slice(-4)}`
            : SOLANA_CONTRACT}
        </span>
        <span className="contract-copy-icon">
          {copied ? '\u2713' : '\u2398'}
        </span>
      </button>
    </div>
  );
}
