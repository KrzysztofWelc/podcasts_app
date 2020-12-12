// @ts-ignore
import { createStore } from 'easy-peasy';

interface StoreModel {
    email: string,
    id: number,
    profile_img: string,
    username: string
}

const model: StoreModel = {
    email: null,
    id: null,
    profile_img: null,
    username: null
}

export const store = createStore(model);