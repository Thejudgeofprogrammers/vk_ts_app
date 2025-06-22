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
            <h3>{cat.name}</h3>
            <button onClick={() => onToggleFavorite(cat.id)}>
                {cat.isFavorite ? 'Убрать из любимых' : 'Добавить в любимые'}
            </button>
        </div>
    )
}
