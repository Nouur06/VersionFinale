import { useState } from "react";

interface HeritageImageProps {
  slug: string;
  alt: string;
  gradient: string;
  className?: string;
}

/**
 * Affiche public/images/heritage/<slug>.jpg s'il existe ;
 * sinon un fond décoratif aux couleurs du thème.
 */
export default function HeritageImage({ slug, alt, gradient, className = "" }: HeritageImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`relative overflow-hidden bg-linear-to-br ${gradient} ${className}`}>
        <div className="motif-zellige absolute inset-0" />
      </div>
    );
  }
  return (
    <img
      src={`/images/heritage/${slug}.jpg`}
      alt={alt}
      loading="lazy"
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
