use spacetimedb::{
    spacetimedb,
    Identity,
    ReducerContext,
    timestamp::Timestamp,
    table::{TableIter, TableType, Table},
};
use serde::{Deserialize, Serialize};

#[spacetimedb(table)]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct User {
    #[primarykey]
    pub id: String,
    pub username: String,
    #[unique]
    pub email: String,
    pub password_hash: String,
    pub role: String,
    pub permissions: String, // JSON string for permissions array
    pub created_at: Timestamp,
}

#[spacetimedb(table)]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ChatMessage {
    #[primarykey]
    pub id: String,
    pub user_id: String,
    pub message: String,
    pub response: String,
    pub created_at: Timestamp,
}

#[spacetimedb(reducer)]
pub fn create_user(
    ctx: ReducerContext,
    id: String,
    username: String,
    email: String,
    password_hash: String,
    role: String,
    permissions: String,
) -> Result<(), String> {
    // Check if username already exists
    if User::filter_by_username(&username).is_some() {
        return Err("Username already exists".to_string());
    }
    
    // Check if email already exists
    if User::filter_by_email(&email).is_some() {
        return Err("Email already exists".to_string());
    }
    
    let user = User {
        id,
        username,
        email,
        password_hash,
        role,
        permissions,
        created_at: ctx.timestamp,
    };
    
    User::insert(user);
    Ok(())
}

#[spacetimedb(reducer)]
pub fn save_chat_message(
    ctx: ReducerContext,
    id: String,
    user_id: String,
    message: String,
    response: String,
) -> Result<(), String> {
    let chat = ChatMessage {
        id,
        user_id,
        message,
        response,
        created_at: ctx.timestamp,
    };
    
    ChatMessage::insert(chat);
    Ok(())
}

#[spacetimedb(reducer)]
pub fn get_user_by_username(username: String) -> Result<Option<User>, String> {
    Ok(User::filter_by_username(&username))
}

#[spacetimedb(reducer)]
pub fn get_user_by_id(id: String) -> Result<Option<User>, String> {
    Ok(User::filter_by_id(&id))
}

#[spacetimedb(reducer)]
pub fn get_chat_history(user_id: String) -> Result<Vec<ChatMessage>, String> {
    Ok(ChatMessage::filter_by_user_id(&user_id).collect())
}

#[spacetimedb(reducer)]
pub fn clear_chat_history(user_id: String) -> Result<(), String> {
    let messages: Vec<ChatMessage> = ChatMessage::filter_by_user_id(&user_id).collect();
    for message in messages {
        ChatMessage::delete(&message.id);
    }
    Ok(())
}

#[spacetimedb(reducer)]
pub fn update_user_permissions(id: String, permissions: String) -> Result<(), String> {
    if let Some(mut user) = User::filter_by_id(&id) {
        user.permissions = permissions;
        User::update_by_id(&id, user);
        Ok(())
    } else {
        Err("User not found".to_string())
    }
}