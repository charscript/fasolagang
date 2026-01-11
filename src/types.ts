export interface Meme {
    id: number;
    url: string;
    title: string;
    author: string;
    date: string;
    tags: string[];
    comments: number;
    type?: 'image' | 'video';
    is_meme?: boolean;
    show_on_home?: boolean;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
    link?: string;
    status: 'activo' | 'desarrollo' | 'legado' | 'banda';
}

export interface MemberLink {
    id: number;
    name: string;
    role: string;
    description: string;
    image: string;
    link: string;
    linkText: string;
}

export interface AboutData {
    introText: string[];
    projects: Project[];
    network: MemberLink[];
}
