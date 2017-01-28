DELETE FROM pg_proc WHERE proname LIKE 'student\_%';
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_get_profile(bigint) returns TABLE (name varchar, birthday varchar,  phone varchar, email varchar, note varchar, modified_scope varchar, created bigint, modified bigint, user_id bigint) as
$$
begin
    return query
    SELECT
        u.name,
        u.birthday,
        u.phone,
        u.email,
        u.note,
        u.modified_scope,
        u.created,
        u.modified,
        u.id
    FROM
        users u
    WHERE
        u.id = $1;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_submit_profile(bigint, varchar, varchar, varchar, varchar, varchar) returns boolean as
$$
begin
    UPDATE users SET name = $2, birthday = $3, phone = $4, note = $5, modified_scope = $6 WHERE id = $1;
    RETURN FOUND;
end;
$$ language plpgsql
CALLED ON NULL INPUT;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_logout(bigint) returns boolean as
$$
begin
  DELETE FROM users_token WHERE user_id = $1;
  RETURN FOUND;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------