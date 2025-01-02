export interface Country {
    countryId: string;
    name: string;
}

export interface CountryResponse {
    $values: Country[];
}