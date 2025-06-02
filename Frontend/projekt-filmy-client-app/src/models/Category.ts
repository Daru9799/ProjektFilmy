export interface Category {
    categoryId: string;
    name: string;
}

export interface CategoryResponse {
    category: any;
    count: any;
    $values: Category[];
}