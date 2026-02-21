/**
 * GlideX Web App — Type definitions
 * Mirrors the mobile app types for cross-platform data compatibility.
 * Source of truth: Supabase Project A database schema.
 */

// ===== USER TYPES =====

export type UserRole = 'customer' | 'host' | 'driver' | 'chauffeur';

export interface User {
    id: string;
    email: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    phone_number?: string;
    role?: UserRole;
    user_type?: UserRole;
    avatar_url?: string;
    is_verified?: boolean;
    created_at?: string;
    updated_at?: string;
}

// ===== CAR TYPES =====

export interface Car {
    id: string;
    name: string;
    brand: string;
    model: string;
    year?: number;
    price: number;
    host_id: string;
    description?: string;
    features?: string[];
    image_urls?: string[];
    location: string;
    transmission?: string;
    fuel?: string;
    engine_cc?: number;
    capacity?: number;
    is_available?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface FormattedCar extends Car {
    hostName: string;
    hostEmail: string;
    hostPhone: string;
    isVerified: boolean;
    isNew: boolean;
    rating: number;
    reviews: number;
    profiles?: {
        id: string;
        name: string;
        email: string;
        phone: string;
        is_verified: boolean;
    };
    car_ratings?: Array<{
        avg_rating: number;
        review_count: number;
    }>;
}

// ===== BOOKING TYPES =====

export type BookingStatus = 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';

export interface Booking {
    id: string;
    car_id: string;
    host_id: string;
    customer_id: string;
    start_date: string;
    end_date: string;
    days_booked: number;
    total_cost: number;
    base_amount: number;
    customer_fee: number;
    host_commission: number;
    status: BookingStatus;
    payment_reference?: string;
    created_at?: string;
    updated_at?: string;
    // Joined fields
    car?: Car;
    host?: User;
}

// ===== REVIEW TYPES =====

export interface Review {
    id: string;
    booking_id?: string;
    car_id: string;
    reviewer_id: string;
    rating: number;
    comment?: string;
    created_at: string;
    // Joined fields
    reviewer?: Pick<User, 'id' | 'name' | 'avatar_url'>;
}

// ===== ANNOUNCEMENT TYPES =====

export interface Announcement {
    id: string;
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'success' | 'error';
    target_role?: UserRole;
    created_at: string;
    expires_at?: string;
}

// ===== FILTER / SEARCH TYPES =====

export type SortType = 'newest' | 'topRated' | 'priceLow' | 'priceHigh';

export interface CarFilters {
    searchQuery?: string;
    category?: string;
    sortType?: SortType;
    startDate?: string;
    endDate?: string;
}
