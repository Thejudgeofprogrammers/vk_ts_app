export interface CatApiResponse {
    id: string;
    url: string;
    breeds: Array<{
        id: string;
        name: string;
        description: string;
        temperament: string;
        origin: string;
        life_span: string;
    }>;
    width: number;
    height: number;
}

export interface Cat {
    id: string;
    name: string;
    imageUrl: string;
    isFavorite: boolean;
}

export interface Like {
    id: number;
    cat_id: string;
    created_at: Date;
}

export interface LikesResponse {
  likes: Like[];
}
