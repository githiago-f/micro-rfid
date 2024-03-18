import { hash, compare } from 'bcrypt';

const ROUNDS = 10;

export function enc(data) {
    return hash(data, ROUNDS);
}

export function comp(data, encripted) {
    return compare(data, encripted);
}
