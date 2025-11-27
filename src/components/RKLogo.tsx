
interface RKLogoProps {
  size?: number;
  className?: string;
}

export default function RKLogo({ size = 40, className = "" }: RKLogoProps) {
  return (
    <div 
      className={`flex-shrink-0 ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'block',
        backgroundImage: "url(/head.png)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />
  );
}
