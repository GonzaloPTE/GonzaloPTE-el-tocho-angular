export interface Song {
    id: string;
    slug: string;
    code: string;
    title: string;
    author?: string;
    category: string;
    lyrics: string;
    audioUrl?: string;
    videoUrl?: string;
    tag?: string;
}

export interface Category {
    letter: string;
    description: string;
    slug: string;
}
