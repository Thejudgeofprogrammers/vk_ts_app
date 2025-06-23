import { Cat } from '../types/types';
import './CatCard.css';

export function CatCard({
    cat,
    onToggleFavorite,
}: { 
    cat: Cat;
    onToggleFavorite: (id: string) => void;
}) {
    return (
        <div className='cat-card'>
            <img src={cat.imageUrl} alt={cat.name} className='cat-image' />
            <button onClick={() => onToggleFavorite(cat.id)}>
                {cat.isFavorite ? '❤️' : '🤍'}
            </button>
        </div>
    );
}
