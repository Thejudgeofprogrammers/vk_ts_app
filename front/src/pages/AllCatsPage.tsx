import { useEffect, useState } from "react";
import { addFavorite, fetchCats, removeFavorite } from '../api/BackendApi';
import { Cat } from "../types/types";
import { CatCard } from "../components/CatCard";
import './AllCatsPage.css';

export default function AllCatsPage() {
    const [ cats, setCats ] = useState<Cat[]>([]);
    const [ page, setPage ] = useState(1);
    const [ isLoading, setIsLoading ] = useState(false);

    const loadCats = async (count: number = 10) => {
        setIsLoading(true);
        const newCats = await fetchCats(page, count);
        setCats(prev => [...prev, ...newCats]);
        setIsLoading(false);
    }

    useEffect(() => {
        loadCats(30);
    }, []);

    useEffect(() => {
        if (page === 1) return;
        loadCats(10);
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
                !isLoading
            ) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading]);

    const toggleFavorite = async (id: string) => {
        const cat = cats.find(c => c.id === id);
        if (!cat) return;

        if (cat.isFavorite) {
            await removeFavorite(id);
        } else {
            await addFavorite(id);
        }

        setCats(cats.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
    }

    return (
        <div className="cat-list">
            {cats.map(cat => (
                <CatCard key={cat.id} cat={cat} onToggleFavorite={toggleFavorite}></CatCard>
            ))}
            {isLoading && (
                <div className="loading-wrapper">
                    <div className="loading">Загрузка...</div>
                </div>
            )}
        </div>
    );
}
