import { CARDS_TABLE, USER_TABLE, connection } from "../../infra/knex-connection";

const users = connection(USER_TABLE);

export const findUserByCardCode = (cardCode) => {
    return users.joinRaw(CARDS_TABLE, '').where({ card_id: cardId });
};
