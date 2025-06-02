export interface Country {
    countryId: string;
    name: string;
}

export interface CountryResponse {
    country: any;
    count: any;
    $values: Country[];
}