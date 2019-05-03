export class Product {
    
    constructor(
        public name: string,
        public price: number,
        public available_quantity: number, 
        public max_quantity_per_customer: number,
        public description: string, 
        public isVegetarian: boolean,
        public imgUrl: string
    ) {

    }

}
