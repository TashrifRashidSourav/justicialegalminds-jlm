export interface Service {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: Date;
    updated_at: Date;
}

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    bio: string | null;
    image: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface PageSection {
    id: number;
    key: string;
    data: any;
    image: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface Inquiry {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}
