DELETE FROM pg_proc WHERE proname LIKE 'student\_%';
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_get_profile(bigint) returns TABLE (name varchar, birthday varchar,  phone varchar, email varchar, note varchar, modified_scope varchar, created bigint, modified bigint, user_id bigint, scope varchar, total_solutions_count bigint, success_solutions_count bigint) as
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
        u.id,
        s.value,
        (SELECT COUNT(*) FROM solutions s WHERE s.user_id = u.id),
        (SELECT COUNT(*) FROM solutions s WHERE s.user_id = u.id AND s.status = 'ok'::varchar)
    FROM
        users u JOIN scope s ON s.id = u.scope_id
    WHERE
        u.id = $1;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_submit_profile(bigint, varchar, varchar, varchar, varchar, varchar) returns boolean as
$$
begin
    IF ((SELECT s.id FROM scope s WHERE s.value = $6) <= (SELECT scope_id FROM users u WHERE u.id = $1)) THEN
        UPDATE users SET scope_id = (SELECT s.id FROM scope s WHERE s.value = $6) WHERE id = $1;
        $6 := null;
    END IF;
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
create or replace function student_submit_solution(bigint, bigint, varchar) returns TABLE(solution_id bigint) as
$$
<<fn>>
declare
    solution_id bigint;
    tests_pos bigint := 1;
    tests_count bigint;
begin
    INSERT INTO solutions(user_id, problem_id, lang) VALUES ($1, $2, $3);
    SELECT lastval() INTO fn.solution_id;
    SELECT p.tests_count INTO fn.tests_count FROM problems p WHERE p.id = $2;
    LOOP
        INSERT INTO solution_tests (solution_id, status, num) VALUES (fn.solution_id, 'waiting', tests_pos);
        tests_pos := tests_pos + 1;
        IF fn.tests_pos > fn.tests_count THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN QUERY SELECT fn.solution_id;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_get_my_solutions(bigint, bigint, bigint, varchar) returns TABLE(solution_id bigint, problem_id bigint, created bigint, status varchar, lang varchar, problem_name varchar, test_count bigint, test_passed bigint) as
$$
begin
    RETURN QUERY
        SELECT
            s.id,
            s.problem_id,
            s.created,
            s.status,
            s.lang,
            COALESCE((SELECT ls.value FROM locale_strings ls WHERE ls.related_id = s.problem_id AND ls.lang = $4 AND ls.related_type = 'name'), (SELECT ls.value FROM locale_strings ls WHERE ls.related_id = s.problem_id AND ls.related_type = 'name' ORDER BY id LIMIT 1)),
            (SELECT COUNT(*) FROM solution_tests st WHERE st.solution_id = s.id),
            (SELECT COUNT(*) FROM solution_tests st WHERE st.solution_id = s.id AND st.status = 'ok'::varchar)
        FROM solutions s
        WHERE s.user_id = $1
        ORDER BY created DESC
        OFFSET $2
        LIMIT $3;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_count_my_solutions(bigint, bigint, bigint, varchar) returns TABLE(count bigint) as
$$
begin
    RETURN QUERY
        SELECT
            COUNT(*)
        FROM solutions s
        WHERE s.user_id = $1;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_get_solutions_by_problem_id(bigint, bigint, bigint, bigint, varchar) returns TABLE(solution_id bigint, problem_id bigint, created bigint, status varchar, lang varchar, problem_name varchar, test_count bigint, test_passed bigint) as
$$
begin
    RETURN QUERY
        SELECT
            s.id,
            s.problem_id,
            s.created,
            s.status,
            s.lang,
            COALESCE((SELECT ls.value FROM locale_strings ls WHERE ls.related_id = s.problem_id AND ls.lang = $5 AND ls.related_type = 'name'), (SELECT ls.value FROM locale_strings ls WHERE ls.related_id = s.problem_id AND ls.related_type = 'name' ORDER BY id LIMIT 1)),
            (SELECT COUNT(*) FROM solution_tests st WHERE st.solution_id = s.id),
            (SELECT COUNT(*) FROM solution_tests st WHERE st.solution_id = s.id AND st.status = 'ok'::varchar)
        FROM solutions s
        WHERE s.user_id = $1 AND s.problem_id = $2
        ORDER BY created DESC
        OFFSET $3
        LIMIT $4;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_count_solutions_by_problem_id(bigint, bigint, bigint, bigint, varchar) returns TABLE(count bigint) as
$$
begin
    RETURN QUERY
        SELECT
            COUNT(*)
        FROM solutions s
        WHERE s.user_id = $1 AND s.problem_id = $2;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_add_problem_comment(bigint, bigint, varchar) returns TABLE(result boolean) as
$$
begin
    INSERT INTO problem_comments (problem_id, user_id, message) VALUES ($1, $2, $3);
    RETURN QUERY
        SELECT
            true;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_send_private_message(bigint, bigint, varchar) returns TABLE(result boolean) as
$$
begin
    INSERT INTO private_messages (from_user_id, to_user_id, message) VALUES ($1, $2, $3);
    RETURN QUERY
        SELECT
            true;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_get_chats(bigint, bigint, bigint) returns TABLE(user_id bigint, user_name varchar, last_message varchar) as
$$
begin
    RETURN QUERY
        SELECT
            t1.user_id,
            u.name,
            (SELECT row_to_json(row) FROM (SELECT pm.message, pm.created, (pm.from_user_id = $1) AS "isMyMessage", pm.is_seen FROM private_messages pm WHERE (pm.from_user_id = t1.user_id OR pm.to_user_id = t1.user_id) AND (pm.from_user_id = $1 OR pm.to_user_id = $1) ORDER BY pm.created LIMIT 1) AS row LIMIT 1)::varchar
        FROM
            (SELECT DISTINCT
                CASE WHEN pm.from_user_id = $1 THEN pm.to_user_id ELSE pm.from_user_id END AS user_id
            FROM private_messages pm
            WHERE pm.from_user_id = $1 OR pm.to_user_id = $1) AS t1
            JOIN users u ON u.id = t1.user_id
        ORDER BY (SELECT pm.created FROM private_messages pm WHERE (pm.from_user_id = t1.user_id OR pm.to_user_id = t1.user_id) AND (pm.from_user_id = $1 OR pm.to_user_id = $1) ORDER BY pm.created LIMIT 1) DESC
        OFFSET $2
        LIMIT $3;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_count_chats(bigint, bigint, bigint) returns TABLE(count bigint) as
$$
begin
    RETURN QUERY
        SELECT
            COUNT(*)
        FROM
            (SELECT DISTINCT
                CASE WHEN pm.from_user_id = $1 THEN pm.to_user_id ELSE pm.from_user_id END AS user_id
            FROM private_messages pm
            WHERE pm.from_user_id = $1 OR pm.to_user_id = $1) AS t1
            JOIN users u ON u.id = t1.user_id;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_get_chat(bigint, bigint, bigint, bigint) returns TABLE(user_id bigint, user_name varchar, message varchar, created bigint, is_seen boolean) as
$$
begin
    RETURN QUERY
        SELECT
            pm.from_user_id,
            u.name,
            pm.message,
            pm.created,
            pm.is_seen
        FROM private_messages pm JOIN users u ON u.id = pm.from_user_id
        WHERE (pm.from_user_id = $2 OR pm.to_user_id = $2) AND (pm.from_user_id = $1 OR pm.to_user_id = $1)
        ORDER BY pm.created DESC
        OFFSET $3
        LIMIT $4;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_count_chat(bigint, bigint, bigint, bigint) returns TABLE(count bigint) as
$$
begin
    RETURN QUERY
        SELECT
            COUNT(*)
        FROM private_messages pm JOIN users u ON u.id = pm.from_user_id
        WHERE (pm.from_user_id = $2 OR pm.to_user_id = $2) AND (pm.from_user_id = $1 OR pm.to_user_id = $1);
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_seen_chat(bigint, bigint) returns TABLE(result boolean) as
$$
begin
    UPDATE private_messages SET is_seen = true WHERE pm.from_user_id = $1 AND pm.to_user_id = $2;
    RETURN QUERY
        SELECT
            true;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------