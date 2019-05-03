export class Product {
    
    constructor(
        public id: any,
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
