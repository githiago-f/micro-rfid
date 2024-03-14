import { hash, compare } from 'bcrypt';

const ROUNDS = 10;

export async function enc(data) {
    await hash(data, ROUNDS);
}

export function comp(data, encripted) {
    return compare(data, encripted);
}
