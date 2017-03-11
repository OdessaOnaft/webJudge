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
create or replace function guest_register(varchar, varchar) returns TABLE(user_id bigint)as
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
  return QUERY SELECT result;
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
create or replace function guest_get_problem(bigint, varchar) returns TABLE (problem_id bigint, name varchar, created bigint, time_limit bigint, memory_limit bigint, description varchar, samples varchar, output_type varchar, user_id bigint, input varchar, output varchar, total_solutions_count bigint, success_solutions_count bigint, total_unique_solutions_count bigint, success_unique_solutions_count bigint) as
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
            p.user_id,
            ''::varchar,
            ''::varchar,
            (SELECT COUNT(*) FROM solutions s WHERE s.problem_id = p.id),
            (SELECT COUNT(*) FROM solutions s WHERE s.problem_id = p.id AND s.status = 'ok'::varchar),
            (SELECT COUNT(*) FROM (SELECT DISTINCT s.user_id FROM solutions s WHERE s.problem_id = p.id) AS t1),
            (SELECT COUNT(*) FROM (SELECT DISTINCT s.user_id FROM solutions s WHERE s.problem_id = p.id AND s.status = 'ok'::varchar) AS t2)
        FROM problems p WHERE p.id = $1;
end;
$$ language plpgsql
CALLED ON NULL INPUT;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_problem_comments(bigint) returns TABLE (comment_id bigint, user_id bigint, user_name varchar, created bigint, message varchar) as
$$
begin
    return query
        SELECT
            pc.id,
            pc.user_id,
            u.name,
            pc.created,
            pc.message
        FROM problem_comments pc JOIN users u ON u.id = pc.user_id
        WHERE pc.problem_id = $1;
end;
$$ language plpgsql
CALLED ON NULL INPUT;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_problems(bigint, bigint, varchar, bigint) returns TABLE (problem_id bigint, name varchar, created bigint, difficulty bigint, author varchar, is_solved boolean) as
$$
begin
    return query
        SELECT
            p.id,
            COALESCE((SELECT ls.value FROM locale_strings ls WHERE ls.related_id = p.id AND ls.lang = $3 AND ls.related_type = 'name'), (SELECT ls.value FROM locale_strings ls WHERE ls.related_id = p.id AND ls.related_type = 'name' ORDER BY id LIMIT 1)),
            p.created,
            6 - ((100 / ((SELECT COUNT(*) FROM (SELECT DISTINCT s.user_id FROM solutions s WHERE s.problem_id = p.id) AS t1)::decimal + 1) * ((SELECT COUNT(*) FROM (SELECT DISTINCT s.user_id FROM solutions s WHERE s.problem_id = p.id AND status = 'ok') AS t1) + 1)) / 100 * 5)::bigint,
            u.name,
            EXISTS(SELECT * FROM solutions s WHERE s.user_id = $4 AND s.status = 'ok' AND s.problem_id = p.id)
        FROM
            problems p JOIN users u ON u.id = p.user_id
        ORDER BY
            created
        OFFSET $1
        LIMIT $2;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_count_problems(bigint, bigint, varchar, bigint) returns TABLE (count bigint) as
$$
begin
    return query
        SELECT
            COUNT(*)
        FROM
            problems p JOIN users u ON u.id = p.user_id;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_solution(bigint) returns TABLE(solution_id bigint, user_id bigint, problem_id bigint, created bigint, status varchar, message varchar, lang varchar, test_count bigint, test_passed bigint) as
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
            s.lang,
            (SELECT COUNT(*) FROM solution_tests st WHERE st.solution_id = s.id),
            (SELECT COUNT(*) FROM solution_tests st WHERE st.solution_id = s.id AND st.status = 'ok'::varchar)
        FROM solutions s
        WHERE s.id = $1;
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
        WHERE st.solution_id = $1
        ORDER BY st.num ASC
        LIMIT ((SELECT COUNT(*) FROM solution_tests st2 WHERE st2.solution_id = $1 AND st2.status = 'ok'::varchar) + 1);
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_solutions_queue(bigint, bigint, varchar) returns TABLE(solution_id bigint, problem_id bigint, created bigint, status varchar, lang varchar, user_id bigint, user_name varchar, test_count bigint, test_passed bigint, problem_name varchar) as
$$
begin
    RETURN QUERY
        SELECT
            s.id,
            s.problem_id,
            s.created,
            s.status,
            s.lang,
            s.user_id,
            u.name,
            (SELECT COUNT(*) FROM solution_tests st WHERE st.solution_id = s.id),
            (SELECT COUNT(*) FROM solution_tests st WHERE st.solution_id = s.id AND st.status = 'ok'::varchar),
            COALESCE((SELECT ls.value FROM locale_strings ls WHERE ls.related_id = s.problem_id AND ls.lang = $3 AND ls.related_type = 'name'), (SELECT ls.value FROM locale_strings ls WHERE ls.related_id = s.problem_id AND ls.related_type = 'name' ORDER BY id LIMIT 1))
        FROM solutions s JOIN users u ON u.id = s.user_id
        ORDER BY created DESC
        OFFSET $1
        LIMIT $2;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_count_solutions_queue(bigint, bigint, varchar) returns TABLE(count bigint) as
$$
begin
    RETURN QUERY
        SELECT
            COUNT(*)
        FROM solutions s JOIN users u ON u.id = s.user_id;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_news(bigint, varchar) returns TABLE (news_id bigint, title varchar, created bigint, body varchar, creator varchar) as
$$
begin
    return query
        SELECT
            n.id,
            COALESCE((SELECT ls.value FROM locale_strings ls WHERE ls.related_id = n.id AND ls.lang = $2 AND ls.related_type = 'title'), (SELECT ls.value FROM locale_strings ls WHERE ls.related_id = n.id AND ls.related_type = 'title' ORDER BY id LIMIT 1)),
            n.created,
            COALESCE((SELECT ls.value FROM locale_strings ls WHERE ls.related_id = n.id AND ls.lang = $2 AND ls.related_type = 'body'), (SELECT ls.value FROM locale_strings ls WHERE ls.related_id = n.id AND ls.related_type = 'body' ORDER BY id LIMIT 1)),
            u.name
        FROM news n JOIN users u ON u.id = n.user_id WHERE n.id = $1;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_news_list(bigint, bigint, varchar) returns TABLE (news_id bigint, title varchar, created bigint, body varchar, creator varchar) as
$$
begin
    return query
        SELECT
            n.id,
            COALESCE((SELECT ls.value FROM locale_strings ls WHERE ls.related_id = n.id AND ls.lang = $3 AND ls.related_type = 'title'), (SELECT ls.value FROM locale_strings ls WHERE ls.related_id = n.id AND ls.related_type = 'title' ORDER BY id LIMIT 1)),
            n.created,
            COALESCE((SELECT ls.value FROM locale_strings ls WHERE ls.related_id = n.id AND ls.lang = $3 AND ls.related_type = 'body'), (SELECT ls.value FROM locale_strings ls WHERE ls.related_id = n.id AND ls.related_type = 'body' ORDER BY id LIMIT 1)),
            u.name
        FROM news n JOIN users u ON u.id = n.user_id
        ORDER BY n.id DESC
        OFFSET $1
        LIMIT $2;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_count_news_list(bigint, bigint, varchar) returns TABLE (count bigint) as
$$
begin
    return query
        SELECT
            COUNT(*)
        FROM news n JOIN users u ON u.id = n.user_id;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_groups(bigint, bigint, bigint, varchar) returns TABLE (group_id bigint, name varchar, created bigint, creator varchar, users_count bigint) as
$$
begin
    return query
        SELECT
            g.id,
            g.name,
            g.created,
            u.name,
            (SELECT COUNT(*) FROM groups_users gu WHERE gu.group_id = g.id)
        FROM groups g JOIN users u ON u.id = g.user_id
        WHERE
            CASE
                WHEN $4 = 'my' THEN
                    EXISTS(SELECT * FROM groups_users gu WHERE gu.user_id = $3 AND gu.group_id = g.id)
                WHEN $4 = 'created' THEN
                    g.user_id = $3
                WHEN $4 = 'all' THEN
                    true
                ELSE
                    true
            END
        ORDER BY g.created
        OFFSET $1
        LIMIT $2;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_count_groups(bigint, bigint, bigint, varchar) returns TABLE (count bigint) as
$$
begin
    return query
        SELECT
            COUNT(*)
        FROM groups g JOIN users u ON u.id = g.user_id
        WHERE
            CASE
                WHEN $4 = 'my' THEN
                    EXISTS(SELECT * FROM groups_users gu WHERE gu.user_id = $3 AND gu.group_id = g.id)
                WHEN $4 = 'created' THEN
                    g.user_id = $3
                WHEN $4 = 'all' THEN
                    true
                ELSE
                    true
            END;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_group(bigint) returns TABLE (group_id bigint, name varchar, description varchar, created bigint, creator varchar, users_count bigint) as
$$
begin
    return query
        SELECT
            g.id,
            g.name,
            g.description,
            g.created,
            u.name,
            (SELECT COUNT(*) FROM groups_users gu WHERE gu.group_id = g.id)
        FROM groups g JOIN users u ON u.id = g.user_id
        WHERE g.id = $1;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function guest_get_group_users(bigint) returns TABLE (user_id bigint, name varchar, created bigint) as
$$
begin
    return query
        SELECT
            gu.user_id,
            u.name,
            gu.created
        FROM groups_users gu JOIN users u ON u.id = gu.user_id
        WHERE g.group_id = $1
        ORDER BY gu.created;
end;
$$ language plpgsql;