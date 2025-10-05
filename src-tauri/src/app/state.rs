use crate::external::Tokens;

pub struct State {
    pub connection: rusqlite::Connection,
    pub tokens: Tokens,
}
