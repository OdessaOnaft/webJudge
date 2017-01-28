DELETE FROM pg_proc WHERE proname LIKE 'guest\_%';
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_restore_session(varchar) returns table(id bigint, scope varchar) as
$$
declare
    result bigint;
begin
    DELETE FROM users_token WHERE expires > current_timestamp;
    SELECT user_id INTO result FROM users_token WHERE value = $1 AND expires > current_timestamp;
    IF result IS NULL THEN
        raise exception 'Invalid token';
    END IF;
    RETURN QUERY
        SELECT
            u.id,
            s.value
        FROM
            users u
            JOIN scope s ON s.id = u.scope_id
        WHERE
            u.id = result;
end;
$$ language plpgsql
CALLED ON NULL INPUT;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_register(varchar, varchar) returns bigint as
$$
declare
  result bigint;
begin
  IF ((SELECT COUNT(*) FROM users u WHERE u.email = $2 AND u.is_visible) > 0) THEN
    raise exception 'User with this email already exists';
  END IF;
  INSERT INTO users
    (email,password)
  VALUES
    ($2, crypt($1, gen_salt('bf', 8)));
  SELECT lastval() INTO result;
  return result;
end;
$$ language plpgsql
CALLED ON NULL INPUT;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_login(varchar, varchar) returns table (token varchar, scope varchar, user_id bigint) as
$$
<<fn>>
declare
  token varchar;
  user_id bigint;
  scope varchar;
begin
    SELECT u.id INTO fn.user_id FROM users u WHERE u.email = $1 AND u.is_visible AND u.password = crypt($2, u.password);
    IF fn.user_id IS NULL THEN
        raise exception 'Incorrect login or/and password';
    END IF;
    SELECT t.value INTO fn.token FROM users_token t WHERE t.user_id = fn.user_id AND t.expires > current_timestamp;
    IF fn.token IS NULL THEN
        fn.token := random_string(32);
        INSERT INTO users_token (value, user_id, expires) VALUES (fn.token, fn.user_id, current_timestamp + INTERVAL '1 week');
    ELSE
        UPDATE users_token SET expires = current_timestamp + INTERVAL '1 week' WHERE users_token.user_id = fn.user_id AND users_token.value = fn.token;
    END IF;
    SELECT s.value INTO fn.scope FROM scope s WHERE s.id = (SELECT u.scope_id FROM users u WHERE u.id = fn.user_id);
    return query
        SELECT
            fn.token,
            fn.scope,
            fn.user_id;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
