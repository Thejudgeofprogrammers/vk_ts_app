import axios from 'axios';
import { useEffect, useState } from "react";
import { Cat } from "../types/types";
import { getFavorites, removeFavorite } from "../api/BackendApi";
import { CatCard } from "../components/CatCard";

export default function FavoriteCatsPage() {
    const [cats, setCats] = useState<Cat[]>([]);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const res = await getFavorites();
                const ids: string[] = res.data.likes.map((like: { cat_id: string; }) => like.cat_id);

                const catRequests = ids.map(id =>
                    axios.get(`https://api.thecatapi.com/v1/images/${id}`, {
                        headers: {
                            'x-api-key': import.meta.env.VITE_CAT_API_KEY,
                        }
                    })
                );

                const responses = await Promise.all(catRequests);

                const catsData: Cat[] = responses.map((res: any) => ({
                    id: res.data.id,
                    name: res.data.breeds?.[0]?.name ?? 'Unknown',
                    imageUrl: res.data.url,
                    isFavorite: true
                }));

                setCats(catsData);
            } catch (err) {
                console.error("Ошибка при загрузке избранных котов", err);
            }
        };

        loadFavorites();
    }, []);

    const handleRemove = async (id: string) => {
        await removeFavorite(id);
        setCats(cats.filter(c => c.id !== id));
    }

    return (
        <div className="cat-list">
            {cats.map(cat => (
                <CatCard
                    key={cat.id}
                    cat={cat}
                    onToggleFavorite={handleRemove}
                />
            ))}
        </div>
    );
}