import Image from "next/image";
import { PHOTO_QUALITY, READY_PHOTOS } from "@/data/media";
import styles from "./Photo.module.css";

type Props = {
  src: string; // le chemin dans public/, une fois la photo préparée
  file: string; // le nom de l'original attendu dans source/
  alt: string;
  ratio?: string; // "4 / 5", "3 / 2"… Sans ratio, le cadre prend la taille que lui donne le CSS.
  sizes: string;
  className?: string;
  layerClassName?: string; // la couche qui porte l'image : c'est elle qui bouge pour une parallaxe
  priority?: boolean;
};

// Une vraie photo si elle est prête, sinon un emplacement neutre qui dit quel fichier fournir.
export default function Photo({ src, file, alt, ratio, sizes, className, layerClassName, priority }: Props) {
  return (
    <div className={`${styles.frame} ${className ?? ""}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      <div className={`${styles.layer} ${layerClassName ?? ""}`} data-photo-layer>
        {READY_PHOTOS.has(src) ? (
          <Image src={src} alt={alt} fill sizes={sizes} quality={PHOTO_QUALITY} priority={priority} className={styles.image} />
        ) : (
          <div className={styles.placeholder} role="img" aria-label={alt}>
            <span>{file}</span>
          </div>
        )}
      </div>
    </div>
  );
}
