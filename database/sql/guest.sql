DELETE FROM pg_proc WHERE proname LIKE 'guest\_%';
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_restore_session(varchar) returns table(user_id bigint, scope varchar) as
$$
<<fn>>
declare
    result bigint;
begin
    DELETE FROM users_token WHERE expires < current_timestamp;
    SELECT ut.user_id INTO fn.result FROM users_token ut WHERE ut.value = $1 AND ut.expires > current_timestamp;
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
            u.id = fn.result;
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
create or replace function guest_get_problem(bigint, varchar) returns TABLE (problem_id bigint, name varchar, created bigint, time_limit bigint, memory_limit bigint, description varchar, tests varchar, output_type varchar, user_id bigint) as
$$
begin
    return query
        SELECT
            p.id,
            COALESCE((SELECT ls.value FROM locale_strings ls WHERE ls.related_id = p.id AND ls.lang = $2 AND ls.related_type = 'name'), (SELECT ls.value FROM locale_strings ls WHERE ls.related_id = p.id AND ls.related_type = 'name' ORDER BY id LIMIT 1)),
            p.created,
            p.time_limit,
            p.memory_limit,
            COALESCE((SELECT ls.value FROM locale_strings ls WHERE ls.related_id = p.id AND ls.lang = $2 AND ls.related_type = 'description'), (SELECT ls.value FROM locale_strings ls WHERE ls.related_id = p.id AND ls.related_type = 'description' ORDER BY id LIMIT 1)),
            p.tests,
            p.output_type,
            p.user_id
        FROM problems p WHERE p.id = $1;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_problems(bigint, bigint, varchar) returns TABLE (problem_id bigint, name varchar, created bigint) as
$$
begin
    return query
        SELECT
            p.id,
            COALESCE((SELECT ls.value FROM locale_strings ls WHERE ls.related_id = p.id AND ls.lang = $3 AND ls.related_type = 'name'), (SELECT ls.value FROM locale_strings ls WHERE ls.related_id = p.id AND ls.related_type = 'name' ORDER BY id LIMIT 1)),
            p.created
        FROM
            problems p
        ORDER BY
            created
        OFFSET $1
        LIMIT $2;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_solution(bigint) returns TABLE(solution_id bigint, user_id bigint, problem_id bigint, created bigint, status varchar, message varchar, lang varchar) as
$$
begin
    RETURN QUERY
        SELECT
            s.id,
            s.user_id,
            s.problem_id,
            s.created,
            s.status,
            s.message,
            s.lang
        FROM solutions s
        WHERE s.id = $2;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_solution_tests(bigint) returns TABLE(test_id bigint, solution_id bigint, created bigint, status varchar, exec_time bigint, exec_memory bigint, num bigint, message varchar) as
$$
begin
    RETURN QUERY
        SELECT
            st.id,
            st.solution_id,
            st.created,
            st.status,
            st.exec_time,
            st.exec_memory,
            st.num,
            st.message
        FROM solution_tests st
        WHERE st.solution_id = $2
        ORDER BY st.num ASC;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_solutions_queue(bigint, bigint) returns TABLE(solution_id bigint, problem_id bigint, created bigint, status varchar, lang varchar) as
$$
begin
    RETURN QUERY
        SELECT
            s.id,
            s.problem_id,
            s.created,
            s.status,
            s.lang
        FROM solutions s
        ORDER BY created DESC
        OFFSET $1
        LIMIT $2;
end;
$$ language plpgsql;