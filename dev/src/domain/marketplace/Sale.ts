import PriorityQueue from "ts-priority-queue";
import { Product } from "./Product";

export interface Sale{
    name: string;
    description: string;
    
    applyDiscount(products: PriorityQueue<Product>):number;
}